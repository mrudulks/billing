import { useLiveQuery } from 'dexie-react-hooks'
import { listItems } from '../db/items'

export function useItems() {
  return useLiveQuery(listItems, [])
}
