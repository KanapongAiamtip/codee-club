import mapValues from 'lodash/mapValues'
import { DeepRequired } from 'ts-essentials'

import { TestInputs, TestOutputs, TestRequestBody } from '@codee-club/common/dist/api-runners'
import { ACTIVITY_PROBLEM_SETS, ACTIVITY_RESULTS, ActivityProblemSet, ActivityResult, CONFIG, CONFIG_LANGUAGES, CONFIG_STATISTICS, ConfigLanguages, ConfigStatistics, SubmissionJob, TestResult } from '@codee-club/common/dist/dao'
import { Update, UpdateComplete } from '@codee-club/common/dist/dao/impl/dao-types'
import { ProblemResultStatus, TestResultStatus } from '@codee-club/common/dist/data-types/enums'
import { keys, length } from '@codee-club/common/dist/utils/object-extensions'

import admin from '../_services/firebase-admin-initialized'
import { getToken } from '../_services/gcp/get-token'
import { post } from '../_services/request-helpers/get-post'
import { DocumentCreatedHandler } from '../types'

const db = admin.firestore()

// TODO: Equivalence options (e.g. strict, lenient)
const equivalent = (expected: string, actual: string): boolean => expected.trim() === actual.trim()

// eslint-disable-next-line radar/cognitive-complexity -- TODO: Refactor
export const onCreateSubmission: DocumentCreatedHandler = async (snapshot, _context) => {
  const submission = snapshot.data() as SubmissionJob

  // Lookup tests
  const activityProblemSetSnapshot = await db.collection(ACTIVITY_PROBLEM_SETS).doc(submission.activityId).get()
  const activity = activityProblemSetSnapshot.data() as DeepRequired<ActivityProblemSet> | undefined
  const problemCount = length(activity?.problems)
  const tests = activity?.problems?.[submission.problemId]?.tests
  if (!problemCount || !tests) {
    return console.error(`Tests not found for activity: ${submission.activityId}, problem: ${submission.problemId}`)
  }

  // Find the runner
  const languagesSnapshot = await db.collection(CONFIG).doc(CONFIG_LANGUAGES).get()
  const languagesMap = languagesSnapshot.data() as ConfigLanguages
  if (!(submission.language in languagesMap)) {
    return console.error(`Runner for ${submission.language} not found`)
  }
  const runner = languagesMap[submission.language]

  // Prepare request
  const inputs: TestInputs = mapValues(tests, 'input')
  const data: TestRequestBody = { inputs, sourceRefs: submission.fileRefs }

  // Call runner
  const token = await getToken(runner.url)
  const headers = { Authorization: `Bearer ${token}` }
  let response: { body: { error: string } | { invalid: string } | { outputs: TestOutputs } }
  try {
    response = await post({
      url: runner.url,
      headers,
      data,
      timeout: 301_000
    })
  } catch (error) {
    // Unexpected error (something up with the runner)
    console.error(error)
    response = { body: { error: error.message } } // TODO: Probably don't share the real error with the user
  }

  // Handle errors
  const body = response.body
  if ('error' in body || 'invalid' in body) {
    const errorOutput = ('invalid' in body) ? body.invalid : body.error
    const errorStatus = ('invalid' in body) ? ProblemResultStatus.Invalid : (body.error === 'Timeout reached' ? ProblemResultStatus.Timeout : ProblemResultStatus.Error)

    // TODO Need to check if we should set isFirstBest
    const problemResultUpdate: Update<ActivityResult> = {
      [`problemResults.${submission.problemResultId}.status`]: errorStatus,
      [`problemResults.${submission.problemResultId}.errorOutput`]: errorOutput // TODO: Check all deep-updated fields actually exist on the types! (can we make a type for this?!)
    }
    await db.collection(ACTIVITY_RESULTS).doc(submission.activityResultId).update(problemResultUpdate)

    const statisticsUpdate = { submissionCompileFailures: admin.firestore.FieldValue.increment(1) }
    await db.collection(CONFIG).doc(CONFIG_STATISTICS).update(statisticsUpdate)

    return
  }

  // Compare and create the results
  const outputs: TestOutputs = body.outputs
  const testResults: Array<DeepRequired<TestResult>> = keys(tests).map((testId) => {
    const expected = tests[testId].expected ?? ''
    const actual = outputs[testId].output ?? ''
    const error = outputs[testId].error ?? ''

    return {
      testId,
      actual,
      error,
      status: !error && equivalent(expected, actual) ? TestResultStatus.Pass : TestResultStatus.Fail
    }
  })

  // Problem result
  const numberOfTests = testResults.length
  const numberOfTestsPassed = testResults.filter((tr) => tr.status === TestResultStatus.Pass).length
  const percent = numberOfTests > 0 ? (100 * numberOfTestsPassed) / numberOfTests : 0
  const status = numberOfTests > 0 && numberOfTests === numberOfTestsPassed ? ProblemResultStatus.Pass : ProblemResultStatus.Fail

  // Recalculate and save results
  // TODO Chaz - Move to DAO
  const activityResultRef = db.collection(ACTIVITY_RESULTS).doc(submission.activityResultId)
  try {
    await db.runTransaction(async (t) => {
      const activityResultSnapshot = await t.get(activityResultRef)
      const activityResult = activityResultSnapshot.data() as DeepRequired<ActivityResult>

      const allProblemResults = activityResult.problemResults
      const firstBestProblemResultIds = keys(allProblemResults).filter((prId) => allProblemResults[prId].isFirstBest)
      const thisProblemFirstBestProblemResultId = firstBestProblemResultIds.find((prId) => allProblemResults[prId].problemId === submission.problemId)

      // No previous result OR better than previous
      const isFirstBest = !thisProblemFirstBestProblemResultId || numberOfTestsPassed > allProblemResults[thisProblemFirstBestProblemResultId].passCount

      // Current problem result
      const problemResultUpdate: Update<ActivityResult> = {
        [`problemResults.${submission.problemResultId}.percent`]: percent,
        [`problemResults.${submission.problemResultId}.status`]: status,
        [`problemResults.${submission.problemResultId}.testResults`]: testResults,
        [`problemResults.${submission.problemResultId}.testCount`]: numberOfTests,
        [`problemResults.${submission.problemResultId}.passCount`]: numberOfTestsPassed,
        [`problemResults.${submission.problemResultId}.failCount`]: numberOfTests - numberOfTestsPassed,
        [`problemResults.${submission.problemResultId}.isFirstBest`]: isFirstBest
      }

      // Existing problem result
      const previousBestProblemResultUpdate: Update<ActivityResult> =
        isFirstBest && thisProblemFirstBestProblemResultId
          ? {
              [`problemResults.${thisProblemFirstBestProblemResultId}.isFirstBest`]: false
            }
          : {}

      // Recalculate the activity result (only if current is an improvement)
      // TODO: Good luck refactoring this without let :'(
      let aggregatesUpdate = {} // TODO Chaz: This cannot have a type here because the fields are DAO restricted (will be a calc after migration to DAO)
      if (isFirstBest) {
        const otherFirstBestProblemResults: Array<{ status: string, percent: number }> = firstBestProblemResultIds.filter((prId) => prId !== thisProblemFirstBestProblemResultId).map((prId) => allProblemResults[prId])
        const firstBestProblemResults = [...otherFirstBestProblemResults, ({ status, percent })]

        const overall: { completeCount: number, totalScore: number } = firstBestProblemResults.reduce( // eslint-disable-line unicorn/no-array-reduce -- TBD in separate branch
          (acc, value) => {
            acc.completeCount += value.status === ProblemResultStatus.Pass ? 1 : 0
            acc.totalScore += value.percent
            return acc
          },
          { completeCount: 0, totalScore: 0 }
        )

        aggregatesUpdate = {
          isComplete: overall.completeCount === problemCount,
          totalScore: overall.totalScore,
          totalPercent: overall.totalScore / problemCount,
          lastImprovement: submission.originalDate.seconds > activityResult.lastImprovement.seconds ? submission.originalDate : activityResult.lastImprovement
        }
      }

      const activityResultUpdate = { ...problemResultUpdate, ...previousBestProblemResultUpdate, ...aggregatesUpdate }

      return t.update(activityResultRef, activityResultUpdate)
    })

    const statisticsUpdate: UpdateComplete<ConfigStatistics> = status === ProblemResultStatus.Pass ? { submissionSuccesses: admin.firestore.FieldValue.increment(1) } : { submissionTestFailures: admin.firestore.FieldValue.increment(1) }
    await db.collection(CONFIG).doc(CONFIG_STATISTICS).update(statisticsUpdate)
  } catch (error) {
    console.error(error)
  }
}
