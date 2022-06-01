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
const chalk_1 = __importDefault(require("chalk"));
const dao_1 = require("@codee-club/common/dist/dao");
const object_extensions_1 = require("@codee-club/common/dist/utils/object-extensions");
const string_cases_1 = require("@codee-club/common/dist/utils/string-cases");
const firebase_admin_initialized_1 = __importDefault(require("~/firebase-admin-initialized"));
const modes_1 = require("~/modes");
const db = firebase_admin_initialized_1.default.firestore();
const findByProperty = (collection, value, prop) => __awaiter(void 0, void 0, void 0, function* () {
    if (value.length === 0)
        return [];
    return yield db.collection(collection)
        .where(prop, '>=', value)
        .where(prop, '<', value.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1)))
        .get()
        .then(snap => snap.docs.map(doc => object_extensions_1.valueWithId([doc.id, doc.data()])))
        .catch(error => {
        console.error(error);
        return [];
    });
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield modes_1.productionWarning(__filename);
    const inputName = (_a = process.argv.find(arg => arg.startsWith('--name='))) === null || _a === void 0 ? void 0 : _a.split('--name=')[1];
    if (!inputName)
        return console.error(chalk_1.default.red('You must specify a name with --name=NAME or --name="FIRST LAST"'));
    const { nameFirst, nameLast } = string_cases_1.fixName(inputName.replace(/"/, ''));
    console.info('Searching for:', nameFirst, nameLast);
    const resultsFirst = findByProperty(dao_1.USERS, nameFirst, 'nameFirst');
    const resultsLast = findByProperty(dao_1.USERS, nameLast.length > 0 ? nameLast : nameFirst, 'nameLast');
    const allResults = [...(yield resultsFirst), ...(yield resultsLast)]
        .sort((u1, u2) => u1.name.localeCompare(u2.name));
    console.info(`--- ${allResults.length} result${allResults.length === 1 ? '' : 's'} ---`);
    allResults.forEach(user => console.info(`${user.id} - ${user.name}`));
});
main()
    .then(() => process.exit())
    .catch((error) => console.error(error));
//# sourceMappingURL=get-user-by-name.js.map