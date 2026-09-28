import { useLiveQuery } from 'dexie-react-hooks'
import { findOlderUnbilled, listUnbilledEntries, nextUnbilledStart } from '../db/bills'

/** Everything the Bills tab needs to preview a bill before saving it. */
export function useBillDraft(customerId: number | undefined, fromDate: string, toDate: string) {
  return useLiveQuery(async () => {
    if (customerId === undefined) return null
    const [entries, older, sinceLastBill] = await Promise.all([
      listUnbilledEntries(customerId, fromDate, toDate),
      findOlderUnbilled(customerId, fromDate),
      nextUnbilledStart(customerId),
    ])
    return { entries, older, sinceLastBill }
  }, [customerId, fromDate, toDate])
}
