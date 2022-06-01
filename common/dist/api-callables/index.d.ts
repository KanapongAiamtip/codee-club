export declare type HttpsCallable<In, Out> = (data: In) => Promise<{
    readonly data: Out;
}>;
export declare const urlRequestId = "authNUConnectURL";
interface UrlRequestBody {
    redirectUri: string;
}
export declare type UrlRequestCallable = HttpsCallable<UrlRequestBody, string>;
export declare const tokenRequestId = "authNUConnectToken";
interface TokenRequestBody {
    authCode: string;
    redirectUri: string;
}
declare type TokenResponseBody = string | {
    error: string;
};
export declare type TokenRequestCallable = HttpsCallable<TokenRequestBody, TokenResponseBody>;
export declare const courseUserImportId = "courseUserImport";
interface CourseUserImportRequestBody {
    courseId: string;
    sectionId: string;
    users: Array<{
        code: string;
        nameFirst: string;
        nameLast: string;
        email: string;
    }>;
}
declare type CourseUserImportResponseBody = Array<string | {
    error: string;
}>;
export declare type CourseUserImportCallable = HttpsCallable<CourseUserImportRequestBody, CourseUserImportResponseBody>;
export {};
//# sourceMappingURL=index.d.ts.map