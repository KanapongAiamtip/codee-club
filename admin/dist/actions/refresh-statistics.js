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
const object_extensions_1 = require("@codee-club/common/dist/utils/object-extensions");
const firebase_admin_initialized_1 = __importDefault(require("~/firebase-admin-initialized"));
const modes_1 = require("~/modes");
const db = firebase_admin_initialized_1.default.firestore();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield modes_1.productionWarning(__filename);
    const usersSnapshot = yield db.collection(dao_1.USERS).get();
    const members = usersSnapshot.size;
    const resultsSnapshot = yield db.collection(dao_1.ACTIVITY_RESULTS).get();
    let submissionSuccesses = 0;
    let submissionCompileFailures = 0;
    let submissionTestFailures = 0;
    resultsSnapshot.forEach((doc) => {
        const result = doc.data();
        const problemResults = object_extensions_1.values(result.problemResults);
        submissionSuccesses += problemResults.filter((pr) => pr.status === 'PASS').length;
        submissionCompileFailures += problemResults.filter((pr) => pr.status === 'INVALID').length;
        submissionTestFailures += problemResults.filter((pr) => pr.status === 'FAIL').length;
    });
    const update = { members, submissionSuccesses, submissionCompileFailures, submissionTestFailures };
    yield db.collection(dao_1.CONFIG).doc(dao_1.CONFIG_STATISTICS).set(update, { merge: true });
    console.info('Complete');
});
main()
    .then(() => process.exit())
    .catch((error) => console.error(error));
//# sourceMappingURL=refresh-statistics.js.map