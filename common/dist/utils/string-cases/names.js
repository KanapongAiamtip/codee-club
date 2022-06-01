"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixName = void 0;
const titlecase_1 = require("./titlecase");
const fixName = (nameToFix) => {
    const nameTitle = (0, titlecase_1.toTitleCase)(nameToFix.toLocaleLowerCase());
    const namePieces = nameTitle.split(' ');
    const nameFirst = namePieces.length > 0 ? namePieces[0] : '';
    const nameLast = namePieces.length > 1 ? namePieces[namePieces.length - 1] : '';
    const name = `${nameFirst} ${nameLast}`;
    return { name, nameFirst, nameLast };
};
exports.fixName = fixName;
//# sourceMappingURL=names.js.map