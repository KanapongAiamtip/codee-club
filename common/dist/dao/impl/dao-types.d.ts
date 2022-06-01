import firebase from 'firebase/app';
import admin from 'firebase-admin';
import { OptionalKeys, Primitive, WritableKeys } from 'ts-essentials';
declare type FieldValue = firebase.firestore.FieldValue;
declare type FieldValueAdmin = admin.firestore.FieldValue;
declare type Timestamp = firebase.firestore.Timestamp;
declare type NewBase<T> = {
    [P in keyof T]: T[P] extends Timestamp ? Timestamp | FieldValue | FieldValueAdmin : T[P] extends Array<infer U> | undefined ? Array<NewBase<U>> : T[P] extends Primitive | undefined ? T[P] : NewBase<T[P]>;
};
export declare type Defaults<T> = Required<Pick<NewBase<T>, OptionalKeys<T>>>;
export declare type Calculated<T> = Required<Pick<NewBase<T>, Exclude<Exclude<keyof T, WritableKeys<T>>, OptionalKeys<T>>>>;
export declare type New<T> = Pick<NewBase<T>, WritableKeys<T>>;
export declare type NewWithDefaults<T> = Defaults<T> & New<T>;
export declare type NewComplete<T> = Defaults<T> & New<T> & Calculated<T>;
declare type UpdateBase<T> = {
    [P in keyof T]: T[P] extends Timestamp | undefined ? Timestamp | FieldValue | FieldValueAdmin : T[P] extends Array<infer U> | undefined ? Array<UpdateBase<U>> | FieldValue | FieldValueAdmin : T[P] extends number ? number | undefined | FieldValue | FieldValueAdmin : T[P] extends Primitive | undefined ? T[P] : UpdateBase<T[P]>;
};
export declare type Update<T> = Partial<Pick<UpdateBase<T>, WritableKeys<T>>>;
export declare type UpdateComplete<T> = Partial<UpdateBase<T>>;
export {};
//# sourceMappingURL=dao-types.d.ts.map