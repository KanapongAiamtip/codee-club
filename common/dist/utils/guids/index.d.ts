import firebaseClient from 'firebase/app';
import firebaseAdmin from 'firebase-admin';
declare type FirestoreAdmin = firebaseAdmin.firestore.Firestore;
declare type FirestoreClient = firebaseClient.firestore.Firestore;
export declare const GuidGen: (firestore: FirestoreClient | FirestoreAdmin) => (() => string);
export {};
//# sourceMappingURL=index.d.ts.map