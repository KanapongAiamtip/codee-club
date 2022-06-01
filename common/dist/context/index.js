"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeeContext = void 0;
const guids_1 = require("../utils/guids");
class CodeeContext {
    constructor(auth, firestore, fieldValue) {
        Object.defineProperty(this, "auth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "FieldValue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "getGuid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.auth = auth;
        this.db = firestore;
        this.FieldValue = fieldValue;
        this.getGuid = (0, guids_1.GuidGen)(this.db);
    }
}
exports.CodeeContext = CodeeContext;
//# sourceMappingURL=index.js.map