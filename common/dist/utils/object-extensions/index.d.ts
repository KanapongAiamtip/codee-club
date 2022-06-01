export declare function keys(obj: {
    [s: string]: unknown;
} | null | undefined): string[];
export declare function values<T>(obj: {
    [s: string]: T;
} | ArrayLike<T> | null | undefined): T[];
export declare function entries<T>(obj: {
    [s: string]: T;
} | ArrayLike<T> | null | undefined): Array<[string, T]>;
export declare function length<T>(obj: {
    [s: string]: T;
} | ArrayLike<T> | null | undefined): number;
export declare function valuesWithIds<U>(obj?: {
    [key: string]: U;
}): Array<U & {
    id: string;
}>;
export declare function valueWithId<U>(tuple: [string, U]): U & {
    id: string;
};
export declare function valueWithId<U>(tuple?: [string, U]): (U & {
    id: string;
}) | undefined;
//# sourceMappingURL=index.d.ts.map