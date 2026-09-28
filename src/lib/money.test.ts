import { describe, expect, it } from 'vitest'
import { formatRupees, rupeesToPaise } from './money'

describe('formatRupees', () => {
  it('uses Indian digit grouping and hides .00', () => {
    expect(formatRupees(12500000)).toBe('₹1,25,000')
    expect(formatRupees(0)).toBe('₹0')
    expect(formatRupees(1000)).toBe('₹10')
  })

  it('shows paise when present', () => {
    expect(formatRupees(1250)).toBe('₹12.50')
    expect(formatRupees(5)).toBe('₹0.05')
  })

  it('never shows floating point noise', () => {
    // 0.1 + 0.2 rupees, summed in paise
    expect(formatRupees(10 + 20)).toBe('₹0.30')
  })

  it('handles negatives', () => {
    expect(formatRupees(-50000)).toBe('-₹500')
  })
})

describe('rupeesToPaise', () => {
  it('parses whole and decimal rupees', () => {
    expect(rupeesToPaise('12')).toBe(1200)
    expect(rupeesToPaise('12.5')).toBe(1250)
    expect(rupeesToPaise('12.50')).toBe(1250)
    expect(rupeesToPaise('.5')).toBe(50)
    expect(rupeesToPaise(0.29)).toBe(29)
    expect(rupeesToPaise(1.15)).toBe(115)
  })

  it('ignores ₹, commas and spaces', () => {
    expect(rupeesToPaise('₹ 1,25,000')).toBe(12500000)
  })

  it('rejects bad input', () => {
    expect(rupeesToPaise('')).toBeNull()
    expect(rupeesToPaise('abc')).toBeNull()
    expect(rupeesToPaise('1.234')).toBeNull()
    expect(rupeesToPaise('.')).toBeNull()
  })
})
