interface UserIdentity {
    username: string;
    email: string;
    name: string;
}
interface Token {
    access_token: string;
}
export declare function authorizeUrl(redirectUri: string): string;
export declare function exchangeAuthCodeForToken(authCode: string, redirectUri: string): Promise<{
    body: {
        error: string;
    } | Token;
}>;
export declare function getUserIdentity(token: Token): Promise<UserIdentity>;
export {};
//# sourceMappingURL=nu-connect.d.ts.map