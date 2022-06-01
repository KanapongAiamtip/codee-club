"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleError = void 0;
const consoleError = (err, prefix) => {
    if (!(err instanceof Error))
        throw err;
    if (prefix)
        console.error(`${prefix}: ${err.message}`);
    else
        console.error(err.message);
};
exports.consoleError = consoleError;
//# sourceMappingURL=index.js.map