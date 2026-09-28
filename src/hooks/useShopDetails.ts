import { useLiveQuery } from 'dexie-react-hooks'
import { getShopDetails } from '../db/settings'

export function useShopDetails() {
  return useLiveQuery(getShopDetails, [])
}
