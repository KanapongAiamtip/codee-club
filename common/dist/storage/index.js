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
exports.StorageDao = void 0;
const schema_1 = require("./schema");
class StorageDao {
    constructor(context, dao, storage, storageBucket) {
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: context
        });
        Object.defineProperty(this, "dao", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: dao
        });
        Object.defineProperty(this, "storage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: storage
        });
        Object.defineProperty(this, "storageBucket", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: storageBucket
        });
    }
    updateAvatar(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const avatarUrl = yield this.storage
                .ref(schema_1.AVATARS)
                .child(userId)
                .put(data)
                .then((task) => __awaiter(this, void 0, void 0, function* () {
                return yield task.ref.getDownloadURL();
            }));
            return yield this.dao.updateAvatar(userId, avatarUrl);
        });
    }
    createSubmission(courseId, activityId, problemId, userId, files, language) {
        return __awaiter(this, void 0, void 0, function* () {
            const randomElement = this.context.getGuid();
            const folderPath = `${schema_1.SUBMISSIONS}/${activityId}/${problemId}/${userId}/${randomElement}`;
            let fileRefs;
            try {
                const promises = files.map((file) => __awaiter(this, void 0, void 0, function* () {
                    const path = `${folderPath}/${file.name}`;
                    return yield this.storage.ref(path).put(file)
                        .then(() => `gs://${this.storageBucket}/${path}`);
                }));
                fileRefs = yield Promise.all(promises);
            }
            catch (error) {
                console.error(error);
                return { error: 'Upload failed' };
            }
            const problemResult = {
                problemId,
                language,
                fileRefs
            };
            return yield this.dao.createSubmission(courseId, activityId, userId, problemResult);
        });
    }
}
exports.StorageDao = StorageDao;
//# sourceMappingURL=index.js.map