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
exports.writeCoverage = void 0;
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
function writeCoverage(projectId, coverageFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;
        if (!emulatorHost)
            return;
        const coverageUrl = `http://${emulatorHost}/emulator/v1/projects/${projectId}:ruleCoverage.html`;
        const fstream = fs_1.default.createWriteStream(coverageFile);
        return yield new Promise((resolve, reject) => {
            http_1.default.get(coverageUrl, (res) => {
                res.pipe(fstream, { end: true });
                res.on('end', () => {
                    fstream.close();
                    resolve();
                });
                res.on('error', reject);
            });
        });
    });
}
exports.writeCoverage = writeCoverage;
//# sourceMappingURL=rule-coverage.js.map