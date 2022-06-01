"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.course = exports.studentsWithSections = exports.sections = void 0;
const invert_1 = __importDefault(require("lodash/invert"));
const keyBy_1 = __importDefault(require("lodash/keyBy"));
const mapValues_1 = __importDefault(require("lodash/mapValues"));
const get_guid_1 = __importDefault(require("~/get-guid"));
const user_1 = require("./user");
exports.sections = keyBy_1.default(['1', '2', '3', '4', '5', '6']
    .map(code => ({
    code,
    studentIds: user_1.keyedStudents
        .filter((student) => student.sectionCode === code)
        .map((student) => student.id)
})), get_guid_1.default);
const sectionCodeToId = invert_1.default(mapValues_1.default(exports.sections, (section) => section.code));
exports.studentsWithSections = user_1.keyedStudents.map(({ id, data, email, sectionCode }) => ({ id, data, email, sectionId: sectionCodeToId[sectionCode] }));
exports.course = {
    code: '254275',
    year: 2020,
    semester: 2,
    name: 'Object Oriented Programming',
    ownerIds: [user_1.keyedTeachers[0].id, user_1.keyedTeachers[1].id],
    editorIds: [user_1.keyedTeachers[2].id],
    sections: exports.sections
};
//# sourceMappingURL=course-section.js.map