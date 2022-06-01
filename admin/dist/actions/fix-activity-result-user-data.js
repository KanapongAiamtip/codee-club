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
const dao_1 = require("@codee-club/common/dist/dao");
const firebase_admin_initialized_1 = require("~/firebase-admin-initialized");
const modes_1 = require("~/modes");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield modes_1.productionWarning(__filename);
    const allUsersPromise = firebase_admin_initialized_1.db.collection(dao_1.USERS).get();
    const allActivityResultsPromise = firebase_admin_initialized_1.db.collection(dao_1.ACTIVITY_RESULTS).get();
    const allUsers = (yield allUsersPromise).docs.map((doc) => {
        const { name, avatarUrl } = doc.data();
        return { id: doc.id, name, avatarUrl };
    });
    const allActivityResults = (yield allActivityResultsPromise).docs.map((doc) => {
        const { userId, userName, userAvatarUrl } = doc.data();
        return { id: doc.id, userId, userName, userAvatarUrl };
    });
    for (const user of allUsers) {
        yield firebase_admin_initialized_1.db.runTransaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            const userResults = allActivityResults.filter((ar) => ar.userId === user.id && (ar.userName !== user.name || ar.userAvatarUrl !== user.avatarUrl));
            yield Promise.all(userResults.map((ar) => {
                const update = { userName: user.name, userAvatarUrl: user.avatarUrl };
                return t.set(firebase_admin_initialized_1.db.collection(dao_1.ACTIVITY_RESULTS).doc(ar.id), update, { merge: true });
            }));
            if (userResults.length > 0)
                console.info(`Fixed ${userResults.length} ActivityResults for user ${user.id}`);
        }));
    }
    console.info('Complete');
});
main()
    .then(() => process.exit())
    .catch((error) => console.error(error));
//# sourceMappingURL=fix-activity-result-user-data.js.map