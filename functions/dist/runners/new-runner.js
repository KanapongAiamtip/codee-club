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
exports.onCreateRunner = void 0;
const dao_1 = require("@codee-club/common/dist/dao");
const string_cases_1 = require("@codee-club/common/dist/utils/string-cases");
const firebase_admin_initialized_1 = require("../_services/firebase-admin-initialized");
const get_token_1 = require("../_services/gcp/get-token");
const get_post_1 = require("../_services/request-helpers/get-post");
const onCreateRunner = (snapshot, _context) => __awaiter(void 0, void 0, void 0, function* () {
    const runner = snapshot.data();
    const url = `${runner.url}/`;
    const token = yield get_token_1.getToken(url);
    const headers = { Authorization: `Bearer ${token}` };
    const response = yield get_post_1.get({ url, headers })
        .catch(error => {
        console.error(error);
        throw error;
    });
    const languages = response.body.languages;
    console.info('Registering:', languages);
    yield snapshot.ref.update({ languages });
    yield updateLanguages(url, languages);
});
exports.onCreateRunner = onCreateRunner;
const updateLanguages = (baseUrl, languages) => __awaiter(void 0, void 0, void 0, function* () {
    const configLanguages = Object.fromEntries(languages.map(({ name, version, path }) => {
        const versionMajorMinor = version.split('.').slice(0, 2);
        const url = `${baseUrl}${path}`;
        const key = `${name.toLowerCase()}-${versionMajorMinor.join('-')}`;
        const label = `${string_cases_1.toTitleCase(name)} ${versionMajorMinor.join('.')}`;
        return [key, { name, version, label, url }];
    }));
    return firebase_admin_initialized_1.db.collection(dao_1.CONFIG).doc(dao_1.CONFIG_LANGUAGES).set(configLanguages, { merge: true });
});
//# sourceMappingURL=new-runner.js.map