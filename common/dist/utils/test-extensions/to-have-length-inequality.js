"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHaveLengthLessOrEqual = void 0;
const toHaveLengthLessOrEqual = (received, maxLength) => received.length <= maxLength
    ? {
        message: () => `"${received}" (${received.length} chars) should NOT be ≤ ${maxLength} chars`,
        pass: true
    }
    : {
        message: () => `"${received}" (${received.length} chars) should be ≤ ${maxLength} chars`,
        pass: false
    };
exports.toHaveLengthLessOrEqual = toHaveLengthLessOrEqual;
//# sourceMappingURL=to-have-length-inequality.js.map