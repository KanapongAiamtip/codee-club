export type HttpsCallable<In, Out> = (data: In) => Promise<{ readonly data: Out }>

export const urlRequestId = 'authNUConnectURL'
interface UrlRequestBody { redirectUri: string }
export type UrlRequestCallable = HttpsCallable<UrlRequestBody, string>

export const tokenRequestId = 'authNUConnectToken'
interface TokenRequestBody { authCode: string, redirectUri: string }
type TokenResponseBody = string | { error: string } // TODO: Maybe return an object not a string
export type TokenRequestCallable = HttpsCallable<TokenRequestBody, TokenResponseBody>

export const courseUserImportId = 'courseUserImport'
interface CourseUserImportRequestBody { courseId: string, sectionId: string, users: Array<{ code: string, nameFirst: string, nameLast: string, email: string }> }
type CourseUserImportResponseBody = Array<string | { error: string }>
export type CourseUserImportCallable = HttpsCallable<CourseUserImportRequestBody, CourseUserImportResponseBody>
