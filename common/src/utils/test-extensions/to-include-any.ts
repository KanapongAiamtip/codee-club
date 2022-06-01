export const toIncludeAny: jest.CustomMatcher = (received: string, substrings: string[]) =>
  substrings.some(value => received.includes(value))
    ? {
        message: () => `"${received}" should NOT include any of ${substrings.join(', ')}`,
        pass: true
      }
    : {
        message: () => `"${received}" should include any of ${substrings.join(', ')}`,
        pass: false
      }
