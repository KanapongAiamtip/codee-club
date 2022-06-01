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
exports.onCreateSubmission = void 0;
const mapValues_1 = __importDefault(require("lodash/mapValues"));
const dao_1 = require("@codee-club/common/dist/dao");
const enums_1 = require("@codee-club/common/dist/data-types/enums");
const object_extensions_1 = require("@codee-club/common/dist/utils/object-extensions");
const firebase_admin_initialized_1 = __importDefault(require("../_services/firebase-admin-initialized"));
const get_token_1 = require("../_services/gcp/get-token");
const get_post_1 = require("../_services/request-helpers/get-post");
const db = firebase_admin_initialized_1.default.firestore();
const equivalent = (expected, actual) => expected.trim() === actual.trim();
const onCreateSubmission = (snapshot, _context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const submission = snapshot.data();
    const activityProblemSetSnapshot = yield db.collection(dao_1.ACTIVITY_PROBLEM_SETS).doc(submission.activityId).get();
    const activity = activityProblemSetSnapshot.data();
    const problemCount = object_extensions_1.length(activity === null || activity === void 0 ? void 0 : activity.problems);
    const tests = (_b = (_a = activity === null || activity === void 0 ? void 0 : activity.problems) === null || _a === void 0 ? void 0 : _a[submission.problemId]) === null || _b === void 0 ? void 0 : _b.tests;
    if (!problemCount || !tests) {
        return console.error(`Tests not found for activity: ${submission.activityId}, problem: ${submission.problemId}`);
    }
    const languagesSnapshot = yield db.collection(dao_1.CONFIG).doc(dao_1.CONFIG_LANGUAGES).get();
    const languagesMap = languagesSnapshot.data();
    if (!(submission.language in languagesMap)) {
        return console.error(`Runner for ${submission.language} not found`);
    }
    const runner = languagesMap[submission.language];
    const inputs = mapValues_1.default(tests, 'input');
    const data = { inputs, sourceRefs: submission.fileRefs };
    const token = yield get_token_1.getToken(runner.url);
    const headers = { Authorization: `Bearer ${token}` };
    let response;
    try {
        response = yield get_post_1.post({
            url: runner.url,
            headers,
            data,
            timeout: 301000
        });
    }
    catch (error) {
        console.error(error);
        response = { body: { error: error.message } };
    }
    const body = response.body;
    if ('error' in body || 'invalid' in body) {
        const errorOutput = ('invalid' in body) ? body.invalid : body.error;
        const errorStatus = ('invalid' in body) ? enums_1.ProblemResultStatus.Invalid : (body.error === 'Timeout reached' ? enums_1.ProblemResultStatus.Timeout : enums_1.ProblemResultStatus.Error);
        const problemResultUpdate = {
            [`problemResults.${submission.problemResultId}.status`]: errorStatus,
            [`problemResults.${submission.problemResultId}.errorOutput`]: errorOutput
        };
        yield db.collection(dao_1.ACTIVITY_RESULTS).doc(submission.activityResultId).update(problemResultUpdate);
        const statisticsUpdate = { submissionCompileFailures: firebase_admin_initialized_1.default.firestore.FieldValue.increment(1) };
        yield db.collection(dao_1.CONFIG).doc(dao_1.CONFIG_STATISTICS).update(statisticsUpdate);
        return;
    }
    const outputs = body.outputs;
    const testResults = object_extensions_1.keys(tests).map((testId) => {
        var _a, _b, _c;
        const expected = (_a = tests[testId].expected) !== null && _a !== void 0 ? _a : '';
        const actual = (_b = outputs[testId].output) !== null && _b !== void 0 ? _b : '';
        const error = (_c = outputs[testId].error) !== null && _c !== void 0 ? _c : '';
        return {
            testId,
            actual,
            error,
            status: !error && equivalent(expected, actual) ? enums_1.TestResultStatus.Pass : enums_1.TestResultStatus.Fail
        };
    });
    const numberOfTests = testResults.length;
    const numberOfTestsPassed = testResults.filter((tr) => tr.status === enums_1.TestResultStatus.Pass).length;
    const percent = numberOfTests > 0 ? (100 * numberOfTestsPassed) / numberOfTests : 0;
    const status = numberOfTests > 0 && numberOfTests === numberOfTestsPassed ? enums_1.ProblemResultStatus.Pass : enums_1.ProblemResultStatus.Fail;
    const activityResultRef = db.collection(dao_1.ACTIVITY_RESULTS).doc(submission.activityResultId);
    try {
        yield db.runTransaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            const activityResultSnapshot = yield t.get(activityResultRef);
            const activityResult = activityResultSnapshot.data();
            const allProblemResults = activityResult.problemResults;
            const firstBestProblemResultIds = object_extensions_1.keys(allProblemResults).filter((prId) => allProblemResults[prId].isFirstBest);
            const thisProblemFirstBestProblemResultId = firstBestProblemResultIds.find((prId) => allProblemResults[prId].problemId === submission.problemId);
            const isFirstBest = !thisProblemFirstBestProblemResultId || numberOfTestsPassed > allProblemResults[thisProblemFirstBestProblemResultId].passCount;
            const problemResultUpdate = {
                [`problemResults.${submission.problemResultId}.percent`]: percent,
                [`problemResults.${submission.problemResultId}.status`]: status,
                [`problemResults.${submission.problemResultId}.testResults`]: testResults,
                [`problemResults.${submission.problemResultId}.testCount`]: numberOfTests,
                [`problemResults.${submission.problemResultId}.passCount`]: numberOfTestsPassed,
                [`problemResults.${submission.problemResultId}.failCount`]: numberOfTests - numberOfTestsPassed,
                [`problemResults.${submission.problemResultId}.isFirstBest`]: isFirstBest
            };
            const previousBestProblemResultUpdate = isFirstBest && thisProblemFirstBestProblemResultId
                ? {
                    [`problemResults.${thisProblemFirstBestProblemResultId}.isFirstBest`]: false
                }
                : {};
            let aggregatesUpdate = {};
            if (isFirstBest) {
                const otherFirstBestProblemResults = firstBestProblemResultIds.filter((prId) => prId !== thisProblemFirstBestProblemResultId).map((prId) => allProblemResults[prId]);
                const firstBestProblemResults = [...otherFirstBestProblemResults, ({ status, percent })];
                const overall = firstBestProblemResults.reduce((acc, value) => {
                    acc.completeCount += value.status === enums_1.ProblemResultStatus.Pass ? 1 : 0;
                    acc.totalScore += value.percent;
                    return acc;
                }, { completeCount: 0, totalScore: 0 });
                aggregatesUpdate = {
                    isComplete: overall.completeCount === problemCount,
                    totalScore: overall.totalScore,
                    totalPercent: overall.totalScore / problemCount,
                    lastImprovement: submission.originalDate.seconds > activityResult.lastImprovement.seconds ? submission.originalDate : activityResult.lastImprovement
                };
            }
            const activityResultUpdate = Object.assign(Object.assign(Object.assign({}, problemResultUpdate), previousBestProblemResultUpdate), aggregatesUpdate);
            return t.update(activityResultRef, activityResultUpdate);
        }));
        const statisticsUpdate = status === enums_1.ProblemResultStatus.Pass ? { submissionSuccesses: firebase_admin_initialized_1.default.firestore.FieldValue.increment(1) } : { submissionTestFailures: firebase_admin_initialized_1.default.firestore.FieldValue.increment(1) };
        yield db.collection(dao_1.CONFIG).doc(dao_1.CONFIG_STATISTICS).update(statisticsUpdate);
    }
    catch (error) {
        console.error(error);
    }
});
exports.onCreateSubmission = onCreateSubmission;
//# sourceMappingURL=new-submission.js.map