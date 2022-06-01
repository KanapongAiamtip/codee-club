import firebase from 'firebase/app';
declare type Timestamp = firebase.firestore.Timestamp;
interface NotificationBase {
    date: Timestamp;
}
export declare const PROFILE_UPDATED = "PROFILE_UPDATED";
export interface NotificationProfileUpdated extends NotificationBase {
    notificationType: typeof PROFILE_UPDATED;
    userId: string;
    userNameFirst: string;
    imageUrl: string;
}
export declare const NEW_FOLLOWER = "NEW_FOLLOWER";
export interface NotificationNewFollower extends NotificationBase {
    notificationType: typeof NEW_FOLLOWER;
    followerId: string;
    followerNameFirst: string;
    imageUrl: string;
}
export declare const DEADLINE_REMINDER = "DEADLINE_REMINDER";
export interface NotificationDeadlineReminder extends NotificationBase {
    notificationType: typeof DEADLINE_REMINDER;
    courseSlug: string;
    activitySlug: string;
    activityName: string;
    dueInDays: number;
}
export declare const DEADLINE_SET = "DEADLINE_SET";
export interface NotificationDeadlineSet extends NotificationBase {
    notificationType: typeof DEADLINE_SET;
    activityId: string;
    activityName: string;
    deadline: Timestamp;
    isUpdate: boolean;
}
export declare const NOTIFICATIONS_TYPES_STUDY: string[];
export declare type Notification = NotificationProfileUpdated | NotificationNewFollower | NotificationDeadlineReminder | NotificationDeadlineSet;
export {};
//# sourceMappingURL=index.d.ts.map