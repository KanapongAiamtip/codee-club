import admin from 'firebase-admin'

import { USERS, USERS_PRIVATE } from '@codee-club/common/dist/dao'
import { userDefaults, userPrivateDefaults } from '@codee-club/common/dist/dao/impl/defaults'

export const up = async (db: admin.firestore.Firestore): Promise<void> => {
  await fix(db, USERS, userDefaults)
  await fix(db, USERS_PRIVATE, userPrivateDefaults)
}

const fix = async (db: admin.firestore.Firestore, collection: string, defaults: {}): Promise<void> => {
  let batch = db.batch()
  let batchSize = 0

  const snapshot = await db.collection(collection).get()
  console.info('Fixing', collection, snapshot.size)
  for (const doc of snapshot.docs) {
    // Ensure all fields present
    batch.set(db.collection(collection).doc(doc.id), { ...defaults, ...doc.data() })
    batchSize++

    // Intermediate commits
    if (batchSize === 450) {
      await batch.commit()
      batch = db.batch()
      batchSize = 0
    }
  }

  // Final commit
  await batch.commit()
  console.info('Fixing defaults', collection, 'DONE')
}
