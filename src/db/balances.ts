import { balancesByCustomer } from '../lib/balance'
import { db } from './db'

export async function getBalances(): Promise<Map<number, number>> {
  const [bills, payments] = await Promise.all([db.bills.toArray(), db.payments.toArray()])
  return balancesByCustomer(bills, payments)
}
