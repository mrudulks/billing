const wholeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const paiseFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Format integer paise as rupees, e.g. 12500000 → "₹1,25,000", 1250 → "₹12.50". */
export function formatRupees(paise: number): string {
  const p = Math.round(paise)
  const formatter = p % 100 === 0 ? wholeFormatter : paiseFormatter
  return formatter.format(p / 100)
}

/**
 * Parse a rupee amount typed by the user into integer paise.
 * Accepts "12", "12.5", "12.50", "1,250", "₹ 1,250". Returns null if invalid
 * or if it has more than 2 decimal places.
 */
export function rupeesToPaise(input: string | number): number | null {
  const text = String(input).replace(/[₹,\s]/g, '')
  const match = /^(-?)(\d*)(?:\.(\d{0,2}))?$/.exec(text)
  if (!match || (match[2] === '' && !match[3])) return null
  const [, sign, whole, fraction = ''] = match
  const paise = Number(whole || '0') * 100 + Number(fraction.padEnd(2, '0'))
  return sign === '-' ? -paise : paise
}
