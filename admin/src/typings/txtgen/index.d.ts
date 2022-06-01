declare module 'txtgen' {
  export function sentence(): string
  export function paragraph(sentenceCount: number): string
  export function article(paragraphCount: number): string
}
