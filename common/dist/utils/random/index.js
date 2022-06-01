"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomElement = exports.randomBool = exports.randomIntBetween = exports.randomIntBelow = void 0;
function randomIntBelow(max) {
    const min = 0;
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);
    return Math.floor(Math.random() * (maxInt - minInt)) + minInt;
}
exports.randomIntBelow = randomIntBelow;
function randomIntBetween(min, max) {
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);
    return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}
exports.randomIntBetween = randomIntBetween;
function randomBool(percentTrue = 50) {
    const percentInt = Math.floor(percentTrue);
    return randomIntBetween(1, 100) <= percentInt;
}
exports.randomBool = randomBool;
function randomElement(array) {
    return array[randomIntBelow(array.length)];
}
exports.randomElement = randomElement;
//# sourceMappingURL=index.js.map