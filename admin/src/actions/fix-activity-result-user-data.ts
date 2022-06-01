import { DeepRequired } from 'ts-essentials'

import { ACTIVITY_RESULTS, ActivityResult, User, USERS } from '@codee-club/common/dist/dao'
import { UpdateComplete } from '@codee-club/common/dist/dao/impl/dao-types'

import { db } from '~/firebase-admin-initialized'
import { productionWarning } from '~/modes'

const main = async (): Promise<void> => {
  await productionWarning(__filename)

  const allUsersPromise = db.collection(USERS).get()
  const allActivityResultsPromise = db.collection(ACTIVITY_RESULTS).get()

  const allUsers: Array<{ id: string, name: string, avatarUrl: string }> = (await allUsersPromise).docs.map((doc) => {
    const { name, avatarUrl } = doc.data() as DeepRequired<User>
    return { id: doc.id, name, avatarUrl }
  })

  const allActivityResults: Array<{ id: string, userId: string, userName: string, userAvatarUrl: string }> = (await allActivityResultsPromise).docs.map((doc) => {
    const { userId, userName, userAvatarUrl } = doc.data() as DeepRequired<ActivityResult>
    return { id: doc.id, userId, userName, userAvatarUrl }
  })

  for (const user of allUsers) {
    await db.runTransaction(async (t) => {
      const userResults = allActivityResults.filter((ar) => ar.userId === user.id && (ar.userName !== user.name || ar.userAvatarUrl !== user.avatarUrl))
      await Promise.all(
        userResults.map((ar) => {
          const update: UpdateComplete<ActivityResult> = { userName: user.name, userAvatarUrl: user.avatarUrl }
          return t.set(db.collection(ACTIVITY_RESULTS).doc(ar.id), update, { merge: true })
        })
      )
      if (userResults.length > 0) console.info(`Fixed ${userResults.length} ActivityResults for user ${user.id}`)
    })
  }
  console.info('Complete')
}

main()
  .then(() => process.exit())
  .catch((error) => console.error(error))
