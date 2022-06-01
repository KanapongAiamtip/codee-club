import mapValues from 'lodash/mapValues'
import moment from 'moment'
import { DeepRequired } from 'ts-essentials'

import { Course, COURSES, Dao } from '@codee-club/common/dist/dao'
import { keys } from '@codee-club/common/dist/utils/object-extensions'

import { context } from '~/context'
import admin, { db } from '~/firebase-admin-initialized'
import { productionWarning } from '~/modes'

import { activityAndProblems as activity2 } from './data-oop/course-oop-activity2'
import { activityAndProblems as activity3 } from './data-oop/course-oop-activity3'
import { activityAndProblems as activity4 } from './data-oop/course-oop-activity4'
import { activityAndProblems as activity5 } from './data-oop/course-oop-activity5'
import { ActivityAndProblems } from './types/activity-types'

const allActivities: {
  [id: string]: ActivityAndProblems | undefined
} = {
  2: activity2,
  3: activity3,
  4: activity4,
  5: activity5
}

const main = async (args: string[]): Promise<void> => {
  await productionWarning(__filename)

  const dao = new Dao(context)

  // Read the activity file
  const activityIndex = args[args.length - 1]
  const activityAndProblems = allActivities[activityIndex]
  if (!activityAndProblems) {
    return console.error(`Last argument should be a valid activity number. Options are: ${keys(allActivities).join(', ')}`)
  }

  // Course
  const courseSnapshot = (await db.collection(COURSES).where('code', '==', '254275').get()).docs[0]
  const courseId = courseSnapshot.id
  const course = courseSnapshot.data() as DeepRequired<Course>

  // Seed activity and problems
  const { activity, problems, deadline } = activityAndProblems
  activity.sectionIds = keys(course.sections)
  activity.deadlines = mapValues(course.sections, () => admin.firestore.Timestamp.fromDate(moment(deadline).toDate()))
  const activityId = await dao.createActivity(courseId, activity)
  await dao.createProblems(activityId, problems)
}

main(process.argv)
  .then(() => process.exit())
  .catch((error) => console.error(error))
