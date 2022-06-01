import { CourseUserImportCallable } from '@codee-club/common/dist/api-callables'
import { Course, COURSES, Dao } from '@codee-club/common/dist/dao'

import { context } from '../_services/context'
import { Handler } from '../types'

const dao = new Dao(context)

function arrayUnion(array: string[] | undefined, item: string): string[] {
  const set = new Set(array ?? [])
  set.add(item)
  return [...set]
}

export const courseUserImport: Handler<CourseUserImportCallable> = async (data, _callableContext) => {
  const { courseId, sectionId, users } = data
  const courseSections = { [courseId]: sectionId }

  // TODO check _callableContext.auth.uid is a creator on courseId

  return await Promise.all(users.map(async userRaw => {
    const { email, ...user } = userRaw
    try {
      const userId = await dao.createOrUpdateUserWithCourseSections(user, courseSections, email)
      const courseRef = context.db.collection(COURSES).doc(courseId)
      await context.db.runTransaction(async (t) => {
        const course = (await t.get(courseRef)).data() as Course
        if (course === undefined || course.sections === undefined) return
        const sections = course.sections
        sections[sectionId].studentIds = arrayUnion(sections[sectionId].studentIds, userId)
        const roleView = arrayUnion(course.roleView, userId)
        await t.update(courseRef, { sections, roleView })
      })
      // TODO Add to any activities
      return userId
    } catch (error) { return { error: error.message } }
  }))
}
