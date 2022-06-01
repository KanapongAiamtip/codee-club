import { TokenRequestCallable, UrlRequestCallable } from '@codee-club/common/dist/api-callables'
import { CONFIG, CONFIG_STATISTICS, ConfigStatistics, Dao, New, Update, User, UserPrivate, USERS, USERS_PRIVATE } from '@codee-club/common/dist/dao'
import { UpdateComplete } from '@codee-club/common/dist/dao/impl/dao-types'
import { fixName } from '@codee-club/common/dist/utils/string-cases'

import { context } from '../_services/context'
import admin, { db } from '../_services/firebase-admin-initialized'
import { Handler } from '../types'

import { authorizeUrl, exchangeAuthCodeForToken, getUserIdentity } from './nu-connect'

const dao = new Dao(context)

export const getUrl: Handler<UrlRequestCallable> = (data, _context) => {
  return authorizeUrl(data.redirectUri)
}

export const getToken: Handler<TokenRequestCallable> = async (data, _context) => {
  const response = await exchangeAuthCodeForToken(data.authCode, data.redirectUri)
  if ('error' in response.body) {
    console.error(response.body.error)
    return { error: 'Failed to exchange NU token' }
  }

  // Get the NU user profile
  // TODO Ant - this should not assume success
  const nuToken = response.body
  const userIdentity = await getUserIdentity(nuToken)

  // Look up the user in Firestore
  let userId: string | undefined
  let userData: admin.firestore.DocumentData | undefined
  try {
    const userPrivateSnapshot = await db.collection(USERS_PRIVATE).where('email', '==', userIdentity.email).limit(1).get()
    userId = userPrivateSnapshot.docs[0]?.id
    if (userId) {
      const userSnapshot = await db.collection(USERS).doc(userId).get()
      userData = userSnapshot.data()
    }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to load profile' }
  }

  // Update Codee profile
  const { nameFirst, nameLast } = fixName(userIdentity.name)
  const existingName = (userData?.name as string | undefined) ?? ''
  if (userData) {
    const update: Update<User> = existingName
      ? {
          code: userIdentity.username
        }
      : {
          code: userIdentity.username,
          nameFirst,
          nameLast
        }
    const updatePrivate: Update<UserPrivate> = {
      nuConnectToken: nuToken
    }

    await dao.updateUser(userId, update)
    await dao.updateUserPrivate(userId, updatePrivate)
  } else {
    const user: New<User> = {
      code: userIdentity.username,
      nameFirst,
      nameLast
    }
    const userPrivate: New<UserPrivate> = {
      email: userIdentity.email,
      nuConnectToken: nuToken
    }

    userId = await dao.createUser(user)
    await dao.createUserPrivate(userId, userPrivate)

    const memberCounterUpdate: UpdateComplete<ConfigStatistics> = { members: admin.firestore.FieldValue.increment(1) }
    await db.collection(CONFIG).doc(CONFIG_STATISTICS).update(memberCounterUpdate)
  }

  // Convert to Firebase Auth
  return await admin
    .auth()
    .createCustomToken(userId)
    .catch((error) => {
      console.error(error)
      return { error: 'Failed to create Firebase token' }
    })
}
