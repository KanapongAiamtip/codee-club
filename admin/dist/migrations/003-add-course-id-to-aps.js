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
exports.up = void 0;
const dao_1 = require("@codee-club/common/dist/dao");
const up = (db) => __awaiter(void 0, void 0, void 0, function* () {
    const batch = db.batch();
    const apsRef = db.collection(dao_1.ACTIVITY_PROBLEM_SETS);
    const coursesSnap = yield db.collection(dao_1.COURSES).get();
    for (const courseDoc of coursesSnap.docs) {
        const course = courseDoc.data();
        for (const activityId in course.activities) {
            batch.set(apsRef.doc(activityId), { courseId: courseDoc.id }, { merge: true });
        }
    }
    yield batch.commit();
});
exports.up = up;
//# sourceMappingURL=003-add-course-id-to-aps.js.map