import { CONFIG, CONFIG_STATISTICS, ConfigStatistics, Dao, New } from '@codee-club/common/dist/dao'

import { context } from '~/context'
import { auth, db } from '~/firebase-admin-initialized'
import { productionWarning } from '~/modes'

import { activitiesAndProblems, course, keyedTeachers, studentsWithSections, testStudents } from './data-oop/course-oop'

const main = async (): Promise<void> => {
  await productionWarning(__filename)

  const dao = new Dao(context)

  // Teachers
  for (const teacher of keyedTeachers) {
    const { id, data } = teacher
    await dao.createUser(data, id)
  }

  // Course
  const courseId = await dao.createCourse(course)

  // Problems
  for (const activityAndProblems of activitiesAndProblems) {
    const { activity, problems } = activityAndProblems
    const activityId = await dao.createActivity(courseId, activity)
    await dao.createProblems(activityId, problems)
  }

  // Students
  for (const student of studentsWithSections) {
    const { id, data, sectionId } = student
    await dao.createUserWithCourseSections(data, { [courseId]: sectionId }, id)
  }
  // Test student
  for (const testStudent of testStudents) {
    await auth.createUser({ uid: testStudent.id, email: testStudent.data.email, password: '123456' })
  }

  // Runner
  await dao.createRunner({ url: 'https://runner-java-r3bka4fkka-uc.a.run.app' })

  // Statistics
  const statisticsRef = db.collection(CONFIG).doc(CONFIG_STATISTICS)
  if (!(await statisticsRef.get()).exists) {
    const defaultStatistics: New<ConfigStatistics> = { members: 0, submissionSuccesses: 0, submissionCompileFailures: 0, submissionTestFailures: 0 }
    await statisticsRef.set(defaultStatistics)
  }
}

main()
  .then(() => process.exit())
  .catch((error) => console.error(error))
