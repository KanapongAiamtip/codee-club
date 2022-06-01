
import { DeepRequired } from 'ts-essentials'

import { New, Update, User, UserPrivate, USERS_PRIVATE } from '@codee-club/common/dist/dao'
import { DEADLINE_REMINDER, DEADLINE_SET, NEW_FOLLOWER, Notification, NotificationDeadlineReminder, NotificationDeadlineSet, NotificationNewFollower, NotificationProfileUpdated, PROFILE_UPDATED } from '@codee-club/common/dist/notifications'

import admin, { db, FieldValue } from '../firebase-admin-initialized'

type TimestampType = admin.firestore.Timestamp

export const notify = async (recipientIds: string[], notification: New<Notification>): Promise<unknown> => {
  const userUpdate: Update<UserPrivate> = { notifications: FieldValue.arrayUnion(notification) }

  return await Promise.all(
    recipientIds.map(async recipientId => await db.collection(USERS_PRIVATE).doc(recipientId).set(userUpdate, { merge: true }))
  ).catch(error => console.error(error))
}

export const notificationDeadlineReminder = (date: TimestampType, courseSlug: string, activitySlug: string, activityName: string, dueInDays: number): New<NotificationDeadlineReminder> => ({
  notificationType: DEADLINE_REMINDER,
  date,
  courseSlug,
  activitySlug,
  activityName,
  dueInDays
})

export const notificationDeadlineSet = (date: TimestampType, activityId: string, activityName: string, deadline: TimestampType, isUpdate: boolean): New<NotificationDeadlineSet> => ({
  notificationType: DEADLINE_SET,
  date,
  activityId,
  activityName,
  deadline,
  isUpdate
})

export const notificationNewFollower = (date: TimestampType, followerId: string, follower: DeepRequired<User>): New<NotificationNewFollower> => ({
  notificationType: NEW_FOLLOWER,
  date,
  imageUrl: follower.avatarUrl,
  followerId: followerId,
  followerNameFirst: follower.nameFirst
})

export const notificationProfileUpdated = (date: TimestampType, userId: string, user: DeepRequired<User>): New<NotificationProfileUpdated> => ({
  notificationType: PROFILE_UPDATED,
  date,
  imageUrl: user.avatarUrl,
  userId,
  userNameFirst: user.nameFirst
})
