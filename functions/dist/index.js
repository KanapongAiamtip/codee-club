"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.everyDayTest = exports.everyDay = exports.submissionCreate = exports.runnerUpdate = exports.userUpdate = exports.courseUserImport = exports.authNUConnectToken = exports.authNUConnectURL = void 0;
const dao_1 = require("@codee-club/common/dist/dao");
const firebase_functions_initialized_1 = __importDefault(require("./_services/firebase-functions-initialized"));
const auth_1 = require("./auth");
const courses_1 = require("./courses");
const deadlines_1 = require("./deadlines");
const new_runner_1 = require("./runners/new-runner");
const new_submission_1 = require("./runners/new-submission");
const users_1 = require("./users");
exports.authNUConnectURL = firebase_functions_initialized_1.default.https.onCall(auth_1.getUrl);
exports.authNUConnectToken = firebase_functions_initialized_1.default.https.onCall(auth_1.getToken);
exports.courseUserImport = firebase_functions_initialized_1.default.https.onCall(courses_1.courseUserImport);
exports.userUpdate = firebase_functions_initialized_1.default.firestore.document(`${dao_1.USERS}/{userId}`).onUpdate(users_1.onUpdateUser);
exports.runnerUpdate = firebase_functions_initialized_1.default.firestore.document(`${dao_1.RUNNERS}/{runnerId}`).onCreate(new_runner_1.onCreateRunner);
exports.submissionCreate = firebase_functions_initialized_1.default.firestore.document(`${dao_1.SUBMISSION_JOBS}/{submissionId}`).onCreate(new_submission_1.onCreateSubmission);
exports.everyDay = firebase_functions_initialized_1.default.pubsub.schedule('every day 08:00').timeZone('Asia/Bangkok').onRun(deadlines_1.sendDeadlineReminders);
exports.everyDayTest = firebase_functions_initialized_1.default.https.onCall(deadlines_1.sendDeadlineReminders);
//# sourceMappingURL=index.js.map