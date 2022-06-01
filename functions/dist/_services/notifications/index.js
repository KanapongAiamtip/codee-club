"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationProfileUpdated = exports.notificationNewFollower = exports.notificationDeadlineSet = exports.notificationDeadlineReminder = exports.notify = void 0;
const dao_1 = require("@codee-club/common/dist/dao");
const notifications_1 = require("@codee-club/common/dist/notifications");
const firebase_admin_initialized_1 = require("../firebase-admin-initialized");
const notify = (recipientIds, notification) => __awaiter(void 0, void 0, void 0, function* () {
    const userUpdate = { notifications: firebase_admin_initialized_1.FieldValue.arrayUnion(notification) };
    return yield Promise.all(recipientIds.map((recipientId) => __awaiter(void 0, void 0, void 0, function* () { return yield firebase_admin_initialized_1.db.collection(dao_1.USERS_PRIVATE).doc(recipientId).set(userUpdate, { merge: true }); }))).catch(error => console.error(error));
});
exports.notify = notify;
const notificationDeadlineReminder = (date, courseSlug, activitySlug, activityName, dueInDays) => ({
    notificationType: notifications_1.DEADLINE_REMINDER,
    date,
    courseSlug,
    activitySlug,
    activityName,
    dueInDays
});
exports.notificationDeadlineReminder = notificationDeadlineReminder;
const notificationDeadlineSet = (date, activityId, activityName, deadline, isUpdate) => ({
    notificationType: notifications_1.DEADLINE_SET,
    date,
    activityId,
    activityName,
    deadline,
    isUpdate
});
exports.notificationDeadlineSet = notificationDeadlineSet;
const notificationNewFollower = (date, followerId, follower) => ({
    notificationType: notifications_1.NEW_FOLLOWER,
    date,
    imageUrl: follower.avatarUrl,
    followerId: followerId,
    followerNameFirst: follower.nameFirst
});
exports.notificationNewFollower = notificationNewFollower;
const notificationProfileUpdated = (date, userId, user) => ({
    notificationType: notifications_1.PROFILE_UPDATED,
    date,
    imageUrl: user.avatarUrl,
    userId,
    userNameFirst: user.nameFirst
});
exports.notificationProfileUpdated = notificationProfileUpdated;
//# sourceMappingURL=index.js.map