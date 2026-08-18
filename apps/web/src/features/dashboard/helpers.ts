export function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || 'there'
}

export function formatCompactCurrency(value: number) {
  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)
  if (abs === 0) return 'US$0'
  if (abs >= 1_000_000_000) {
    const billions = abs / 1_000_000_000
    const digits = billions >= 10 || Number.isInteger(billions) ? 0 : 1
    return `${sign}US$${billions.toFixed(digits)}B`
  }
  if (abs >= 1_000_000) {
    const millions = abs / 1_000_000
    const digits = millions >= 10 || Number.isInteger(millions) ? 0 : 1
    return `${sign}US$${millions.toFixed(digits)}M`
  }
  if (abs >= 1_000) {
    return `${sign}US$${Math.round(abs / 1_000)}k`
  }
  return `${sign}US$${Math.round(abs)}`
}

export function formatPercent(rate: number) {
  return `${Math.round(rate * 100)}%`
}

export function humanizeToken(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
