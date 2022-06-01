import firebaseClient from 'firebase/app';
import firebaseAdmin from 'firebase-admin';
declare type AuthAdmin = firebaseAdmin.auth.Auth;
declare type FirestoreAdmin = firebaseAdmin.firestore.Firestore;
declare type FieldValueAdmin = typeof firebaseAdmin.firestore.FieldValue;
declare type AuthClient = firebaseClient.auth.Auth;
declare type FirestoreClient = firebaseClient.firestore.Firestore;
declare type FieldValueClient = typeof firebaseClient.firestore.FieldValue;
export declare class CodeeContext {
    readonly auth: AuthClient;
    readonly db: FirestoreClient;
    readonly FieldValue: FieldValueClient;
    readonly getGuid: () => string;
    constructor(auth: AuthAdmin | AuthClient, firestore: FirestoreAdmin | FirestoreClient, fieldValue: FieldValueAdmin | FieldValueClient);
}
export {};
//# sourceMappingURL=index.d.ts.map