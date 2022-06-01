"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueWithId = exports.valuesWithIds = exports.length = exports.entries = exports.values = exports.keys = void 0;
function keys(obj) {
    return obj ? Object.keys(obj) : [];
}
exports.keys = keys;
function values(obj) {
    return obj ? Object.values(obj) : [];
}
exports.values = values;
function entries(obj) {
    return obj ? Object.entries(obj) : [];
}
exports.entries = entries;
function length(obj) {
    return obj ? Object.keys(obj).length : 0;
}
exports.length = length;
function valuesWithIds(obj) {
    return obj ? Object.entries(obj).map(([key, value]) => (Object.assign(Object.assign({}, value), { id: key }))) : [];
}
exports.valuesWithIds = valuesWithIds;
function valueWithId(tuple) {
    return tuple ? Object.assign(Object.assign({}, tuple[1]), { id: tuple[0] }) : undefined;
}
exports.valueWithId = valueWithId;
//# sourceMappingURL=index.js.map