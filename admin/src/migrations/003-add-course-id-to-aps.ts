import admin from 'firebase-admin'

import { ACTIVITY_PROBLEM_SETS, Course, COURSES } from '@codee-club/common/dist/dao'

export const up = async (db: admin.firestore.Firestore): Promise<void> => {
  const batch = db.batch()

  const apsRef = db.collection(ACTIVITY_PROBLEM_SETS)
  const coursesSnap = await db.collection(COURSES).get()
  for (const courseDoc of coursesSnap.docs) {
    const course = courseDoc.data() as Course
    for (const activityId in course.activities) {
      batch.set(apsRef.doc(activityId), { courseId: courseDoc.id }, { merge: true })
    }
  }

  await batch.commit()
}
