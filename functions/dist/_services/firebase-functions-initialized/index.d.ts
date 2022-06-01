import * as functions from 'firebase-functions';
interface FunctionsConfig {
    auth: {
        clientId: string;
        clientSecret: string;
        scopes: string;
        baseUrl: string;
    };
    project: {
        region: string;
    };
}
export declare const config: FunctionsConfig;
declare const _default: functions.FunctionBuilder;
export default _default;
//# sourceMappingURL=index.d.ts.map