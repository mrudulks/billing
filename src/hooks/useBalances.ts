import { useLiveQuery } from 'dexie-react-hooks'
import { getBalances } from '../db/balances'

export function useBalances() {
  return useLiveQuery(getBalances, [])
}
