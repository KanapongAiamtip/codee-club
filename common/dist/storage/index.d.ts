import firebase from 'firebase/app';
import { CodeeContext } from '../context';
import { Dao } from '../dao';
declare type Storage = firebase.storage.Storage;
export declare class StorageDao {
    private readonly context;
    private readonly dao;
    private readonly storage;
    private readonly storageBucket;
    constructor(context: CodeeContext, dao: Dao, storage: Storage, storageBucket: string);
    updateAvatar(userId: string, data: File): Promise<void>;
    createSubmission(courseId: string, activityId: string, problemId: string, userId: string, files: File[], language: string): Promise<string | {
        error: string;
    }>;
}
export {};
//# sourceMappingURL=index.d.ts.map