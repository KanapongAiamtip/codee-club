import { Dao } from '@codee-club/common/dist/dao'

import { context } from '~/context'
import { auth } from '~/firebase-admin-initialized'
import { MODE, productionWarning } from '~/modes'
import migrate from '../migrations/migrate'

import { activitiesAndProblems } from './data/activity-problem'
import { course, studentsWithSections } from './data/course-section'
import { keyedTeachers, keyedTestStudents } from './data/user'

const main = async (): Promise<void> => {
  await productionWarning(__filename)
  if (MODE !== 'emu') return console.warn('This script is exclusively for local testing')

  const dao = new Dao(context)

  // Run the migrations
  await migrate()

  // Runner
  await dao.createRunner({ url: 'https://runner-piston-r3bka4fkka-uc.a.run.app/api' })

  // Teachers
  for (const teacher of keyedTeachers) {
    const { id, data, email } = teacher
    await dao.createUser(data, id)
    await dao.createUserPrivate(id, { email })
    await auth.createUser({ uid: id, email, password: '123456' })
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
  // TODO: Replace with call to "addStudentsToSections" (when implemented)
  for (const student of studentsWithSections) {
    const { id, data, email, sectionId } = student
    await dao.createUserWithCourseSections(data, { [courseId]: sectionId }, id)
    await dao.createUserPrivate(id, { email })
  }

  // Test students
  for (const testStudent of keyedTestStudents) {
    await auth.createUser({ uid: testStudent.id, email: testStudent.email, password: '123456' })
  }
}

main()
  .then(() => process.exit())
  .catch((error) => console.error(error))
