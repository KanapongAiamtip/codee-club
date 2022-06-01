"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = void 0;
const context_1 = require("@codee-club/common/dist/context");
const firebase_admin_initialized_1 = require("../firebase-admin-initialized");
exports.context = new context_1.CodeeContext(firebase_admin_initialized_1.auth, firebase_admin_initialized_1.db, firebase_admin_initialized_1.FieldValue);
//# sourceMappingURL=index.js.map