"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelize = exports.snakeize = exports.camelToSnake = exports.snakeToCamel = void 0;
const object_extensions_1 = require("../object-extensions");
const snakeToCamel = function (data, depth) {
    if (isObject(data)) {
        if (typeof depth === 'undefined') {
            depth = 1;
        }
        return processKeys(data, camelize, depth);
    }
    else {
        return camelize(data);
    }
};
exports.snakeToCamel = snakeToCamel;
const camelToSnake = function (data, depth) {
    if (isObject(data)) {
        if (typeof depth === 'undefined') {
            depth = 1;
        }
        return processKeys(data, snakeize, depth);
    }
    else {
        return snakeize(data);
    }
};
exports.camelToSnake = camelToSnake;
function snakeize(key) {
    const separator = '_';
    const split = /(?=[A-Z])/;
    return key.split(split).join(separator).toLowerCase();
}
exports.snakeize = snakeize;
function camelize(key) {
    if (typeof key === 'number') {
        return key;
    }
    key = key.replace(/[\s_-]+(.)?/g, function (_match, ch) {
        return ch ? ch.toUpperCase() : '';
    });
    return key.slice(0, 1).toLowerCase() + key.slice(1);
}
exports.camelize = camelize;
function processKeys(obj, processer, depth) {
    if (depth === 0 || !isObject(obj)) {
        return obj;
    }
    const result = {};
    for (const key of (0, object_extensions_1.keys)(obj)) {
        result[processer(key)] = processKeys(obj[key], processer, depth - 1);
    }
    return result;
}
function isObject(x) {
    return (typeof x === 'object' || typeof x === 'function') && x !== null;
}
//# sourceMappingURL=camel-snake.js.map