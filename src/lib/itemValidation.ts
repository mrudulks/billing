import { rupeesToPaise } from './money'

export interface ItemFormValues {
  name: string
  price: string
}

export interface CleanItem {
  name: string
  defaultPrice: number
}

export type ItemErrors = Partial<Record<'name' | 'price', string>>

export type ItemValidation = { ok: true; value: CleanItem } | { ok: false; errors: ItemErrors }

/** `otherNames` are the names of the other items, to stop duplicates. */
export function validateItem(values: ItemFormValues, otherNames: string[]): ItemValidation {
  const errors: ItemErrors = {}
  const name = values.name.trim().replace(/\s+/g, ' ')
  if (!name) {
    errors.name = 'Enter the item name'
  } else if (otherNames.some((other) => other.toLowerCase() === name.toLowerCase())) {
    errors.name = 'You already have an item with this name'
  }

  const price = rupeesToPaise(values.price)
  if (price === null || price <= 0) errors.price = 'Enter the price, like 10 or 12.50'

  if (errors.name || errors.price || price === null) return { ok: false, errors }
  return { ok: true, value: { name, defaultPrice: price } }
}
