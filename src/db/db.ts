import Dexie, { type EntityTable } from 'dexie'
import type { Bill, Customer, CustomerPrice, Entry, Item, Payment, Setting } from './types'

class TeaDB extends Dexie {
  customers!: EntityTable<Customer, 'id'>
  items!: EntityTable<Item, 'id'>
  customerPrices!: EntityTable<CustomerPrice, 'id'>
  entries!: EntityTable<Entry, 'id'>
  bills!: EntityTable<Bill, 'id'>
  payments!: EntityTable<Payment, 'id'>
  settings!: EntityTable<Setting, 'key'>

  constructor() {
    super('tea-billing')
    this.version(1).stores({
      customers: '++id, name',
      items: '++id, name, active',
      customerPrices: '++id, &[customerId+itemId], customerId',
      entries: '++id, customerId, date, [customerId+date], billId',
      bills: '++id, &number, customerId',
      payments: '++id, customerId, date',
      settings: 'key',
    })
  }
}

export const db = new TeaDB()
