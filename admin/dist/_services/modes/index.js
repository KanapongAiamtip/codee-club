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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionWarning = exports.MODE = void 0;
const dedent_js_1 = __importDefault(require("dedent-js"));
const readline_1 = __importDefault(require("readline"));
const random_1 = require("@codee-club/common/dist/utils/random");
const modeArg = process.argv.find((arg) => arg.startsWith('--mode='));
exports.MODE = (_a = modeArg === null || modeArg === void 0 ? void 0 : modeArg.split('=')[1].toLowerCase()) !== null && _a !== void 0 ? _a : 'emu';
const phews = ['Phew; that was close!', 'Good choice bro!'];
const productionWarning = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    const filePathParts = filename.split(/[/\\]/);
    const [file, folder] = [filePathParts.pop(), filePathParts.pop()];
    console.info(`Begin: ${folder !== null && folder !== void 0 ? folder : ''}/${file !== null && file !== void 0 ? file : ''}`);
    if (exports.MODE !== 'emu') {
        const warning = dedent_js_1.default(`
      
      ******* WARNING *******
       Running in [${exports.MODE.toUpperCase()}] mode
      ***********************

      Are you sure you want to continue? [y|N] `);
        const ui = readline_1.default.createInterface({ input: process.stdin, output: process.stdout });
        const result = yield new Promise((resolve) => ui.question(warning, (answer) => resolve(answer)));
        ui.close();
        if (result.toLowerCase() !== 'y') {
            console.info(`${random_1.randomElement(phews)} Execution cancelled`);
            process.exit(0);
        }
    }
});
exports.productionWarning = productionWarning;
//# sourceMappingURL=index.js.map