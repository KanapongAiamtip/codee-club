export declare const prop: <T>(name: keyof T & string) => keyof T & string;
export declare type FilterKeys<Base, PropType> = {
    [Key in keyof Base]-?: PropType extends Base[Key] ? Key : never;
}[keyof Base];
export declare type FilterProps<Base, PropType> = Pick<Base, FilterKeys<Base, PropType>>;
//# sourceMappingURL=index.d.ts.map