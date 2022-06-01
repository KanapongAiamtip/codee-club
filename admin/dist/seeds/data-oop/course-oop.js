"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activitiesAndProblems = exports.course = exports.studentsWithSections = exports.testStudents = exports.keyedTeachers = void 0;
const invert_1 = __importDefault(require("lodash/invert"));
const keyBy_1 = __importDefault(require("lodash/keyBy"));
const mapValues_1 = __importDefault(require("lodash/mapValues"));
const moment_1 = __importDefault(require("moment"));
const enums_1 = require("@codee-club/common/dist/data-types/enums");
const object_extensions_1 = require("@codee-club/common/dist/utils/object-extensions");
const firebase_admin_initialized_1 = __importDefault(require("~/firebase-admin-initialized"));
const get_guid_1 = __importDefault(require("~/get-guid"));
const students_oop_json_1 = __importDefault(require("./students-oop.json"));
const teachers_json_1 = __importDefault(require("./teachers.json"));
const VISIBLE = enums_1.TestVisibility.Visible;
const HIDDEN = enums_1.TestVisibility.Hidden;
const teachersTyped = teachers_json_1.default;
exports.keyedTeachers = teachersTyped.map((data) => ({ id: get_guid_1.default(), data }));
exports.testStudents = [
    { id: get_guid_1.default(), data: { nameFirst: 'Ayra', nameLast: 'Stark', email: 'arya@codee.club' }, sectionCode: '5' },
    { id: get_guid_1.default(), data: { nameFirst: 'Sansa', nameLast: 'Stark', email: 'sansa@codee.club' }, sectionCode: '4' }
];
const studentsTyped = students_oop_json_1.default;
const keyedStudents = [...exports.testStudents, ...studentsTyped.map((_a) => {
        var { sectionCode } = _a, data = __rest(_a, ["sectionCode"]);
        return ({ id: get_guid_1.default(), data, sectionCode });
    })];
const sections = keyBy_1.default(['1', '2', '3', '4', '5'].map(code => ({ code, studentIds: keyedStudents.filter(student => student.sectionCode === code).map(student => student.id) })), get_guid_1.default);
const sectionCodeToId = invert_1.default(mapValues_1.default(sections, (section) => section.code));
exports.studentsWithSections = keyedStudents.map(({ id, data, sectionCode }) => ({ id, data, sectionId: sectionCodeToId[sectionCode] }));
exports.course = {
    code: '254275',
    year: 2020,
    semester: 2,
    name: 'Object Oriented Programming',
    ownerIds: [exports.keyedTeachers[0].id, exports.keyedTeachers[1].id],
    editorIds: [exports.keyedTeachers[2].id],
    sections: sections
};
const warmupProblems = [
    {
        seq: 1,
        name: 'Java misses you',
        description: 'Write a program that prints out "Hello world" on line 1 and "I miss you Java" on line 2',
        tests: keyBy_1.default([
            {
                seq: 1,
                input: '',
                expected: 'Hello world\nI miss you Java',
                visibility: VISIBLE
            }
        ], get_guid_1.default)
    },
    {
        seq: 2,
        name: 'SHOUT then whisper',
        description: 'Write a program that reads in a line of text and prints out the same text first in UPPERCASE and second in lowercase.',
        tests: keyBy_1.default([
            {
                seq: 1,
                input: 'We LoVe jaVa',
                expected: 'WE LOVE JAVA\nwe love java',
                visibility: VISIBLE
            },
            {
                seq: 2,
                input: 'time TO program',
                expected: 'TIME TO PROGRAM\ntime to program',
                visibility: HIDDEN
            }
        ], get_guid_1.default)
    },
    {
        seq: 3,
        name: 'What colour to wear',
        description: 'Write a program that reads in a number for the day of week (1-7) and prints out the recommended colour to wear according to Thai culture.',
        tests: keyBy_1.default([
            {
                seq: 1,
                input: '1',
                expected: 'Yellow',
                visibility: VISIBLE
            },
            {
                seq: 2,
                input: '5',
                expected: 'Blue',
                visibility: VISIBLE
            },
            {
                seq: 3,
                input: '2',
                expected: 'Pink',
                visibility: HIDDEN
            },
            {
                seq: 4,
                input: '7',
                expected: 'Red',
                visibility: HIDDEN
            },
            {
                seq: 5,
                input: '4',
                expected: 'Orange',
                visibility: HIDDEN
            }
        ], get_guid_1.default)
    },
    {
        seq: 4,
        name: 'Still choosing a colour',
        description: 'Write a program that reads in a string for the day of the week and prints out the recommended colour to wear. It should accept any case.',
        tests: keyBy_1.default([
            {
                seq: 1,
                input: 'Monday',
                expected: 'Yellow',
                visibility: VISIBLE
            },
            {
                seq: 2,
                input: 'friDAY',
                expected: 'Blue',
                visibility: VISIBLE
            },
            {
                seq: 3,
                input: 'wednesday',
                expected: 'Green',
                visibility: HIDDEN
            },
            {
                seq: 4,
                input: 'Sunday',
                expected: 'Red',
                visibility: HIDDEN
            },
            {
                seq: 5,
                input: 'thursday',
                expected: 'Orange',
                visibility: HIDDEN
            }
        ], get_guid_1.default)
    }
];
function mapDeadlines(date) {
    return mapValues_1.default(sections, () => firebase_admin_initialized_1.default.firestore.Timestamp.fromDate(moment_1.default(date).toDate()));
}
exports.activitiesAndProblems = [
    {
        activity: {
            seq: 1,
            name: 'Welcome Back and Warm Up',
            status: enums_1.ActivityStatus.Published,
            sectionIds: object_extensions_1.keys(sections),
            deadlines: mapDeadlines('2020-12-10T05:00:00Z')
        },
        problems: warmupProblems
    }
];
//# sourceMappingURL=course-oop.js.map