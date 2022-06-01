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
exports.getToken = void 0;
const child_process_1 = require("child_process");
const phin_1 = __importDefault(require("phin"));
function getLocalToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const command = 'gcloud auth print-identity-token';
        return yield new Promise((resolve, reject) => {
            child_process_1.exec(command, (error, stdout, _stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(stdout.replace(/\r?\n|\r/g, ''));
            });
        });
    });
}
function getOauthToken(receivingServiceUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const metadataServerUrl = 'http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=';
        const url = metadataServerUrl + receivingServiceUrl;
        const headers = { 'Metadata-Flavor': 'Google' };
        const response = yield phin_1.default({ url, headers });
        return response.body.toString();
    });
}
const getToken = (serviceUrl) => __awaiter(void 0, void 0, void 0, function* () {
    return process.env.FUNCTIONS_EMULATOR ? yield getLocalToken() : yield getOauthToken(serviceUrl);
});
exports.getToken = getToken;
//# sourceMappingURL=get-token.js.map