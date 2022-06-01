import { DeepRequired } from 'ts-essentials';
import { New, User } from '@codee-club/common/dist/dao';
import { Notification, NotificationDeadlineReminder, NotificationDeadlineSet, NotificationNewFollower, NotificationProfileUpdated } from '@codee-club/common/dist/notifications';
import admin from '../firebase-admin-initialized';
declare type TimestampType = admin.firestore.Timestamp;
export declare const notify: (recipientIds: string[], notification: New<Notification>) => Promise<unknown>;
export declare const notificationDeadlineReminder: (date: TimestampType, courseSlug: string, activitySlug: string, activityName: string, dueInDays: number) => New<NotificationDeadlineReminder>;
export declare const notificationDeadlineSet: (date: TimestampType, activityId: string, activityName: string, deadline: TimestampType, isUpdate: boolean) => New<NotificationDeadlineSet>;
export declare const notificationNewFollower: (date: TimestampType, followerId: string, follower: DeepRequired<User>) => New<NotificationNewFollower>;
export declare const notificationProfileUpdated: (date: TimestampType, userId: string, user: DeepRequired<User>) => New<NotificationProfileUpdated>;
export {};
//# sourceMappingURL=index.d.ts.map