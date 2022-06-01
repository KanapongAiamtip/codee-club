"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuidGen = void 0;
const GuidGen = (firestore) => {
    const db = firestore;
    return () => db.collection('guids').doc().id;
};
exports.GuidGen = GuidGen;
//# sourceMappingURL=index.js.map