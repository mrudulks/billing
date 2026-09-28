import { useState, type FormEvent } from 'react'
import { validateCustomer, type CleanCustomer, type CustomerErrors, type CustomerFormValues } from '../lib/customerValidation'
import Button from './Button'
import TextField from './TextField'

const empty: CustomerFormValues = { name: '', phone: '', address: '', notes: '' }

interface CustomerFormProps {
  initial?: CustomerFormValues
  submitLabel: string
  onSubmit: (customer: CleanCustomer) => Promise<void>
}

export default function CustomerForm({ initial = empty, submitLabel, onSubmit }: CustomerFormProps) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState<CustomerErrors>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const set = (field: keyof CustomerFormValues) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }))
    if (field in errors) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const result = validateCustomer(values)
    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    setSaving(true)
    setSaveError('')
    try {
      await onSubmit(result.value)
    } catch {
      setSaveError('Could not save. Please try again.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 p-5">
      <TextField
        label="Name"
        value={values.name}
        onChange={set('name')}
        error={errors.name}
        placeholder="e.g. Hotel Park or Ramesh (bank)"
        autoCapitalize="words"
        autoComplete="off"
        autoFocus={!initial.name}
      />
      <TextField
        label="Phone (optional)"
        value={values.phone}
        onChange={set('phone')}
        error={errors.phone}
        hint="Used to send bills on WhatsApp"
        type="tel"
        inputMode="tel"
        autoComplete="off"
      />
      <TextField label="Address (optional)" value={values.address} onChange={set('address')} autoComplete="off" />
      <TextField label="Notes (optional)" value={values.notes} onChange={set('notes')} multiline />
      {saveError && <p className="text-lg font-semibold text-danger">{saveError}</p>}
      <Button type="submit" disabled={saving} className="w-full">
        {saving ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}
