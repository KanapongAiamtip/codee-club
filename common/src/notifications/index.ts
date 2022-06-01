import firebase from 'firebase/app'

type Timestamp = firebase.firestore.Timestamp

interface NotificationBase {
  date: Timestamp
}

export const PROFILE_UPDATED = 'PROFILE_UPDATED'
export interface NotificationProfileUpdated extends NotificationBase {
  notificationType: typeof PROFILE_UPDATED
  userId: string
  userNameFirst: string
  imageUrl: string
}

export const NEW_FOLLOWER = 'NEW_FOLLOWER'
export interface NotificationNewFollower extends NotificationBase {
  notificationType: typeof NEW_FOLLOWER
  followerId: string
  followerNameFirst: string
  imageUrl: string
}

export const DEADLINE_REMINDER = 'DEADLINE_REMINDER'
export interface NotificationDeadlineReminder extends NotificationBase {
  notificationType: typeof DEADLINE_REMINDER
  courseSlug: string
  activitySlug: string
  activityName: string
  dueInDays: number
}

export const DEADLINE_SET = 'DEADLINE_SET'
export interface NotificationDeadlineSet extends NotificationBase {
  notificationType: typeof DEADLINE_SET
  activityId: string
  activityName: string
  deadline: Timestamp
  isUpdate: boolean
}

export const NOTIFICATIONS_TYPES_STUDY = [DEADLINE_REMINDER, DEADLINE_SET]

export type Notification = NotificationProfileUpdated | NotificationNewFollower | NotificationDeadlineReminder | NotificationDeadlineSet
