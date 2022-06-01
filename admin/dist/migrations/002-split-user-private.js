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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = void 0;
const dao_1 = require("@codee-club/common/dist/dao");
const firebase_admin_initialized_1 = __importDefault(require("~/firebase-admin-initialized"));
const BATCH_LIMIT = 450;
const up = (db) => __awaiter(void 0, void 0, void 0, function* () {
    const fv = firebase_admin_initialized_1.default.firestore.FieldValue;
    const refUsers = db.collection(dao_1.USERS);
    const refUsersPrivate = db.collection(dao_1.USERS_PRIVATE);
    const usersSnap = yield refUsers.get();
    const users = usersSnap.docs.map(doc => {
        return { id: doc.id, data: doc.data() };
    });
    let batch = db.batch();
    let writes = 0;
    for (const user of users) {
        if (writes >= BATCH_LIMIT) {
            yield batch.commit();
            batch = db.batch();
            writes = 0;
        }
        if ('email' in user.data || 'lastTokenNuConnect' in user.data) {
            const data = {};
            if (user.data.email)
                data.email = user.data.email;
            if (user.data.lastTokenNuConnect)
                data.nuConnectToken = user.data.lastTokenNuConnect;
            batch.set(refUsersPrivate.doc(user.id), data, { merge: true });
            batch.set(refUsers.doc(user.id), { email: fv.delete(), lastTokenNuConnect: fv.delete() }, { merge: true });
            writes += 2;
        }
    }
    if (writes > 0)
        yield batch.commit();
});
exports.up = up;
//# sourceMappingURL=002-split-user-private.js.map