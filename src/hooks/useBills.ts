import { useLiveQuery } from 'dexie-react-hooks'
import { listBills, listCustomerBills } from '../db/bills'

/** All bills, or only one customer's when `customerId` is given. Newest first. */
export function useBills(customerId?: number) {
  return useLiveQuery(() => (customerId === undefined ? listBills() : listCustomerBills(customerId)), [customerId])
}
