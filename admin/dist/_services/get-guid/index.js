"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guids_1 = require("@codee-club/common/dist/utils/guids");
const firebase_admin_initialized_1 = __importDefault(require("~/firebase-admin-initialized"));
exports.default = guids_1.GuidGen(firebase_admin_initialized_1.default.firestore());
//# sourceMappingURL=index.js.map