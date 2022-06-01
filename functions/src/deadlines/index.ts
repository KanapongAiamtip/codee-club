import { DeepRequired } from 'ts-essentials'

import { Course, COURSES } from '@codee-club/common/dist/dao'
import { ActivityStatus } from '@codee-club/common/dist/data-types/enums'
import { entries } from '@codee-club/common/dist/utils/object-extensions'

import admin, { db, Timestamp } from '../_services/firebase-admin-initialized'
import { notificationDeadlineReminder, notify } from '../_services/notifications'
import { ScheduleHandler } from '../types'

type TimestampType = admin.firestore.Timestamp

const ONE_DAY_SECONDS = 86_400
const NOTIFY_AT_DAYS = new Set([0, 1, 5])

export const sendDeadlineReminders: ScheduleHandler = async (_context) => {
  // Get all courses
  const coursesSnapshot = await db.collection(COURSES).get()
  const courses = coursesSnapshot.docs.map(doc => doc.data() as DeepRequired<Course>)

  // Find all future deadlines
  const now = Timestamp.now()
  const nowSeconds = now.seconds
  const deadlines: Array<{ courseSlug: string, activitySlug: string, studentIds: string[], dueDate: TimestampType, activityName: string }> =
    courses.flatMap(course => // for each course...
      entries(course.activities) // get its activities
        .filter(activityIdAndActivity => activityIdAndActivity[1].status === ActivityStatus.Published) // ...only published activities
        .flatMap(activityIdAndActivity => // for each activity...
          entries(activityIdAndActivity[1].deadlines) // get its deadlines
            .filter(sectionIdAndDeadline => (sectionIdAndDeadline[1]?.seconds ?? 0) > nowSeconds) // ...only future deadlines
            .map(sectionIdAndDeadline => ({ // collect the data we need
              courseSlug: course.slug,
              activitySlug: activityIdAndActivity[1].slug,
              activityName: activityIdAndActivity[1].name,
              studentIds: course.sections[sectionIdAndDeadline[0]]?.studentIds ?? [],
              dueDate: sectionIdAndDeadline[1]
            }))
        )
    )

  // Send notifications
  console.info(`Notifying: ${deadlines.length} deadlines`)
  for (const deadline of deadlines) {
    const dueInSeconds = deadline.dueDate.seconds - nowSeconds
    const dueInDays = Math.floor(dueInSeconds / ONE_DAY_SECONDS)
    if (NOTIFY_AT_DAYS.has(dueInDays)) await notify(deadline.studentIds, notificationDeadlineReminder(now, deadline.courseSlug, deadline.activitySlug, deadline.activityName, dueInDays))
  }
  return null
}
