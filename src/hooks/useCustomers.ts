import { useLiveQuery } from 'dexie-react-hooks'
import { listCustomers } from '../db/customers'

export function useCustomers() {
  return useLiveQuery(listCustomers, [])
}
