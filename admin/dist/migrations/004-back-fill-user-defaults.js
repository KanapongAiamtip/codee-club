"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = void 0;
const dao_1 = require("@codee-club/common/dist/dao");
const defaults_1 = require("@codee-club/common/dist/dao/impl/defaults");
const up = (db) => __awaiter(void 0, void 0, void 0, function* () {
    yield fix(db, dao_1.USERS, defaults_1.userDefaults);
    yield fix(db, dao_1.USERS_PRIVATE, defaults_1.userPrivateDefaults);
});
exports.up = up;
const fix = (db, collection, defaults) => __awaiter(void 0, void 0, void 0, function* () {
    let batch = db.batch();
    let batchSize = 0;
    const snapshot = yield db.collection(collection).get();
    console.info('Fixing', collection, snapshot.size);
    for (const doc of snapshot.docs) {
        batch.set(db.collection(collection).doc(doc.id), Object.assign(Object.assign({}, defaults), doc.data()));
        batchSize++;
        if (batchSize === 450) {
            yield batch.commit();
            batch = db.batch();
            batchSize = 0;
        }
    }
    yield batch.commit();
    console.info('Fixing defaults', collection, 'DONE');
});
//# sourceMappingURL=004-back-fill-user-defaults.js.map