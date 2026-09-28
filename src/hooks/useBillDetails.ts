import { useLiveQuery } from 'dexie-react-hooks'
import { getBillDetails } from '../db/bills'

/** undefined while loading, null if the bill does not exist. */
export function useBillDetails(billId: number) {
  return useLiveQuery(() => getBillDetails(billId), [billId])
}
