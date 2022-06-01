export interface RegLanguage {
    name: string;
    version: string;
    path: string;
}
export interface RegResponseBody {
    languages: RegLanguage[];
}
export interface TestInputs {
    [textId: string]: string;
}
export interface TestRequestBody {
    inputs: TestInputs;
    sourceRefs: string[];
}
export interface TestOutputs {
    [testId: string]: {
        output: string;
        error?: string;
    };
}
export interface TestResponseBody {
    outputs: TestOutputs;
}
//# sourceMappingURL=index.d.ts.map