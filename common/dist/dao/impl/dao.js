"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Dao = void 0;
const mapKeys_1 = __importDefault(require("lodash/mapKeys"));
const enums_1 = require("../../data-types/enums");
const object_extensions_1 = require("../../utils/object-extensions");
const type_extensions_1 = require("../../utils/type-extensions");
const url_helpers_1 = require("../../utils/url-helpers");
const firestore_schema_1 = require("../firestore-schema");
const DEFAULTS = __importStar(require("./defaults"));
require("core-js/features/array/flat-map");
class Dao {
    constructor({ auth, db, FieldValue, getGuid }) {
        Object.defineProperty(this, "auth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "FieldValue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "getGuid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "userCalculators", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                { calculation: this.userCalcName, condition: (data) => !!data.nameFirst || !!data.nameLast }
            ]
        });
        Object.defineProperty(this, "courseCalculators", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                { calculation: this.courseCalcSlugYearSem, condition: (data) => 'code' in data || 'year' in data || 'semester' in data },
                { calculation: this.courseCalcRoles, condition: (data) => !!data.ownerIds || !!data.editorIds }
            ]
        });
        this.auth = auth;
        this.db = db;
        this.FieldValue = FieldValue;
        this.getGuid = getGuid;
    }
    saveNew(ref, defaults, data, getCalculated) {
        return __awaiter(this, void 0, void 0, function* () {
            const merged = Object.assign(Object.assign({}, defaults), data);
            const complete = Object.assign(Object.assign({}, merged), getCalculated(merged));
            yield ref.set(complete, { merge: true });
            return ref.id;
        });
    }
    saveUpdate(ref, update, getCalculated, deferCalcs = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!getCalculated) {
                return yield ref.set(update, { merge: true });
            }
            else if (deferCalcs) {
                yield this.db.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
                    const snapshotCheck = yield t.get(ref);
                    if (!snapshotCheck.data())
                        throw new Error('Object does not exist');
                    t.set(ref, update, { merge: true });
                }));
                return yield this.db.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
                    const snapshot = yield t.get(ref);
                    const merged = snapshot.data();
                    const calcsOnly = getCalculated(merged);
                    t.set(ref, calcsOnly, { merge: true });
                }));
            }
            else {
                return yield this.db.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
                    const snapshot = yield t.get(ref);
                    const existing = snapshot.data();
                    if (!existing)
                        throw new Error('Object does not exist');
                    const merged = Object.assign(Object.assign({}, existing), update);
                    const complete = Object.assign(Object.assign({}, update), getCalculated(merged));
                    t.set(ref, complete, { merge: true });
                }));
            }
        });
    }
    composeCalcs(c1, c2) {
        return (merged) => (Object.assign(Object.assign({}, c1(merged)), c2(merged)));
    }
    neededCalcs(calculators, data) {
        return (merged) => calculators.filter((cs) => cs.condition(data)).reduce((acc, el) => (Object.assign(Object.assign({}, acc), el.calculation(merged))), {});
    }
    createRunner(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = this.db.collection(firestore_schema_1.RUNNERS).doc();
            yield this.saveNew(ref, {}, data, () => ({ languages: [] }));
        });
    }
    createUser(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = id ? this.db.collection(firestore_schema_1.USERS).doc(id) : this.db.collection(firestore_schema_1.USERS).doc();
            return yield this.saveNew(ref, DEFAULTS.userDefaults, data, this.composeCalcs(this.userCalcName, () => ({ courseIds: [], courseAndSectionIds: [], createdAt: this.FieldValue.serverTimestamp() })));
        });
    }
    createUserWithCourseSections(data, courseSections, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = id ? this.db.collection(firestore_schema_1.USERS).doc(id) : this.db.collection(firestore_schema_1.USERS).doc();
            return yield this.saveNew(ref, DEFAULTS.userDefaults, data, this.composeCalcs(this.userCalcName, () => ({ courseIds: (0, object_extensions_1.keys)(courseSections), courseAndSectionIds: (0, object_extensions_1.entries)(courseSections).map(([courseId, sectionId]) => `${courseId}_${sectionId}`), createdAt: this.FieldValue.serverTimestamp() })));
        });
    }
    createOrUpdateUserWithCourseSections(data, courseSections, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield this.db.collection(firestore_schema_1.USERS_PRIVATE).where('email', '==', email).get().then(snapshot => snapshot.empty ? undefined : snapshot.docs[0].id);
            if (id === undefined) {
                const createdId = yield this.createUserWithCourseSections(data, courseSections);
                yield this.createUserPrivate(createdId, { email });
                return createdId;
            }
            const courseIds = Object.keys(courseSections);
            const courseAndSectionIds = Object.entries(courseSections).map(([courseId, sectionId]) => `${courseId}_${sectionId}`);
            yield this.db.collection(firestore_schema_1.USERS).doc(id).update({
                courseIds: this.FieldValue.arrayUnion(...courseIds),
                courseAndSectionIds: this.FieldValue.arrayUnion(...courseAndSectionIds)
            });
            return id;
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = this.db.collection(firestore_schema_1.USERS).doc(id);
            return yield this.saveUpdate(ref, data, this.neededCalcs(this.userCalculators, data));
        });
    }
    followUser(followerId, followingId, follow = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const operation = follow ? this.FieldValue.arrayUnion : this.FieldValue.arrayRemove;
            const batch = this.db.batch();
            batch.update(this.db.collection(firestore_schema_1.USERS).doc(followerId), { followingIds: operation(followingId) });
            batch.update(this.db.collection(firestore_schema_1.USERS).doc(followingId), { followerIds: operation(followerId) });
            yield batch.commit();
        });
    }
    updateAvatar(id, avatarUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultsSnap = yield this.db.collection(firestore_schema_1.ACTIVITY_RESULTS).where((0, type_extensions_1.prop)('userId'), '==', id).get();
            const batch = this.db.batch();
            const update = { avatarUrl };
            batch.set(this.db.collection(firestore_schema_1.USERS).doc(id), update, { merge: true });
            resultsSnap.docs.forEach((doc) => {
                const ref = this.db.collection(firestore_schema_1.ACTIVITY_RESULTS).doc(doc.id);
                const data = { userAvatarUrl: avatarUrl };
                batch.set(ref, data, { merge: true });
            });
            yield batch.commit();
        });
    }
    createUserPrivate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const complete = Object.assign(Object.assign(Object.assign({}, DEFAULTS.userPrivateDefaults), data), { notificationsSocialLastViewed: this.FieldValue.serverTimestamp(), notificationsStudyLastViewed: this.FieldValue.serverTimestamp() });
            return yield this.db.collection(firestore_schema_1.USERS_PRIVATE).doc(id).set(complete, { merge: true });
        });
    }
    updateUserPrivate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.collection(firestore_schema_1.USERS_PRIVATE).doc(id).set(data, { merge: true });
        });
    }
    readNotificationsSocial(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = { notificationsSocialLastViewed: this.FieldValue.serverTimestamp() };
            return yield this.db.collection(firestore_schema_1.USERS_PRIVATE).doc(id).set(data, { merge: true });
        });
    }
    readNotificationsStudy(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = { notificationsStudyLastViewed: this.FieldValue.serverTimestamp() };
            return yield this.db.collection(firestore_schema_1.USERS_PRIVATE).doc(id).set(data, { merge: true });
        });
    }
    userCalcName(merged) {
        return { name: `${merged.nameFirst} ${merged.nameLast}` };
    }
    createCourse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = this.db.collection(firestore_schema_1.COURSES).doc();
            return yield this.saveNew(ref, DEFAULTS.courseDefaults, data, this.composeCalcs(this.courseCalcSlugYearSem, this.courseCalcRoles));
        });
    }
    updateCourse(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = this.db.collection(firestore_schema_1.COURSES).doc(id);
            yield this.saveUpdate(ref, data, this.neededCalcs(this.courseCalculators, data), !!data.ownerIds || !!data.editorIds);
        });
    }
    courseCalcSlugYearSem(merged) {
        return {
            slug: `${merged.code}-${merged.year.toString().slice(-2)}s${merged.semester}`,
            yearSem: Number.parseInt(`${merged.year}${merged.semester.toString().padStart(2, '0')}`)
        };
    }
    courseCalcRoles(merged) {
        const studentIds = (0, object_extensions_1.values)(merged.sections).flatMap((section) => { var _a; return (_a = section === null || section === void 0 ? void 0 : section.studentIds) !== null && _a !== void 0 ? _a : []; });
        return {
            roleEdit: [...new Set([...merged.ownerIds, ...merged.editorIds])],
            roleView: [...new Set([...merged.ownerIds, ...merged.editorIds, ...studentIds])]
        };
    }
    createActivity(courseId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
                const courseRef = this.db.collection(firestore_schema_1.COURSES).doc(courseId);
                const courseSnap = yield t.get(courseRef);
                const course = courseSnap.data();
                if (!course)
                    throw new Error('Course does not exist');
                const activityMerged = Object.assign(Object.assign({}, DEFAULTS.courseActivityDefaults), data);
                const activityComplete = Object.assign(Object.assign({}, activityMerged), this.courseActivityCalcSlug(activityMerged));
                const activityId = this.getGuid();
                const courseUpdate = (0, mapKeys_1.default)(activityComplete, (_value, key) => `activities.${activityId}.${key}`);
                t.update(courseRef, courseUpdate);
                const aps = {
                    courseId: courseId,
                    activitySlug: activityComplete.slug,
                    problems: {},
                    roleSubmit: course.roleEdit,
                    roleView: course.roleView
                };
                const apsRef = this.db.collection(firestore_schema_1.ACTIVITY_PROBLEM_SETS).doc(activityId);
                t.set(apsRef, aps, { merge: true });
                return activityId;
            }));
        });
    }
    updateActivity(courseId, activityId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const complete = data.name ? Object.assign(Object.assign({}, data), this.courseActivityCalcSlug({ name: data.name })) : data;
            const courseUpdate = (0, mapKeys_1.default)(complete, (_value, key) => `activities.${activityId}.${key}`);
            const courseRef = this.db.collection(firestore_schema_1.COURSES).doc(courseId);
            return yield courseRef.update(courseUpdate);
        });
    }
    courseActivityCalcSlug(merged) {
        return {
            slug: (0, url_helpers_1.urlify)(merged.name)
        };
    }
    createProblems(activityId, problems) {
        return __awaiter(this, void 0, void 0, function* () {
            const problemSetParts = problems.map((data) => {
                const complete = Object.assign(Object.assign({}, DEFAULTS.problemDefaults), data);
                const problemId = this.getGuid();
                return (0, mapKeys_1.default)(complete, (_value, key) => `problems.${problemId}.${key}`);
            });
            const apsUpdate = Object.assign({}, ...problemSetParts);
            const apsRef = this.db.collection(firestore_schema_1.ACTIVITY_PROBLEM_SETS).doc(activityId);
            yield apsRef.update(apsUpdate);
        });
    }
    createProblem(activityId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const complete = Object.assign(Object.assign({}, DEFAULTS.problemDefaults), data);
            const problemId = this.getGuid();
            const apsUpdate = (0, mapKeys_1.default)(complete, (_value, key) => `problems.${problemId}.${key}`);
            const apsRef = this.db.collection(firestore_schema_1.ACTIVITY_PROBLEM_SETS).doc(activityId);
            yield apsRef.update(apsUpdate);
            return problemId;
        });
    }
    updateProblem(activityId, problemId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const apsUpdate = (0, mapKeys_1.default)(data, (_value, key) => `problems.${problemId}.${key}`);
            const apsRef = this.db.collection(firestore_schema_1.ACTIVITY_PROBLEM_SETS).doc(activityId);
            return yield apsRef.update(apsUpdate);
        });
    }
    createTest(activityId, problemId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const complete = Object.assign(Object.assign({}, DEFAULTS.testDefaults), data);
            const testId = this.getGuid();
            const apsUpdate = (0, mapKeys_1.default)(complete, (_value, key) => `problems.${problemId}.tests.${testId}.${key}`);
            const apsRef = this.db.collection(firestore_schema_1.ACTIVITY_PROBLEM_SETS).doc(activityId);
            yield apsRef.update(apsUpdate);
            return testId;
        });
    }
    updateTest(activityId, problemId, testId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const apsUpdate = (0, mapKeys_1.default)(data, (_value, key) => `problems.${problemId}.tests.${testId}.${key}`);
            const apsRef = this.db.collection(firestore_schema_1.ACTIVITY_PROBLEM_SETS).doc(activityId);
            return yield apsRef.update(apsUpdate);
        });
    }
    deleteTest(activityId, problemId, testId) {
        return __awaiter(this, void 0, void 0, function* () {
            const apsUpdate = {
                [`problems.${problemId}.tests.${testId}`]: this.FieldValue.delete()
            };
            const apsRef = this.db.collection(firestore_schema_1.ACTIVITY_PROBLEM_SETS).doc(activityId);
            return yield apsRef.update(apsUpdate);
        });
    }
    createSubmission(courseId, activityId, userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const mergedProblemResult = Object.assign(Object.assign({}, DEFAULTS.problemResultDefaults), data);
                const completeProblemResult = Object.assign(Object.assign({}, mergedProblemResult), { date: this.FieldValue.serverTimestamp(), status: enums_1.ProblemResultStatus.Evaluating, errorOutput: '', percent: 0, isFirstBest: false, testResults: [], testCount: 0, passCount: 0, failCount: 0 });
                const problemResultId = this.getGuid();
                const activityResultId = this.calcActivityResultId(activityId, userId);
                const activityResultRef = this.db.collection(firestore_schema_1.ACTIVITY_RESULTS).doc(activityResultId);
                const activityResultSnap = yield t.get(activityResultRef);
                const activityResult = activityResultSnap.data();
                if (activityResult) {
                    const activityResultUpdate = (0, mapKeys_1.default)(completeProblemResult, (_value, key) => `problemResults.${problemResultId}.${key}`);
                    t.update(activityResultRef, activityResultUpdate);
                }
                else {
                    const userSnap = yield t.get(this.db.collection(firestore_schema_1.USERS).doc(userId));
                    const user = userSnap.data();
                    if (!user)
                        throw new Error('User does not exist');
                    const courseAndSectionId = (_a = user.courseAndSectionIds.find((csid) => csid.startsWith(courseId))) !== null && _a !== void 0 ? _a : '';
                    const activityResultNew = Object.assign(Object.assign({}, DEFAULTS.activityResultDefaults), { userId, userName: user.name, userAvatarUrl: user.avatarUrl, activityId, courseId, courseAndSectionId, problemResults: { [problemResultId]: completeProblemResult }, totalScore: 0, totalPercent: 0, isComplete: false, lastImprovement: this.FieldValue.serverTimestamp() });
                    t.set(activityResultRef, activityResultNew, { merge: true });
                }
                const submissionJob = {
                    activityId,
                    problemId: completeProblemResult.problemId,
                    userId,
                    activityResultId,
                    problemResultId,
                    originalDate: this.FieldValue.serverTimestamp(),
                    language: completeProblemResult.language,
                    fileRefs: completeProblemResult.fileRefs
                };
                const submissionRef = this.db.collection(firestore_schema_1.SUBMISSION_JOBS).doc();
                t.set(submissionRef, submissionJob);
                return problemResultId;
            }));
        });
    }
    calcActivityResultId(activityId, userId) {
        return `${activityId}_${userId}`;
    }
}
exports.Dao = Dao;
//# sourceMappingURL=dao.js.map