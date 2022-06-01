"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortscale = exports.round = void 0;
function round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
exports.round = round;
const shortscaleSymbols = ['k', 'M', 'B', 'T']
    .map((val, idx) => [Math.pow(1000, idx + 1), val])
    .reverse();
const shortscale = (value, minRaw = 1, precision = 1) => {
    const minRawFixed = minRaw <= 0 ? 1 : minRaw;
    const precisionFactor = Math.pow(10, precision);
    for (const shortscaleSymbol of shortscaleSymbols) {
        const product = value / shortscaleSymbol[0];
        if (product > minRawFixed)
            return `${(Math.round(product * precisionFactor) / precisionFactor).toLocaleString()}${shortscaleSymbol[1]}`;
    }
    return value.toLocaleString();
};
exports.shortscale = shortscale;
//# sourceMappingURL=index.js.map