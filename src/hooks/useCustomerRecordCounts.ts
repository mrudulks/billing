import { useLiveQuery } from 'dexie-react-hooks'
import { countCustomerRecords } from '../db/customers'

export function useCustomerRecordCounts(customerId: number) {
  return useLiveQuery(() => countCustomerRecords(customerId), [customerId])
}
