// import type { Problem, Test, ActivityResult, ProblemResult, TestResult } from '@codee-club/common/dist/dao'
// import keyBy from 'lodash/keyBy'
// import firebase from '@codee-club/common/dist/firebase-initialized'
// import { round } from '@codee-club/common/dist/utils/math'
// import { values } from '@codee-club/common/dist/utils/object-extensions'
// import { randomIntBetween, randomBool } from '@codee-club/common/dist/utils/random'
// import { teacherGuids } from './users'
// import getGuid from '~/get-guid'

// function createTestResult(test: Test, forcePass = false): TestResult {
//   const statuses = ['PASS', 'FAIL'] // TODO Chaz: Use enum once defined
//   const isPass = forcePass || randomBool()

//   return {
//     testGuid: test.guid,
//     seq: test.seq ?? 1,
//     status: isPass ? statuses[0] : statuses[1],
//     actual: isPass ? test.expected ?? '' : test.expected?.toLowerCase() ?? ''
//   }
// }

// function createProblemResult(problem: Problem, forcePass = false): ProblemResult {
//   const statuses = ['EVALUATING', 'PASS', 'FAIL'] // TODO Chaz: Use enum once defined
//   const testResults = values(problem.tests).map((test) => createTestResult(test, forcePass))
//   const isPass = testResults.every((testResult) => testResult.status === 'PASS')

//   return {
//     guid: getGuid(),
//     problemGuid: problem.guid,
//     date: firebase.firestore.Timestamp.fromMillis(new Date().getTime() - randomIntBetween(0, 604800000)), // 1000 * 60 * 60 * 24 * 7
//     language: 'java15',
//     fileRefs: [],
//     status: isPass ? statuses[1] : statuses[2],
//     percent: round((100.0 * testResults.filter((res) => res.status === 'PASS').length) / testResults.length, 2),
//     isFirstBest: false,
//     testResults: testResults
//   }
// }

// export function createActivityResult(userGuid: string, activityGuid: string, problems: Array<Problem>): ActivityResult {
//   const problemResults = problems.flatMap((problem) => {
//     const isTeacher = teacherGuids.includes(userGuid)
//     const attempts: Array<ProblemResult> = Array.from({ length: isTeacher ? 1 : randomIntBetween(0, 5) }, (_, _idx) => createProblemResult(problem, isTeacher))

//     attempts.sort((a1: ProblemResult, a2: ProblemResult) => a1.percent - a2.percent)
//     const best = attempts?.[0]
//     if (best) best.isFirstBest = true

//     return attempts
//   })

//   const passCount = problemResults.filter((pRes) => pRes.isFirstBest && pRes.status === 'PASS').length
//   return {
//     userGuid: userGuid,
//     activityGuid: activityGuid,
//     percent: round((100.0 * passCount) / problems.length, 2),
//     isComplete: problems.length === passCount,
//     problemResults: keyBy(problemResults, (res) => res.guid)
//   }
// }
