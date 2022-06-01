import firebase from 'firebase/app';
import moment from 'moment';
declare type Timestamp = firebase.firestore.Timestamp;
export declare type DateLike = Date | moment.Moment | Timestamp;
export declare function deadline(date?: DateLike): string;
export declare function fromNow(date?: DateLike): string;
export declare function fromNowShort(date?: DateLike): string;
export declare function logLong(date?: DateLike): string;
export declare function logShort(date?: DateLike): string;
export declare function monthYear(date?: DateLike): string;
export declare function notiTime(date?: DateLike): string;
export {};
//# sourceMappingURL=index.d.ts.map