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
const firebase_admin_initialized_1 = __importDefault(require("~/firebase-admin-initialized"));
const _1 = require(".");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield _1.productionWarning(__filename);
    console.info(`firebase-admin: v${firebase_admin_initialized_1.default.SDK_VERSION}`);
});
main()
    .then(() => process.exit())
    .catch((error) => console.error(error));
//# sourceMappingURL=check-mode.js.map