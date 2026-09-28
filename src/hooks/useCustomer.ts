import { useLiveQuery } from 'dexie-react-hooks'
import { getCustomer } from '../db/customers'

/** undefined while loading, null if not found. */
export function useCustomer(id: number) {
  return useLiveQuery(() => getCustomer(id), [id])
}
