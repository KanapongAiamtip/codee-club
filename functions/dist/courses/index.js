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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseUserImport = void 0;
const dao_1 = require("@codee-club/common/dist/dao");
const context_1 = require("../_services/context");
const dao = new dao_1.Dao(context_1.context);
function arrayUnion(array, item) {
    const set = new Set(array !== null && array !== void 0 ? array : []);
    set.add(item);
    return [...set];
}
const courseUserImport = (data, _callableContext) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, sectionId, users } = data;
    const courseSections = { [courseId]: sectionId };
    return yield Promise.all(users.map((userRaw) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = userRaw, user = __rest(userRaw, ["email"]);
        try {
            const userId = yield dao.createOrUpdateUserWithCourseSections(user, courseSections, email);
            const courseRef = context_1.context.db.collection(dao_1.COURSES).doc(courseId);
            yield context_1.context.db.runTransaction((t) => __awaiter(void 0, void 0, void 0, function* () {
                const course = (yield t.get(courseRef)).data();
                if (course === undefined || course.sections === undefined)
                    return;
                const sections = course.sections;
                sections[sectionId].studentIds = arrayUnion(sections[sectionId].studentIds, userId);
                const roleView = arrayUnion(course.roleView, userId);
                yield t.update(courseRef, { sections, roleView });
            }));
            return userId;
        }
        catch (error) {
            return { error: error.message };
        }
    })));
});
exports.courseUserImport = courseUserImport;
//# sourceMappingURL=index.js.map