"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIncludeAny = void 0;
const toIncludeAny = (received, substrings) => substrings.some(value => received.includes(value))
    ? {
        message: () => `"${received}" should NOT include any of ${substrings.join(', ')}`,
        pass: true
    }
    : {
        message: () => `"${received}" should include any of ${substrings.join(', ')}`,
        pass: false
    };
exports.toIncludeAny = toIncludeAny;
//# sourceMappingURL=to-include-any.js.map