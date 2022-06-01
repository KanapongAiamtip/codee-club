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
const dao_1 = require("@codee-club/common/dist/dao");
const string_cases_1 = require("@codee-club/common/dist/utils/string-cases");
const firebase_admin_initialized_1 = __importDefault(require("~/firebase-admin-initialized"));
const modes_1 = require("~/modes");
const db = firebase_admin_initialized_1.default.firestore();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield modes_1.productionWarning(__filename);
    const allUsersSnap = yield db.collection(dao_1.USERS).get();
    const allUsers = allUsersSnap.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
    for (const user of allUsers) {
        const fixed = string_cases_1.fixName(user.data.name);
        if (fixed.name !== user.data.name || fixed.nameFirst !== user.data.nameFirst || fixed.nameLast !== user.data.nameLast) {
            const update = fixed;
            console.info(`Fixing: ${user.data.name} => ${fixed.name} [${user.id}]`);
            yield db.collection(dao_1.USERS).doc(user.id).set(update, { merge: true });
        }
    }
    console.info('Complete');
});
main()
    .then(() => process.exit())
    .catch((error) => console.error(error));
//# sourceMappingURL=fix-user-names.js.map