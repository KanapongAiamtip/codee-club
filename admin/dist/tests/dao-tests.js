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
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const dao_1 = require("@codee-club/common/dist/dao");
const context_1 = require("~/context");
const firebase_admin_initialized_1 = require("~/firebase-admin-initialized");
const dao = new dao_1.Dao(context_1.context);
const userTest = () => __awaiter(void 0, void 0, void 0, function* () {
    const userSave = { nameFirst: 'Rodney', nameLast: 'McKay' };
    const userId = yield dao.createUser(userSave);
    const userSnap = yield firebase_admin_initialized_1.db.collection(dao_1.USERS).doc(userId).get();
    const user = userSnap.data();
    if (!user)
        throw new Error("User doesn't exist");
    console_1.assert(user.name === 'Rodney McKay');
    console.info('✓ userCreate');
    return yield Promise.resolve();
});
const userWithIdTest = () => __awaiter(void 0, void 0, void 0, function* () {
    const userId = 'charlesa';
    const userSave = { nameFirst: 'Charles', nameLast: 'Allen' };
    yield dao.createUser(userSave, userId);
    const userSnap = yield firebase_admin_initialized_1.db.collection(dao_1.USERS).doc(userId).get();
    const user = userSnap.data();
    if (!user)
        throw new Error("User doesn't exist");
    console_1.assert(user.name === 'Charles Allen');
    console.info('✓ userCreateWithId');
    return yield Promise.resolve();
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield userTest();
    yield userWithIdTest();
});
main()
    .then(() => process.exit())
    .catch((error) => console.error(error));
//# sourceMappingURL=dao-tests.js.map