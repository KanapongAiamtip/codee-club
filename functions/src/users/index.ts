import { DeepRequired } from 'ts-essentials'

import { User } from '@codee-club/common/dist/dao'
import { keys } from '@codee-club/common/dist/utils/object-extensions'

import { Timestamp } from '../_services/firebase-admin-initialized'
import { notificationNewFollower, notificationProfileUpdated, notify } from '../_services/notifications'
import { DocumentUpdatedHandler } from '../types'

export const onUpdateUser: DocumentUpdatedHandler = async (change, context) => {
  // Get data
  const dataBefore = change.before.data() as DeepRequired<User>
  const dataAfter = change.after.data() as DeepRequired<User>
  const now = Timestamp.now()

  // Notification: Profile Updated
  const profileUpdated = dataBefore.bio !== dataAfter.bio || [...new Set([...keys(dataBefore.links), ...keys(dataAfter.links)])].some(key => dataBefore.links[key] !== dataAfter.links[key])
  if (profileUpdated) await notify(dataAfter.followerIds, notificationProfileUpdated(now, context.params.userId, dataAfter))

  // Notification: New Follower
  const beforeFollowingIds = new Set(dataBefore.followingIds)
  const addedFollowingIds = dataAfter.followingIds.filter(id => !beforeFollowingIds.has(id))
  if (addedFollowingIds.length > 0) await notify(addedFollowingIds, notificationNewFollower(now, context.params.userId, dataAfter))
}
