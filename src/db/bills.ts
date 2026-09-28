import Dexie from 'dexie'
import { billTotal, previousBalance } from '../lib/bills'
import { addDays } from '../lib/dates'
import { db } from './db'
import { takeNextBillNumber } from './settings'
import type { Bill, Customer, Entry } from './types'

/** Customer's entries from `fromDate` to `toDate` (both included) that are not on any bill. */
export async function listUnbilledEntries(customerId: number, fromDate: string, toDate: string): Promise<Entry[]> {
  const entries = await db.entries
    .where('[customerId+date]')
    .between([customerId, fromDate], [customerId, toDate], true, true)
    .toArray()
  return entries.filter((e) => e.billId === undefined)
}

export interface OlderUnbilled {
  count: number
  earliestDate?: string
}

/** Unbilled entries before `fromDate`, so old deliveries are not forgotten. */
export async function findOlderUnbilled(customerId: number, fromDate: string): Promise<OlderUnbilled> {
  const entries = await db.entries
    .where('[customerId+date]')
    .between([customerId, Dexie.minKey], [customerId, fromDate], true, false)
    .filter((e) => e.billId === undefined)
    .toArray()
  const earliestDate = entries.reduce<string | undefined>((min, e) => (!min || e.date < min ? e.date : min), undefined)
  return { count: entries.length, earliestDate }
}

export class NothingToBillError extends Error {
  constructor() {
    super('No unbilled entries in these dates')
  }
}

/** Creates the bill and marks its entries, all or nothing. Returns the new bill id. */
export function saveBill(customerId: number, fromDate: string, toDate: string): Promise<number> {
  return db.transaction('rw', [db.bills, db.entries, db.settings], async () => {
    const entries = await listUnbilledEntries(customerId, fromDate, toDate)
    if (entries.length === 0) throw new NothingToBillError()
    const number = await takeNextBillNumber()
    const id = await db.bills.add({
      number,
      customerId,
      fromDate,
      toDate,
      total: billTotal(entries),
      createdAt: new Date().toISOString(),
    })
    await db.entries.bulkUpdate(entries.map((e) => ({ key: e.id, changes: { billId: id } })))
    return id
  })
}

/** Deletes the bill; its entries become unbilled again so nothing is lost. */
export async function deleteBill(billId: number): Promise<void> {
  await db.transaction('rw', [db.bills, db.entries], async () => {
    await db.entries
      .where('billId')
      .equals(billId)
      .modify((entry) => {
        delete entry.billId
      })
    await db.bills.delete(billId)
  })
}

export async function listBills(): Promise<Bill[]> {
  return db.bills.orderBy('number').reverse().toArray()
}

export async function listCustomerBills(customerId: number): Promise<Bill[]> {
  const bills = await db.bills.where('customerId').equals(customerId).toArray()
  return bills.sort((a, b) => b.number - a.number)
}

/** Day after the customer's latest bill ended, for "Since last bill". */
export async function nextUnbilledStart(customerId: number): Promise<string | undefined> {
  const bills = await db.bills.where('customerId').equals(customerId).toArray()
  const lastTo = bills.reduce<string | undefined>((max, b) => (!max || b.toDate > max ? b.toDate : max), undefined)
  return lastTo ? addDays(lastTo, 1) : undefined
}

export interface BillDetails {
  bill: Bill
  customer: Customer | undefined
  entries: Entry[]
  previous: number
}

export async function getBillDetails(billId: number): Promise<BillDetails | null> {
  const bill = await db.bills.get(billId)
  if (!bill) return null
  const [customer, entries, customerBills, payments] = await Promise.all([
    db.customers.get(bill.customerId),
    db.entries.where('billId').equals(billId).toArray(),
    db.bills.where('customerId').equals(bill.customerId).toArray(),
    db.payments.where('customerId').equals(bill.customerId).toArray(),
  ])
  return { bill, customer, entries, previous: previousBalance(bill, customerBills, payments) }
}
