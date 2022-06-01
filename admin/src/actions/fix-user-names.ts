import { DeepRequired } from 'ts-essentials'

import { User, USERS } from '@codee-club/common/dist/dao'
import { UpdateComplete } from '@codee-club/common/dist/dao/impl/dao-types'
import { fixName } from '@codee-club/common/dist/utils/string-cases'

import admin from '~/firebase-admin-initialized'
import { productionWarning } from '~/modes'

const db = admin.firestore()

const main = async (): Promise<void> => {
  await productionWarning(__filename)

  const allUsersSnap = await db.collection(USERS).get()
  const allUsers: Array<{ id: string, data: DeepRequired<User> }> = allUsersSnap.docs.map((doc) => ({ id: doc.id, data: doc.data() as DeepRequired<User> }))

  for (const user of allUsers) {
    // Fix
    const fixed = fixName(user.data.name)

    // Compare & commit
    if (fixed.name !== user.data.name || fixed.nameFirst !== user.data.nameFirst || fixed.nameLast !== user.data.nameLast) {
      const update: UpdateComplete<User> = fixed
      console.info(`Fixing: ${user.data.name} => ${fixed.name} [${user.id}]`)
      await db.collection(USERS).doc(user.id).set(update, { merge: true })
    }
  }
  console.info('Complete')
}

main()
  .then(() => process.exit())
  .catch((error) => console.error(error))
