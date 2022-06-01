import admin from 'firebase-admin';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
export default admin;
export declare const auth: admin.auth.Auth;
export declare const db: FirebaseFirestore.Firestore;
export declare const storage: admin.storage.Storage;
export declare const FieldValue: typeof FirebaseFirestore.FieldValue;
export declare const Timestamp: typeof FirebaseFirestore.Timestamp;
//# sourceMappingURL=index.d.ts.map