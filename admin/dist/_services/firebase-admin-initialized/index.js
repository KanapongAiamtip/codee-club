"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timestamp = exports.FieldValue = exports.storage = exports.db = exports.auth = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const modes_1 = require("~/modes");
require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");
const pathToRoot = '../../../../';
if (modes_1.MODE === 'emu') {
    const firebaseJsonPath = path_1.default.join(__dirname, pathToRoot, './firebase.json');
    const firebaseJson = JSON.parse(fs_1.default.readFileSync(firebaseJsonPath, { encoding: 'utf8' }));
    process.env.FIREBASE_AUTH_EMULATOR_HOST = `localhost:${firebaseJson.emulators.auth.port}`;
    process.env.FIRESTORE_EMULATOR_HOST = `localhost:${firebaseJson.emulators.firestore.port}`;
    process.env.FIREBASE_STORAGE_EMULATOR_HOST = `localhost:${firebaseJson.emulators.storage.port}`;
    const emuProjectId = 'codee-club-emu';
    firebase_admin_1.default.initializeApp({ projectId: emuProjectId });
    console.info(`Using project: ${emuProjectId}\n`);
}
else {
    const configPath = path_1.default.join(__dirname, pathToRoot, `configs/service-account.${modes_1.MODE}.json`);
    const serviceAccount = require(configPath);
    firebase_admin_1.default.initializeApp({ credential: firebase_admin_1.default.credential.cert(serviceAccount) });
    console.info(`Using project: ${serviceAccount.project_id}\n`);
}
exports.default = firebase_admin_1.default;
exports.auth = firebase_admin_1.default.auth();
exports.db = firebase_admin_1.default.firestore();
exports.storage = firebase_admin_1.default.storage();
exports.FieldValue = firebase_admin_1.default.firestore.FieldValue;
exports.Timestamp = firebase_admin_1.default.firestore.Timestamp;
//# sourceMappingURL=index.js.map