"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.problemResultDefaults = exports.activityResultDefaults = exports.testDefaults = exports.problemDefaults = exports.courseActivityDefaults = exports.courseSectionDefaults = exports.courseDefaults = exports.userPrivateDefaults = exports.userDefaults = void 0;
const enums_1 = require("../../data-types/enums");
exports.userDefaults = {
    code: '',
    bio: '',
    avatarUrl: '',
    links: {},
    followingIds: [],
    followerIds: [],
    roles: []
};
exports.userPrivateDefaults = {
    email: '',
    nuConnectToken: {},
    notifications: []
};
exports.courseDefaults = {
    name: 'New Course',
    sections: {},
    activities: {},
    editorIds: [],
    theme: '',
    allowedLanguages: []
};
exports.courseSectionDefaults = {
    studentIds: []
};
exports.courseActivityDefaults = {
    status: enums_1.ActivityStatus.Draft,
    sectionIds: []
};
exports.problemDefaults = {
    seq: 100,
    name: 'New problem',
    description: '',
    tests: {}
};
exports.testDefaults = {
    seq: 100,
    input: '',
    expected: '',
    visibility: enums_1.TestVisibility.Visible
};
exports.activityResultDefaults = {
    problemResults: {}
};
exports.problemResultDefaults = {};
//# sourceMappingURL=defaults.js.map