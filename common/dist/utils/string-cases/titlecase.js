"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTitleCase = void 0;
const toTitleCase = (input) => input.replace(/(^|\s|-)\S/g, (t) => t.toUpperCase());
exports.toTitleCase = toTitleCase;
//# sourceMappingURL=titlecase.js.map