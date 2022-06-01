// TODO: Write the other 3 inequalities...
export const toHaveLengthLessOrEqual: jest.CustomMatcher = (received: string, maxLength: number) =>
  received.length <= maxLength
    ? {
        message: () => `"${received}" (${received.length} chars) should NOT be ≤ ${maxLength} chars`,
        pass: true
      }
    : {
        message: () => `"${received}" (${received.length} chars) should be ≤ ${maxLength} chars`,
        pass: false
      }
