import fs from 'fs'
import path from 'path'
import { DeepRequired } from 'ts-essentials'

import { ACTIVITY_PROBLEM_SETS, ACTIVITY_RESULTS, ActivityProblemSet, ActivityResult, Course, COURSES, User, USERS } from '@codee-club/common/dist/dao'
import { keys } from '@codee-club/common/dist/utils/object-extensions'

import { db } from '~/firebase-admin-initialized'
import { productionWarning } from '~/modes'

// eslint-disable-next-line radar/cognitive-complexity -- TODO: Refactor
const main = async (): Promise<void> => {
  await productionWarning(__filename)

  const [courseSlug, activitySlug] = process.argv.filter((a) => !a.startsWith('--')).slice(-2)
  if (!courseSlug || !activitySlug) {
    console.error('USAGE: download-scores-csv.ts COURSE_SLUG ACTIVITY_SLUG [--mode=MODE]')
    return
  }

  const strictDeadlines = process.argv.find((a) => a === '--strict')

  const courseSnapshot = await db.collection(COURSES).where('slug', '==', courseSlug).limit(1).get()
  if (courseSnapshot.empty) {
    console.error(`Course slug ${courseSlug} not found`)
    return
  }

  const courseId = courseSnapshot.docs[0].id
  const course = courseSnapshot.docs[0].data() as DeepRequired<Course>
  const activityId = keys(course.activities).find((id) => course.activities[id].slug === activitySlug)
  if (!activityId) {
    console.error(`Activity slug ${activitySlug} not found`)
    return
  }

  const activityProblemSetSnapshot = await db.collection(ACTIVITY_PROBLEM_SETS).doc(activityId).get()
  const activityProblemSet = activityProblemSetSnapshot.data() as DeepRequired<ActivityProblemSet>
  const activityResultsSnapshot = await db.collection(ACTIVITY_RESULTS).where('courseId', '==', courseId).where('activityId', '==', activityId).get()
  const activityResults = activityResultsSnapshot.docs.map((doc) => (doc.data() as DeepRequired<ActivityResult>))

  const problemsOrdered = keys(activityProblemSet.problems).map(id => ({ id, ...activityProblemSet.problems[id] })).sort((a, b) => a.seq - b.seq)

  const csvLines = ['Section,Name,Student Code,Total Percent,Total Score,' + problemsOrdered.map(p => `P${p.seq} Score`).join(',')]

  for (const sectionId in course.sections) {
    const section = course.sections[sectionId]
    const sectionDeadlineMillis = course.activities[activityId].deadlines[sectionId]?.toMillis() ?? Date.now()
    // TODO Ant - replace when we have fixed the courseAndSectionIds on users in production
    // const users = (await db.collection(USERS).where('courseAndSectionIds', 'array-contains', `${courseId}_${sectionId}`).get()).docs.map(snap => ({ id: snap.id, data: snap.data() as DeepRequired<User> }))
    const users = (await Promise.all(section.studentIds.map(async id => await db.collection(USERS).doc(id).get()))).map(snap => ({ id: snap.id, data: snap.data() as DeepRequired<User> }))
    for (const user of users) {
      const result = activityResults.find(ar => ar.userId === user.id)
      if (!result) continue
      let totalPercent: number, totalScore: number, problemScores: number[]
      if (strictDeadlines) {
        problemScores = problemsOrdered
          .map(problem => keys(result.problemResults)
            .filter(problemResultId => result.problemResults[problemResultId].date.toMillis() < sectionDeadlineMillis && result.problemResults[problemResultId].problemId === problem.id)
            .reduce((acc: number, id) => Math.max(acc, result.problemResults[id].percent), 0)) // eslint-disable-line unicorn/no-array-reduce -- TBD in separate branch
        totalScore = problemScores.reduce((acc: number, val) => acc + (typeof val === 'number' ? val : 0), 0) // eslint-disable-line unicorn/no-array-reduce -- TBD in separate branch
        totalPercent = totalScore / problemsOrdered.length
      } else {
        problemScores = problemsOrdered
          .map(problem => keys(result.problemResults)
            .find(problemResultId => result.problemResults[problemResultId].isFirstBest && result.problemResults[problemResultId].problemId === problem.id))
          .map(problemResultId => problemResultId ? result.problemResults[problemResultId].percent : 0)
        totalScore = result.totalScore
        totalPercent = result.totalPercent
      }
      csvLines.push(`${section.code},${user.data.name},${user.data.code},${totalPercent.toFixed(2)},${totalScore.toFixed(2)},${problemScores.map(x => x.toFixed(2)).join(',')},${result.lastImprovement.toDate().toISOString()}`)
    }
  }

  const pathToRoot = '../../'
  const filename = `${course.slug} ${activitySlug}.csv`
  const destination = path.join(__dirname, pathToRoot, filename)
  fs.writeFileSync(destination, csvLines.join('\n'))

  console.info(`Saved to: ${filename}`)
}

main()
  .then(() => process.exit())
  .catch((error) => console.error(error))
