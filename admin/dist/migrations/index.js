"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const migrate_1 = __importDefault(require("./migrate"));
migrate_1.default()
    .then(() => process.exit())
    .catch((error) => console.error(error));
//# sourceMappingURL=index.js.map