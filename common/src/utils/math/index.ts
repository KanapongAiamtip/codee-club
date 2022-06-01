export function round(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

const shortscaleSymbols = ['k', 'M', 'B', 'T']
  .map((val, idx) => [Math.pow(1000, idx + 1), val] as [number, string])
  .reverse()

export const shortscale = (value: number, minRaw = 1, precision = 1): string => {
  const minRawFixed = minRaw <= 0 ? 1 : minRaw
  const precisionFactor = Math.pow(10, precision)

  for (const shortscaleSymbol of shortscaleSymbols) {
    const product = value / shortscaleSymbol[0]
    if (product > minRawFixed) return `${(Math.round(product * precisionFactor) / precisionFactor).toLocaleString()}${shortscaleSymbol[1]}`
  }
  return value.toLocaleString()
}
