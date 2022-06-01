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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dao_1 = require("@codee-club/common/dist/dao");
const object_extensions_1 = require("@codee-club/common/dist/utils/object-extensions");
const firebase_admin_initialized_1 = require("~/firebase-admin-initialized");
const modes_1 = require("~/modes");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    yield modes_1.productionWarning(__filename);
    const [courseSlug, activitySlug] = process.argv.filter((a) => !a.startsWith('--')).slice(-2);
    if (!courseSlug || !activitySlug) {
        console.error('USAGE: download-scores-csv.ts COURSE_SLUG ACTIVITY_SLUG [--mode=MODE]');
        return;
    }
    const strictDeadlines = process.argv.find((a) => a === '--strict');
    const courseSnapshot = yield firebase_admin_initialized_1.db.collection(dao_1.COURSES).where('slug', '==', courseSlug).limit(1).get();
    if (courseSnapshot.empty) {
        console.error(`Course slug ${courseSlug} not found`);
        return;
    }
    const courseId = courseSnapshot.docs[0].id;
    const course = courseSnapshot.docs[0].data();
    const activityId = object_extensions_1.keys(course.activities).find((id) => course.activities[id].slug === activitySlug);
    if (!activityId) {
        console.error(`Activity slug ${activitySlug} not found`);
        return;
    }
    const activityProblemSetSnapshot = yield firebase_admin_initialized_1.db.collection(dao_1.ACTIVITY_PROBLEM_SETS).doc(activityId).get();
    const activityProblemSet = activityProblemSetSnapshot.data();
    const activityResultsSnapshot = yield firebase_admin_initialized_1.db.collection(dao_1.ACTIVITY_RESULTS).where('courseId', '==', courseId).where('activityId', '==', activityId).get();
    const activityResults = activityResultsSnapshot.docs.map((doc) => doc.data());
    const problemsOrdered = object_extensions_1.keys(activityProblemSet.problems).map(id => (Object.assign({ id }, activityProblemSet.problems[id]))).sort((a, b) => a.seq - b.seq);
    const csvLines = ['Section,Name,Student Code,Total Percent,Total Score,' + problemsOrdered.map(p => `P${p.seq} Score`).join(',')];
    for (const sectionId in course.sections) {
        const section = course.sections[sectionId];
        const sectionDeadlineMillis = (_b = (_a = course.activities[activityId].deadlines[sectionId]) === null || _a === void 0 ? void 0 : _a.toMillis()) !== null && _b !== void 0 ? _b : Date.now();
        const users = (yield Promise.all(section.studentIds.map((id) => __awaiter(void 0, void 0, void 0, function* () { return yield firebase_admin_initialized_1.db.collection(dao_1.USERS).doc(id).get(); })))).map(snap => ({ id: snap.id, data: snap.data() }));
        for (const user of users) {
            const result = activityResults.find(ar => ar.userId === user.id);
            if (!result)
                continue;
            let totalPercent, totalScore, problemScores;
            if (strictDeadlines) {
                problemScores = problemsOrdered
                    .map(problem => object_extensions_1.keys(result.problemResults)
                    .filter(problemResultId => result.problemResults[problemResultId].date.toMillis() < sectionDeadlineMillis && result.problemResults[problemResultId].problemId === problem.id)
                    .reduce((acc, id) => Math.max(acc, result.problemResults[id].percent), 0));
                totalScore = problemScores.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0);
                totalPercent = totalScore / problemsOrdered.length;
            }
            else {
                problemScores = problemsOrdered
                    .map(problem => object_extensions_1.keys(result.problemResults)
                    .find(problemResultId => result.problemResults[problemResultId].isFirstBest && result.problemResults[problemResultId].problemId === problem.id))
                    .map(problemResultId => problemResultId ? result.problemResults[problemResultId].percent : 0);
                totalScore = result.totalScore;
                totalPercent = result.totalPercent;
            }
            csvLines.push(`${section.code},${user.data.name},${user.data.code},${totalPercent.toFixed(2)},${totalScore.toFixed(2)},${problemScores.map(x => x.toFixed(2)).join(',')},${result.lastImprovement.toDate().toISOString()}`);
        }
    }
    const pathToRoot = '../../';
    const filename = `${course.slug} ${activitySlug}.csv`;
    const destination = path_1.default.join(__dirname, pathToRoot, filename);
    fs_1.default.writeFileSync(destination, csvLines.join('\n'));
    console.info(`Saved to: ${filename}`);
});
main()
    .then(() => process.exit())
    .catch((error) => console.error(error));
//# sourceMappingURL=download-scores-csv.js.map