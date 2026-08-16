const usdInteger = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

/** Strip everything except digits from a money input. */
export function parseUsdDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/** Format a digit string as US grouped dollars, e.g. `"3000000"` → `"3,000,000"`. */
export function formatUsdInteger(value: string): string {
  const digits = parseUsdDigits(value)
  if (digits === '') return ''
  return usdInteger.format(BigInt(digits))
}
