"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.post = void 0;
const phin_1 = __importDefault(require("phin"));
exports.post = phin_1.default.defaults({
    method: 'POST',
    parse: 'json',
    timeout: 5000
});
exports.get = phin_1.default.defaults({ parse: 'json', timeout: 5000 });
//# sourceMappingURL=get-post.js.map