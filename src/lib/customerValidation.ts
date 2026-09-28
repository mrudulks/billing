import { cleanPhone, isValidPhone, PHONE_ERROR } from './phone'

export interface CustomerFormValues {
  name: string
  phone: string
  address: string
  notes: string
}

export interface CleanCustomer {
  name: string
  phone?: string
  address?: string
  notes?: string
}

export type CustomerErrors = Partial<Record<'name' | 'phone', string>>

export type CustomerValidation = { ok: true; value: CleanCustomer } | { ok: false; errors: CustomerErrors }

const optional = (text: string) => text.trim() || undefined

export function validateCustomer(values: CustomerFormValues): CustomerValidation {
  const errors: CustomerErrors = {}
  const name = values.name.trim().replace(/\s+/g, ' ')
  if (!name) errors.name = 'Enter the customer name'
  if (!isValidPhone(values.phone)) errors.phone = PHONE_ERROR
  if (errors.name || errors.phone) return { ok: false, errors }

  return {
    ok: true,
    value: {
      name,
      phone: optional(cleanPhone(values.phone)),
      address: optional(values.address),
      notes: optional(values.notes),
    },
  }
}
