import type { CleanCustomer } from '../lib/customerValidation'
import { db } from './db'
import type { Customer } from './types'

export async function listCustomers(): Promise<Customer[]> {
  const customers = await db.customers.toArray()
  return customers.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
}

/** Resolves to null when the customer does not exist (undefined means still loading in hooks). */
export async function getCustomer(id: number): Promise<Customer | null> {
  return (await db.customers.get(id)) ?? null
}

export function addCustomer(customer: CleanCustomer): Promise<number> {
  return db.customers.add({ ...customer, createdAt: new Date().toISOString() })
}

export async function updateCustomer(id: number, customer: CleanCustomer): Promise<void> {
  // Undefined fields are removed by Dexie, so clearing a phone number works.
  await db.customers.update(id, {
    name: customer.name,
    phone: customer.phone,
    address: customer.address,
    notes: customer.notes,
  })
}

export interface CustomerRecordCounts {
  entries: number
  bills: number
  payments: number
}

export async function countCustomerRecords(customerId: number): Promise<CustomerRecordCounts> {
  const [entries, bills, payments] = await Promise.all([
    db.entries.where('customerId').equals(customerId).count(),
    db.bills.where('customerId').equals(customerId).count(),
    db.payments.where('customerId').equals(customerId).count(),
  ])
  return { entries, bills, payments }
}

/** Deletes the customer and everything recorded for them, in one transaction. */
export async function deleteCustomer(customerId: number): Promise<void> {
  await db.transaction('rw', [db.customers, db.entries, db.bills, db.payments, db.customerPrices], async () => {
    await db.entries.where('customerId').equals(customerId).delete()
    await db.bills.where('customerId').equals(customerId).delete()
    await db.payments.where('customerId').equals(customerId).delete()
    await db.customerPrices.where('customerId').equals(customerId).delete()
    await db.customers.delete(customerId)
  })
}
