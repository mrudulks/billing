import { describe, expect, it } from 'vitest'
import { balancesByCustomer } from './balance'
import { validateCustomer } from './customerValidation'
import { validateItem } from './itemValidation'
import { isValidPhone } from './phone'

describe('isValidPhone', () => {
  it('accepts empty, 10 digits and country codes', () => {
    expect(isValidPhone('')).toBe(true)
    expect(isValidPhone('98470 12345')).toBe(true)
    expect(isValidPhone('+91 98470-12345')).toBe(true)
  })

  it('rejects short or non-numeric', () => {
    expect(isValidPhone('12345')).toBe(false)
    expect(isValidPhone('phone')).toBe(false)
  })
})

describe('validateCustomer', () => {
  const base = { name: '', phone: '', address: '', notes: '' }

  it('requires a name', () => {
    expect(validateCustomer({ ...base, name: '   ' })).toEqual({
      ok: false,
      errors: { name: 'Enter the customer name' },
    })
  })

  it('trims and drops empty optional fields', () => {
    expect(validateCustomer({ ...base, name: '  Hotel   Park ', phone: '98470 12345', notes: ' ' })).toEqual({
      ok: true,
      value: { name: 'Hotel Park', phone: '9847012345', address: undefined, notes: undefined },
    })
  })
})

describe('validateItem', () => {
  it('converts price to paise', () => {
    expect(validateItem({ name: 'Tea', price: '12.50' }, [])).toEqual({
      ok: true,
      value: { name: 'Tea', defaultPrice: 1250 },
    })
  })

  it('rejects duplicate names ignoring case', () => {
    const result = validateItem({ name: 'tea', price: '10' }, ['Tea'])
    expect(result.ok).toBe(false)
  })

  it('rejects missing or zero price', () => {
    expect(validateItem({ name: 'Tea', price: '' }, []).ok).toBe(false)
    expect(validateItem({ name: 'Tea', price: '0' }, []).ok).toBe(false)
  })
})

describe('balancesByCustomer', () => {
  it('subtracts payments from bill totals', () => {
    const balances = balancesByCustomer(
      [
        { customerId: 1, total: 50000 },
        { customerId: 1, total: 25050 },
        { customerId: 2, total: 1000 },
      ],
      [{ customerId: 1, amount: 50000 }],
    )
    expect(balances.get(1)).toBe(25050)
    expect(balances.get(2)).toBe(1000)
    expect(balances.get(3)).toBeUndefined()
  })
})
