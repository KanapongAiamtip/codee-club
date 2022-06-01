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
const fs_1 = __importDefault(require("fs"));
const lodash_1 = require("lodash");
const path_1 = __importDefault(require("path"));
const object_extensions_1 = require("@codee-club/common/dist/utils/object-extensions");
const string_cases_1 = require("@codee-club/common/dist/utils/string-cases");
const VUE_FIREBASE_PREFIX = 'VUE_APP_FIREBASE_';
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const pathToRoot = '../../../';
    const configPath = path_1.default.join(__dirname, pathToRoot, 'configs');
    const hostingPath = path_1.default.join(__dirname, pathToRoot, 'hosting');
    const configPattern = /^firebase-config\.(\w+)\.json$/g;
    fs_1.default.readdirSync(configPath).forEach((filename) => {
        const matches = configPattern.exec(filename);
        if (!matches)
            return;
        const mode = matches[1].toLowerCase();
        if (mode === 'emu')
            return console.info('emu: Ignore (emu is the default configuration from .env)');
        const firebaseConfig = JSON.parse(fs_1.default.readFileSync(path_1.default.join(configPath, filename), { encoding: 'utf8' }));
        const destinationFile = path_1.default.join(hostingPath, `.env.${mode}.local`);
        const existingEnv = fs_1.default.existsSync(destinationFile) ? fs_1.default.readFileSync(destinationFile, { encoding: 'utf-8' }) : '';
        const envPairs = existingEnv
            .replace(/\r\n/g, '\n')
            .split('\n')
            .filter((line) => line.includes('='))
            .map(line => line.split('='));
        const envObject = lodash_1.mapValues(lodash_1.keyBy(envPairs, pair => pair[0]), pair => pair[1]);
        if (!envObject.VUE_APP_EMU_PORT_AUTH)
            envObject.VUE_APP_EMU_PORT_AUTH = '';
        if (!envObject.VUE_APP_EMU_PORT_FIRESTORE)
            envObject.VUE_APP_EMU_PORT_FIRESTORE = '';
        if (!envObject.VUE_APP_EMU_PORT_FUNCTIONS)
            envObject.VUE_APP_EMU_PORT_FUNCTIONS = '';
        if (!envObject.VUE_APP_EMU_PORT_STORAGE)
            envObject.VUE_APP_EMU_PORT_STORAGE = '';
        object_extensions_1.entries(firebaseConfig).forEach(([key, value]) => {
            envObject[VUE_FIREBASE_PREFIX + string_cases_1.snakeize(key).toUpperCase()] = value;
        });
        const updatedEnv = object_extensions_1.entries(envObject)
            .sort(([k1, _v1], [k2, _v2]) => k1.localeCompare(k2))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        if (updatedEnv === existingEnv) {
            console.info(`${mode}: Already up-to-date`);
        }
        else {
            fs_1.default.writeFileSync(destinationFile, updatedEnv);
            console.info(`${mode}: Updated firebase-config`);
        }
    });
});
main()
    .then(() => process.exit())
    .catch((error) => console.error(error));
//# sourceMappingURL=hosting-import.js.map