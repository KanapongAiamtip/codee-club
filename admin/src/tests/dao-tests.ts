// TODO: Migrate this to unit tests in the DAO
import { assert } from 'console'

import { Dao, USERS } from '@codee-club/common/dist/dao'

import { context } from '~/context'
import { db } from '~/firebase-admin-initialized'

const dao = new Dao(context)

const userTest = async (): Promise<void> => {
  // Arrange
  const userSave = { nameFirst: 'Rodney', nameLast: 'McKay' }

  // Act
  const userId = await dao.createUser(userSave)
  const userSnap = await db.collection(USERS).doc(userId).get()
  const user = userSnap.data()

  // Assert
  if (!user) throw new Error("User doesn't exist")
  assert(user.name === 'Rodney McKay')
  console.info('✓ userCreate')
  return await Promise.resolve()
}

const userWithIdTest = async (): Promise<void> => {
  // Arrange
  const userId = 'charlesa'
  const userSave = { nameFirst: 'Charles', nameLast: 'Allen' }

  await dao.createUser(userSave, userId)
  const userSnap = await db.collection(USERS).doc(userId).get()
  const user = userSnap.data()
  if (!user) throw new Error("User doesn't exist")
  assert(user.name === 'Charles Allen')
  console.info('✓ userCreateWithId')
  return await Promise.resolve()
}

const main = async (): Promise<void> => {
  await userTest()
  await userWithIdTest()
}

main()
  .then(() => process.exit())
  .catch((error) => console.error(error))
