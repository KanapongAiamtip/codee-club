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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dao_1 = require("@codee-club/common/dist/dao");
const context_1 = require("~/context");
const firebase_admin_initialized_1 = require("~/firebase-admin-initialized");
const modes_1 = require("~/modes");
const migrate_1 = __importDefault(require("../migrations/migrate"));
const activity_problem_1 = require("./data/activity-problem");
const course_section_1 = require("./data/course-section");
const user_1 = require("./data/user");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield modes_1.productionWarning(__filename);
    if (modes_1.MODE !== 'emu')
        return console.warn('This script is exclusively for local testing');
    const dao = new dao_1.Dao(context_1.context);
    yield migrate_1.default();
    yield dao.createRunner({ url: 'https://runner-piston-r3bka4fkka-uc.a.run.app/api' });
    for (const teacher of user_1.keyedTeachers) {
        const { id, data, email } = teacher;
        yield dao.createUser(data, id);
        yield dao.createUserPrivate(id, { email });
        yield firebase_admin_initialized_1.auth.createUser({ uid: id, email, password: '123456' });
    }
    const courseId = yield dao.createCourse(course_section_1.course);
    for (const activityAndProblems of activity_problem_1.activitiesAndProblems) {
        const { activity, problems } = activityAndProblems;
        const activityId = yield dao.createActivity(courseId, activity);
        yield dao.createProblems(activityId, problems);
    }
    for (const student of course_section_1.studentsWithSections) {
        const { id, data, email, sectionId } = student;
        yield dao.createUserWithCourseSections(data, { [courseId]: sectionId }, id);
        yield dao.createUserPrivate(id, { email });
    }
    for (const testStudent of user_1.keyedTestStudents) {
        yield firebase_admin_initialized_1.auth.createUser({ uid: testStudent.id, email: testStudent.email, password: '123456' });
    }
});
main()
    .then(() => process.exit())
    .catch((error) => console.error(error));
//# sourceMappingURL=index.js.map