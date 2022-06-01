"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timestamp = exports.FieldValue = exports.db = exports.auth = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
firebase_admin_1.default.initializeApp();
console.info(`Using project: ${process.env.FUNCTIONS_EMULATOR ? 'codee-club-emu' : (_a = process.env.GCLOUD_PROJECT) !== null && _a !== void 0 ? _a : ''}`);
exports.default = firebase_admin_1.default;
exports.auth = firebase_admin_1.default.auth();
exports.db = firebase_admin_1.default.firestore();
exports.FieldValue = firebase_admin_1.default.firestore.FieldValue;
exports.Timestamp = firebase_admin_1.default.firestore.Timestamp;
//# sourceMappingURL=index.js.map