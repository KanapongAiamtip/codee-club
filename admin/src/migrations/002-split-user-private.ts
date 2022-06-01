import { USERS, USERS_PRIVATE } from '@codee-club/common/dist/dao'

import admin from '~/firebase-admin-initialized'

const BATCH_LIMIT = 450

interface MigrationDataBefore {
  email?: string
  lastTokenNuConnect?: string
}
interface MigrationDataAfter {
  email?: string
  nuConnectToken?: string
}

export const up = async (db: admin.firestore.Firestore): Promise<void> => {
  // Setup
  const fv = admin.firestore.FieldValue

  const refUsers = db.collection(USERS)
  const refUsersPrivate = db.collection(USERS_PRIVATE)

  // Get existing data
  const usersSnap = await refUsers.get()
  const users = usersSnap.docs.map(doc => {
    return { id: doc.id, data: doc.data() as MigrationDataBefore }
  })

  // Migrate
  let batch = db.batch()
  let writes = 0

  for (const user of users) {
    // Room in batch?
    if (writes >= BATCH_LIMIT) {
      await batch.commit()
      batch = db.batch()
      writes = 0
    }

    // Needs migration?
    if ('email' in user.data || 'lastTokenNuConnect' in user.data) {
      const data: MigrationDataAfter = {}
      if (user.data.email) data.email = user.data.email
      if (user.data.lastTokenNuConnect) data.nuConnectToken = user.data.lastTokenNuConnect

      batch.set(refUsersPrivate.doc(user.id), data, { merge: true })
      batch.set(refUsers.doc(user.id), { email: fv.delete(), lastTokenNuConnect: fv.delete() }, { merge: true })
      writes += 2
    }
  }

  if (writes > 0) await batch.commit()
}
