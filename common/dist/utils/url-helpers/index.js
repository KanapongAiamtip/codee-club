"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlify = void 0;
const urlify = (text) => {
    return text
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\da-z-]/g, '')
        .replace(/-+/g, '-');
};
exports.urlify = urlify;
//# sourceMappingURL=index.js.map