import type { Bill, Entry, Payment } from '../db/types'
import { formatDisplayDate, toISODate } from './dates'
import { lineAmount } from './entries'
import { formatRupees } from './money'
import { cleanPhone } from './phone'

export interface ItemSummaryLine {
  itemName: string
  unitPrice: number
  qty: number
  amount: number
}

/** One line per item and price. The same item sold at two prices gets two lines. */
export function summariseItems(entries: Entry[]): ItemSummaryLine[] {
  const lines = new Map<string, ItemSummaryLine>()
  for (const entry of entries) {
    const key = `${entry.itemName}\u0000${entry.unitPrice}`
    const line = lines.get(key) ?? { itemName: entry.itemName, unitPrice: entry.unitPrice, qty: 0, amount: 0 }
    line.qty += entry.qty
    line.amount += lineAmount(entry.unitPrice, entry.qty)
    lines.set(key, line)
  }
  return [...lines.values()].sort(
    (a, b) => a.itemName.localeCompare(b.itemName, 'en', { sensitivity: 'base' }) || a.unitPrice - b.unitPrice,
  )
}

export interface DayRow {
  date: string
  /** e.g. [{ itemName: 'Tea', qty: 5 }, { itemName: 'Vada', qty: 2 }] */
  items: { itemName: string; qty: number }[]
  total: number
}

/** Oldest day first, as a bill is read. */
export function dayRows(entries: Entry[]): DayRow[] {
  const days = new Map<string, DayRow>()
  for (const entry of [...entries].sort((a, b) => a.id - b.id)) {
    const day = days.get(entry.date) ?? { date: entry.date, items: [], total: 0 }
    const item = day.items.find((i) => i.itemName === entry.itemName)
    if (item) item.qty += entry.qty
    else day.items.push({ itemName: entry.itemName, qty: entry.qty })
    day.total += lineAmount(entry.unitPrice, entry.qty)
    days.set(entry.date, day)
  }
  return [...days.values()].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
}

export function billTotal(entries: Entry[]): number {
  return entries.reduce((sum, e) => sum + lineAmount(e.unitPrice, e.qty), 0)
}

/** Local date the bill was made on. */
export function billDate(bill: Pick<Bill, 'createdAt'>): string {
  return toISODate(new Date(bill.createdAt))
}

/**
 * What the customer owed before this bill: their earlier bills minus payments made on or before the bill date.
 * Bill numbers only go up, so "earlier" means a smaller number.
 */
export function previousBalance(
  bill: Pick<Bill, 'customerId' | 'number' | 'createdAt'>,
  bills: Pick<Bill, 'customerId' | 'number' | 'total'>[],
  payments: Pick<Payment, 'customerId' | 'date' | 'amount'>[],
): number {
  const date = billDate(bill)
  const billed = bills
    .filter((b) => b.customerId === bill.customerId && b.number < bill.number)
    .reduce((sum, b) => sum + b.total, 0)
  const paid = payments
    .filter((p) => p.customerId === bill.customerId && p.date <= date)
    .reduce((sum, p) => sum + p.amount, 0)
  return billed - paid
}

export function formatBillNumber(n: number): string {
  return String(n).padStart(4, '0')
}

/**
 * Phone number in the form wa.me needs (country code, digits only), or null if it can't be used.
 * Indian 10-digit numbers get 91 in front.
 */
export function whatsappPhone(phone: string | undefined): string | null {
  if (!phone) return null
  const digits = cleanPhone(phone).replace(/^\+/, '')
  if (!/^\d+$/.test(digits)) return null
  if (digits.length === 10) return `91${digits}`
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`
  if (digits.length >= 11 && digits.length <= 13) return digits
  return null
}

export interface ShareTextInput {
  shopName: string
  shopPhone: string
  billNumber: number
  customerName: string
  fromDate: string
  toDate: string
  items: ItemSummaryLine[]
  total: number
  previous: number
}

/** Plain-text bill for WhatsApp. *text* shows as bold in WhatsApp. */
export function billShareText(input: ShareTextInput): string {
  const lines: string[] = []
  if (input.shopName) lines.push(`*${input.shopName}*`)
  lines.push(`Bill No. ${formatBillNumber(input.billNumber)}`)
  lines.push(input.customerName)
  lines.push(`${formatDisplayDate(input.fromDate)} to ${formatDisplayDate(input.toDate)}`)
  lines.push('')
  for (const item of input.items) {
    lines.push(`${item.itemName}: ${item.qty} × ${formatRupees(item.unitPrice)} = ${formatRupees(item.amount)}`)
  }
  lines.push('')
  lines.push(`This bill: ${formatRupees(input.total)}`)
  if (input.previous !== 0) {
    lines.push(`${input.previous > 0 ? 'Previous balance' : 'Advance paid'}: ${formatRupees(Math.abs(input.previous))}`)
  }
  lines.push(`*Total due: ${formatRupees(input.total + input.previous)}*`)
  if (input.shopPhone) {
    lines.push('')
    lines.push(`Thank you. ${input.shopPhone}`)
  }
  return lines.join('\n')
}
