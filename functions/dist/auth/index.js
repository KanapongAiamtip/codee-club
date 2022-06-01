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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.getUrl = void 0;
const dao_1 = require("@codee-club/common/dist/dao");
const string_cases_1 = require("@codee-club/common/dist/utils/string-cases");
const context_1 = require("../_services/context");
const firebase_admin_initialized_1 = __importStar(require("../_services/firebase-admin-initialized"));
const nu_connect_1 = require("./nu-connect");
const dao = new dao_1.Dao(context_1.context);
const getUrl = (data, _context) => {
    return nu_connect_1.authorizeUrl(data.redirectUri);
};
exports.getUrl = getUrl;
const getToken = (data, _context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const response = yield nu_connect_1.exchangeAuthCodeForToken(data.authCode, data.redirectUri);
    if ('error' in response.body) {
        console.error(response.body.error);
        return { error: 'Failed to exchange NU token' };
    }
    const nuToken = response.body;
    const userIdentity = yield nu_connect_1.getUserIdentity(nuToken);
    let userId;
    let userData;
    try {
        const userPrivateSnapshot = yield firebase_admin_initialized_1.db.collection(dao_1.USERS_PRIVATE).where('email', '==', userIdentity.email).limit(1).get();
        userId = (_a = userPrivateSnapshot.docs[0]) === null || _a === void 0 ? void 0 : _a.id;
        if (userId) {
            const userSnapshot = yield firebase_admin_initialized_1.db.collection(dao_1.USERS).doc(userId).get();
            userData = userSnapshot.data();
        }
    }
    catch (error) {
        console.error(error);
        return { error: 'Failed to load profile' };
    }
    const { nameFirst, nameLast } = string_cases_1.fixName(userIdentity.name);
    const existingName = (_b = userData === null || userData === void 0 ? void 0 : userData.name) !== null && _b !== void 0 ? _b : '';
    if (userData) {
        const update = existingName
            ? {
                code: userIdentity.username
            }
            : {
                code: userIdentity.username,
                nameFirst,
                nameLast
            };
        const updatePrivate = {
            nuConnectToken: nuToken
        };
        yield dao.updateUser(userId, update);
        yield dao.updateUserPrivate(userId, updatePrivate);
    }
    else {
        const user = {
            code: userIdentity.username,
            nameFirst,
            nameLast
        };
        const userPrivate = {
            email: userIdentity.email,
            nuConnectToken: nuToken
        };
        userId = yield dao.createUser(user);
        yield dao.createUserPrivate(userId, userPrivate);
        const memberCounterUpdate = { members: firebase_admin_initialized_1.default.firestore.FieldValue.increment(1) };
        yield firebase_admin_initialized_1.db.collection(dao_1.CONFIG).doc(dao_1.CONFIG_STATISTICS).update(memberCounterUpdate);
    }
    return yield firebase_admin_initialized_1.default
        .auth()
        .createCustomToken(userId)
        .catch((error) => {
        console.error(error);
        return { error: 'Failed to create Firebase token' };
    });
});
exports.getToken = getToken;
//# sourceMappingURL=index.js.map