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
const dao_1 = require("@codee-club/common/dist/dao");
const context_1 = require("~/context");
const firebase_admin_initialized_1 = require("~/firebase-admin-initialized");
const modes_1 = require("~/modes");
const course_oop_1 = require("./data-oop/course-oop");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield modes_1.productionWarning(__filename);
    const dao = new dao_1.Dao(context_1.context);
    for (const teacher of course_oop_1.keyedTeachers) {
        const { id, data } = teacher;
        yield dao.createUser(data, id);
    }
    const courseId = yield dao.createCourse(course_oop_1.course);
    for (const activityAndProblems of course_oop_1.activitiesAndProblems) {
        const { activity, problems } = activityAndProblems;
        const activityId = yield dao.createActivity(courseId, activity);
        yield dao.createProblems(activityId, problems);
    }
    for (const student of course_oop_1.studentsWithSections) {
        const { id, data, sectionId } = student;
        yield dao.createUserWithCourseSections(data, { [courseId]: sectionId }, id);
    }
    for (const testStudent of course_oop_1.testStudents) {
        yield firebase_admin_initialized_1.auth.createUser({ uid: testStudent.id, email: testStudent.data.email, password: '123456' });
    }
    yield dao.createRunner({ url: 'https://runner-java-r3bka4fkka-uc.a.run.app' });
    const statisticsRef = firebase_admin_initialized_1.db.collection(dao_1.CONFIG).doc(dao_1.CONFIG_STATISTICS);
    if (!(yield statisticsRef.get()).exists) {
        const defaultStatistics = { members: 0, submissionSuccesses: 0, submissionCompileFailures: 0, submissionTestFailures: 0 };
        yield statisticsRef.set(defaultStatistics);
    }
});
main()
    .then(() => process.exit())
    .catch((error) => console.error(error));
//# sourceMappingURL=course-oop.js.map