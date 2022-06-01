"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const titlecase_1 = require("./titlecase");
test('can title a lower case string', () => {
    expect((0, titlecase_1.toTitleCase)('old mac donald had a farm')).toBe('Old Mac Donald Had A Farm');
});
test('can title a string with intermediate upper case letters', () => {
    expect((0, titlecase_1.toTitleCase)('old macDonald had a farm')).toBe('Old MacDonald Had A Farm');
});
test('can title a string with upper case words', () => {
    expect((0, titlecase_1.toTitleCase)('old mac donald had a FARM')).toBe('Old Mac Donald Had A FARM');
});
//# sourceMappingURL=titlecase.test.js.map