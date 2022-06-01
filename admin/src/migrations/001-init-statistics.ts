import admin from 'firebase-admin'

import { CONFIG, CONFIG_STATISTICS } from '@codee-club/common/dist/dao'

export const up = async (db: admin.firestore.Firestore): Promise<void> => {
  const statisticsRef = db.collection(CONFIG).doc(CONFIG_STATISTICS)

  return await db.runTransaction(async t => {
    const statistics = await t.get(statisticsRef)
    if (!statistics.exists) {
      const emptyStatistics = {
        members: 0,
        submissionSuccesses: 0,
        submissionCompileFailures: 0,
        submissionTestFailures: 0
      }
      await t.set(statisticsRef, emptyStatistics)
    }
  })
}
