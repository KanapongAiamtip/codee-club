"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activitiesAndProblems = void 0;
const keyBy_1 = __importDefault(require("lodash/keyBy"));
const enums_1 = require("@codee-club/common/dist/data-types/enums");
const object_extensions_1 = require("@codee-club/common/dist/utils/object-extensions");
const firebase_admin_initialized_1 = require("~/firebase-admin-initialized");
const get_guid_1 = __importDefault(require("~/get-guid"));
const course_section_1 = require("./course-section");
const VISIBLE = enums_1.TestVisibility.Visible;
const HIDDEN = enums_1.TestVisibility.Hidden;
const warmupProblems = [
    {
        seq: 1,
        name: 'Java misses you',
        description: 'Write a program that prints out "Hello world" on line 1 and "I miss you Java" on line 2',
        tests: keyBy_1.default([{ seq: 1, input: '', expected: 'Hello world\nI miss you Java', visibility: VISIBLE }], get_guid_1.default)
    },
    {
        seq: 2,
        name: 'SHOUT then whisper',
        description: 'Write a program that reads in a line of text and prints out the same text first in UPPERCASE and second in lowercase.',
        tests: keyBy_1.default([
            { seq: 1, input: 'We LoVe jaVa', expected: 'WE LOVE JAVA\nwe love java', visibility: VISIBLE },
            { seq: 2, input: 'time TO program', expected: 'TIME TO PROGRAM\ntime to program', visibility: HIDDEN }
        ], get_guid_1.default)
    },
    {
        seq: 3,
        name: 'What colour to wear',
        description: 'Write a program that reads in a number for the day of week (1-7) and prints out the recommended colour to wear according to Thai culture.',
        tests: keyBy_1.default([
            { seq: 1, input: '1', expected: 'Yellow', visibility: VISIBLE },
            { seq: 2, input: '5', expected: 'Blue', visibility: VISIBLE },
            { seq: 3, input: '2', expected: 'Pink', visibility: HIDDEN },
            { seq: 4, input: '7', expected: 'Red', visibility: HIDDEN },
            { seq: 5, input: '4', expected: 'Orange', visibility: HIDDEN }
        ], get_guid_1.default)
    },
    {
        seq: 4,
        name: 'Still choosing a colour',
        description: 'Write a program that reads in a string for the day of the week and prints out the recommended colour to wear. It should accept any case.',
        tests: keyBy_1.default([
            { seq: 1, input: 'Monday', expected: 'Yellow', visibility: VISIBLE },
            { seq: 2, input: 'friDAY', expected: 'Blue', visibility: VISIBLE },
            { seq: 3, input: 'wednesday', expected: 'Green', visibility: HIDDEN },
            { seq: 4, input: 'Sunday', expected: 'Red', visibility: HIDDEN },
            { seq: 5, input: 'thursday', expected: 'Orange', visibility: HIDDEN }
        ], get_guid_1.default)
    }
];
function mapDeadlines(date) {
    return Object.fromEntries(object_extensions_1.keys(course_section_1.sections).map((key, idx) => [
        key,
        date !== undefined ? date : firebase_admin_initialized_1.Timestamp.fromMillis((firebase_admin_initialized_1.Timestamp.now().seconds + (idx * 24 + 5) * 60 * 60) * 1000)
    ]));
}
exports.activitiesAndProblems = [
    {
        activity: {
            seq: 1,
            name: 'Welcome Back and Warm Up',
            status: enums_1.ActivityStatus.Published,
            sectionIds: object_extensions_1.keys(course_section_1.sections),
            deadlines: mapDeadlines()
        },
        problems: warmupProblems
    }
];
//# sourceMappingURL=activity-problem.js.map