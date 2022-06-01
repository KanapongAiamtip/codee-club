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
exports.sendDeadlineReminders = void 0;
const dao_1 = require("@codee-club/common/dist/dao");
const enums_1 = require("@codee-club/common/dist/data-types/enums");
const object_extensions_1 = require("@codee-club/common/dist/utils/object-extensions");
const firebase_admin_initialized_1 = require("../_services/firebase-admin-initialized");
const notifications_1 = require("../_services/notifications");
const ONE_DAY_SECONDS = 86400;
const NOTIFY_AT_DAYS = new Set([0, 1, 5]);
const sendDeadlineReminders = (_context) => __awaiter(void 0, void 0, void 0, function* () {
    const coursesSnapshot = yield firebase_admin_initialized_1.db.collection(dao_1.COURSES).get();
    const courses = coursesSnapshot.docs.map(doc => doc.data());
    const now = firebase_admin_initialized_1.Timestamp.now();
    const nowSeconds = now.seconds;
    const deadlines = courses.flatMap(course => object_extensions_1.entries(course.activities)
        .filter(activityIdAndActivity => activityIdAndActivity[1].status === enums_1.ActivityStatus.Published)
        .flatMap(activityIdAndActivity => object_extensions_1.entries(activityIdAndActivity[1].deadlines)
        .filter(sectionIdAndDeadline => { var _a, _b; return ((_b = (_a = sectionIdAndDeadline[1]) === null || _a === void 0 ? void 0 : _a.seconds) !== null && _b !== void 0 ? _b : 0) > nowSeconds; })
        .map(sectionIdAndDeadline => {
        var _a, _b;
        return ({
            courseSlug: course.slug,
            activitySlug: activityIdAndActivity[1].slug,
            activityName: activityIdAndActivity[1].name,
            studentIds: (_b = (_a = course.sections[sectionIdAndDeadline[0]]) === null || _a === void 0 ? void 0 : _a.studentIds) !== null && _b !== void 0 ? _b : [],
            dueDate: sectionIdAndDeadline[1]
        });
    })));
    console.info(`Notifying: ${deadlines.length} deadlines`);
    for (const deadline of deadlines) {
        const dueInSeconds = deadline.dueDate.seconds - nowSeconds;
        const dueInDays = Math.floor(dueInSeconds / ONE_DAY_SECONDS);
        if (NOTIFY_AT_DAYS.has(dueInDays))
            yield notifications_1.notify(deadline.studentIds, notifications_1.notificationDeadlineReminder(now, deadline.courseSlug, deadline.activitySlug, deadline.activityName, dueInDays));
    }
    return null;
});
exports.sendDeadlineReminders = sendDeadlineReminders;
//# sourceMappingURL=index.js.map