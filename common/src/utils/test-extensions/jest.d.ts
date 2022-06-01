declare module jest {
  interface Matchers<R, T> {
    toHaveLengthLessOrEqual: (maxLength: number) => T extends string ? R : never
    toIncludeAny: (substrings: string[]) => T extends string ? R : never
  }
}
