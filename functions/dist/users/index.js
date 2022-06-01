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
exports.onUpdateUser = void 0;
const object_extensions_1 = require("@codee-club/common/dist/utils/object-extensions");
const firebase_admin_initialized_1 = require("../_services/firebase-admin-initialized");
const notifications_1 = require("../_services/notifications");
const onUpdateUser = (change, context) => __awaiter(void 0, void 0, void 0, function* () {
    const dataBefore = change.before.data();
    const dataAfter = change.after.data();
    const now = firebase_admin_initialized_1.Timestamp.now();
    const profileUpdated = dataBefore.bio !== dataAfter.bio || [...new Set([...object_extensions_1.keys(dataBefore.links), ...object_extensions_1.keys(dataAfter.links)])].some(key => dataBefore.links[key] !== dataAfter.links[key]);
    if (profileUpdated)
        yield notifications_1.notify(dataAfter.followerIds, notifications_1.notificationProfileUpdated(now, context.params.userId, dataAfter));
    const beforeFollowingIds = new Set(dataBefore.followingIds);
    const addedFollowingIds = dataAfter.followingIds.filter(id => !beforeFollowingIds.has(id));
    if (addedFollowingIds.length > 0)
        yield notifications_1.notify(addedFollowingIds, notifications_1.notificationNewFollower(now, context.params.userId, dataAfter));
});
exports.onUpdateUser = onUpdateUser;
//# sourceMappingURL=index.js.map