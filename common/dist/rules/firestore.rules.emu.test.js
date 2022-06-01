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
Object.defineProperty(exports, "__esModule", { value: true });
const rules_unit_testing_1 = require("@firebase/rules-unit-testing");
const dao_1 = require("../dao");
const users_1 = require("./test-data/users");
const rule_coverage_1 = require("./test-utils/rule-coverage");
const PROJECT_ID = 'firestore-emulator-example';
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all((0, rules_unit_testing_1.apps)().map((app) => __awaiter(void 0, void 0, void 0, function* () { return yield app.delete(); })));
    yield (0, rule_coverage_1.writeCoverage)(PROJECT_ID, 'firestore-coverage.html');
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, rules_unit_testing_1.clearFirestoreData)({ projectId: PROJECT_ID });
}));
function authedFirestore(auth) {
    return (0, rules_unit_testing_1.initializeTestApp)({ projectId: PROJECT_ID, auth }).firestore();
}
test('require users to log in before creating a user profile', () => __awaiter(void 0, void 0, void 0, function* () {
    const db = authedFirestore();
    yield (0, rules_unit_testing_1.assertFails)(db.collection(dao_1.USERS).add(users_1.alice));
}));
test('require nameFirst, nameLast, name, createdAt date when creating a user profile', () => __awaiter(void 0, void 0, void 0, function* () {
    const db = authedFirestore({ uid: 'bertha' });
    const profile = db.collection(dao_1.USERS).doc('bertha');
    const { nameFirst } = users_1.bertha, berthaMinusNameFirst = __rest(users_1.bertha, ["nameFirst"]);
    const { nameLast } = users_1.bertha, berthaMinusNameLast = __rest(users_1.bertha, ["nameLast"]);
    const { name } = users_1.bertha, berthaMinusName = __rest(users_1.bertha, ["name"]);
    const { createdAt } = users_1.bertha, berthaMinusCreatedAt = __rest(users_1.bertha, ["createdAt"]);
    yield (0, rules_unit_testing_1.assertFails)(profile.set(berthaMinusNameFirst));
    yield (0, rules_unit_testing_1.assertFails)(profile.set(berthaMinusNameLast));
    yield (0, rules_unit_testing_1.assertFails)(profile.set(berthaMinusName));
    yield (0, rules_unit_testing_1.assertFails)(profile.set(berthaMinusCreatedAt));
}));
test('should let users create their own profile', () => __awaiter(void 0, void 0, void 0, function* () {
    const db = authedFirestore({ uid: 'alice' });
    yield (0, rules_unit_testing_1.assertSucceeds)(db.collection(dao_1.USERS).doc('alice').set(users_1.alice));
}));
test('should not let users create other user profiles', () => __awaiter(void 0, void 0, void 0, function* () {
    const db = authedFirestore({ uid: 'alice' });
    yield (0, rules_unit_testing_1.assertFails)(db.collection(dao_1.USERS).doc('bertha').set(users_1.bertha));
}));
test('should only let users update their own profile', () => __awaiter(void 0, void 0, void 0, function* () {
    const dbOtherUser = authedFirestore({ uid: 'clare' });
    yield dbOtherUser.collection(dao_1.USERS).doc('clare').set(users_1.clare);
    const db = authedFirestore({ uid: 'alice' });
    yield db.collection(dao_1.USERS).doc('alice').set(users_1.alice);
    yield (0, rules_unit_testing_1.assertSucceeds)(db.collection(dao_1.USERS).doc('alice').update({
        nameFirst: 'Alicia'
    }));
    yield (0, rules_unit_testing_1.assertFails)(db.collection(dao_1.USERS).doc('clare').update({
        nameFirst: 'Clara'
    }));
}));
test("should let users add/remove themselves to other user's followers", () => __awaiter(void 0, void 0, void 0, function* () {
    const dbOtherUser = authedFirestore({ uid: 'clare' });
    yield dbOtherUser.collection(dao_1.USERS).doc('clare').set(users_1.clare);
    const db = authedFirestore({ uid: 'alice' });
    yield (0, rules_unit_testing_1.assertSucceeds)(db
        .collection(dao_1.USERS)
        .doc('clare')
        .update({
        followerIds: rules_unit_testing_1.firestore.FieldValue.arrayUnion('alice')
    }));
    yield (0, rules_unit_testing_1.assertSucceeds)(db
        .collection(dao_1.USERS)
        .doc('clare')
        .update({
        followerIds: rules_unit_testing_1.firestore.FieldValue.arrayRemove('alice')
    }));
}));
test("should not let users add/remove others to other user's followers", () => __awaiter(void 0, void 0, void 0, function* () {
    const dbOtherUser = authedFirestore({ uid: 'clare' });
    const clareWithFollowers = Object.assign(Object.assign({}, users_1.clare), { followerIds: ['bertha', 'duncan'] });
    yield dbOtherUser.collection(dao_1.USERS).doc('clare').set(clareWithFollowers);
    const db = authedFirestore({ uid: 'alice' });
    yield (0, rules_unit_testing_1.assertFails)(db
        .collection(dao_1.USERS)
        .doc('clare')
        .update({
        followerIds: rules_unit_testing_1.firestore.FieldValue.arrayUnion('gerald')
    }));
    yield (0, rules_unit_testing_1.assertFails)(db
        .collection(dao_1.USERS)
        .doc('clare')
        .update({
        followerIds: rules_unit_testing_1.firestore.FieldValue.arrayRemove('duncan')
    }));
}));
test('should allow users to read/write their protected subcollection', () => __awaiter(void 0, void 0, void 0, function* () {
    const db = authedFirestore({ uid: 'alice' });
    const aliceRef = db.collection(dao_1.USERS_PRIVATE).doc('alice');
    yield (0, rules_unit_testing_1.assertSucceeds)(aliceRef.set({ email: 'alice@codee.club' }));
}));
test('should deny others from read/write to protected subcollection', () => __awaiter(void 0, void 0, void 0, function* () {
    const dbOtherUser = authedFirestore({ uid: 'clare' });
    yield dbOtherUser.collection(dao_1.USERS_PRIVATE).doc('clare').set({ email: 'clare@codee.club' });
    const db = authedFirestore({ uid: 'alice' });
    const clarePrivateRef = db.collection(dao_1.USERS_PRIVATE).doc('clare');
    yield (0, rules_unit_testing_1.assertFails)(clarePrivateRef.get());
    yield (0, rules_unit_testing_1.assertFails)(clarePrivateRef.set({ email: 'sabotage@codee.club' }));
}));
//# sourceMappingURL=firestore.rules.emu.test.js.map