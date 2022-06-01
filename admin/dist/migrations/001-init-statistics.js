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
const up = (db) => __awaiter(void 0, void 0, void 0, function* () {
    const statisticsRef = db.collection(dao_1.CONFIG).doc(dao_1.CONFIG_STATISTICS);
    return yield db.runTransaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const statistics = yield t.get(statisticsRef);
        if (!statistics.exists) {
            const emptyStatistics = {
                members: 0,
                submissionSuccesses: 0,
                submissionCompileFailures: 0,
                submissionTestFailures: 0
            };
            yield t.set(statisticsRef, emptyStatistics);
        }
    }));
});
exports.up = up;
//# sourceMappingURL=001-init-statistics.js.map