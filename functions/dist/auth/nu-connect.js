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
exports.getUserIdentity = exports.exchangeAuthCodeForToken = exports.authorizeUrl = void 0;
const firebase_functions_initialized_1 = require("../_services/firebase-functions-initialized");
const get_post_1 = require("../_services/request-helpers/get-post");
const { clientId, clientSecret, scopes, baseUrl } = firebase_functions_initialized_1.config.auth;
function authorizeUrl(redirectUri) {
    const queryString = `client_id=${clientId}&scope=${scopes}&response_type=code&redirect_uri=${redirectUri}`;
    return `${baseUrl}/oauth/authorize?${queryString}`;
}
exports.authorizeUrl = authorizeUrl;
function exchangeAuthCodeForToken(authCode, redirectUri) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}/oauth/token`;
        const data = {
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            code: authCode,
            redirect_uri: redirectUri
        };
        return yield get_post_1.post({ url, data });
    });
}
exports.exchangeAuthCodeForToken = exchangeAuthCodeForToken;
function getUserIdentity(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}/api/identity`;
        const headers = { Authorization: `Bearer ${token.access_token}` };
        const response = yield get_post_1.get({ url, headers });
        return response.body;
    });
}
exports.getUserIdentity = getUserIdentity;
//# sourceMappingURL=nu-connect.js.map