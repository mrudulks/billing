import { describe, expect, it } from 'vitest'
import type { Entry } from '../db/types'
import { billShareText, billTotal, dayRows, formatBillNumber, previousBalance, summariseItems, whatsappPhone } from './bills'

const entry = (id: number, date: string, itemName: string, qty: number, unitPrice: number): Entry => ({
  id,
  customerId: 1,
  date,
  itemId: itemName === 'Tea' ? 1 : 2,
  itemName,
  unitPrice,
  qty,
})

const entries = [
  entry(1, '2026-09-20', 'Tea', 5, 1200),
  entry(2, '2026-09-20', 'Vada', 2, 1550),
  entry(3, '2026-09-21', 'Tea', 3, 1200),
  entry(4, '2026-09-22', 'Tea', 4, 1300), // price went up
  entry(5, '2026-09-21', 'Tea', 1, 1200), // second delivery same day
]

describe('summariseItems', () => {
  it('groups by item and price', () => {
    expect(summariseItems(entries)).toEqual([
      { itemName: 'Tea', unitPrice: 1200, qty: 9, amount: 10800 },
      { itemName: 'Tea', unitPrice: 1300, qty: 4, amount: 5200 },
      { itemName: 'Vada', unitPrice: 1550, qty: 2, amount: 3100 },
    ])
  })
})

describe('dayRows', () => {
  it('lists days oldest first, adding repeats within a day', () => {
    const rows = dayRows(entries)
    expect(rows.map((r) => r.date)).toEqual(['2026-09-20', '2026-09-21', '2026-09-22'])
    expect(rows[0]).toEqual({
      date: '2026-09-20',
      items: [
        { itemName: 'Tea', qty: 5 },
        { itemName: 'Vada', qty: 2 },
      ],
      total: 9100,
    })
    expect(rows[1].items).toEqual([{ itemName: 'Tea', qty: 4 }])
  })
})

describe('billTotal', () => {
  it('matches the item summary total', () => {
    expect(billTotal(entries)).toBe(10800 + 5200 + 3100)
  })
})

describe('previousBalance', () => {
  const bill = { customerId: 1, number: 3, createdAt: new Date(2026, 8, 28, 10).toISOString() }

  it('adds earlier bills of the same customer and subtracts payments up to the bill date', () => {
    const bills = [
      { customerId: 1, number: 1, total: 50000 },
      { customerId: 2, number: 2, total: 99900 },
      { customerId: 1, number: 3, total: 30000 },
      { customerId: 1, number: 4, total: 10000 },
    ]
    const payments = [
      { customerId: 1, date: '2026-09-27', amount: 20000 },
      { customerId: 1, date: '2026-09-29', amount: 30000 },
      { customerId: 2, date: '2026-09-01', amount: 99900 },
    ]
    expect(previousBalance(bill, bills, payments)).toBe(30000)
  })

  it('is zero for a first bill', () => {
    expect(previousBalance(bill, [], [])).toBe(0)
  })
})

describe('formatBillNumber', () => {
  it('pads to four digits', () => {
    expect(formatBillNumber(7)).toBe('0007')
    expect(formatBillNumber(12345)).toBe('12345')
  })
})

describe('whatsappPhone', () => {
  it('adds 91 to Indian 10-digit numbers', () => {
    expect(whatsappPhone('9847012345')).toBe('919847012345')
    expect(whatsappPhone('09847012345')).toBe('919847012345')
    expect(whatsappPhone('+91 98470 12345')).toBe('919847012345')
  })

  it('returns null when unusable', () => {
    expect(whatsappPhone(undefined)).toBeNull()
    expect(whatsappPhone('12345')).toBeNull()
  })
})

describe('billShareText', () => {
  it('builds a readable WhatsApp message', () => {
    const text = billShareText({
      shopName: 'Ravi Tea Stall',
      shopPhone: '9847000000',
      billNumber: 7,
      customerName: 'Hotel Park',
      fromDate: '2026-09-15',
      toDate: '2026-09-28',
      items: [{ itemName: 'Tea', unitPrice: 1200, qty: 25, amount: 30000 }],
      total: 30000,
      previous: 10000,
    })
    expect(text).toBe(
      [
        '*Ravi Tea Stall*',
        'Bill No. 0007',
        'Hotel Park',
        '15/09/2026 to 28/09/2026',
        '',
        'Tea: 25 × ₹12 = ₹300',
        '',
        'This bill: ₹300',
        'Previous balance: ₹100',
        '*Total due: ₹400*',
        '',
        'Thank you. 9847000000',
      ].join('\n'),
    )
  })
})
