import { useState, type FormEvent } from 'react'
import { addItem, deleteItemIfUnused, updateItem } from '../db/items'
import type { Item } from '../db/types'
import { validateItem, type ItemErrors } from '../lib/itemValidation'
import Button from './Button'
import ConfirmDialog from './ConfirmDialog'
import TextField from './TextField'

interface ItemFormProps {
  item?: Item
  otherNames: string[]
  onDone: () => void
}

const priceText = (paise: number) => (paise % 100 === 0 ? String(paise / 100) : (paise / 100).toFixed(2))

export default function ItemForm({ item, otherNames, onDone }: ItemFormProps) {
  const [name, setName] = useState(item?.name ?? '')
  const [price, setPrice] = useState(item ? priceText(item.defaultPrice) : '')
  const [active, setActive] = useState<0 | 1>(item?.active ?? 1)
  const [errors, setErrors] = useState<ItemErrors>({})
  const [message, setMessage] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const result = validateItem({ name, price }, otherNames)
    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    try {
      if (item) await updateItem(item.id, { ...result.value, active })
      else await addItem(result.value)
      onDone()
    } catch {
      setMessage('Could not save. Please try again.')
    }
  }

  async function handleDelete() {
    if (!item) return
    setConfirmDelete(false)
    const deleted = await deleteItemIfUnused(item.id)
    if (deleted) onDone()
    else setMessage('This item is in past entries, so it cannot be deleted. Turn off "Show on entry screen" to hide it instead.')
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <TextField
        label="Item name"
        value={name}
        onChange={(v) => {
          setName(v)
          setErrors((e) => ({ ...e, name: undefined }))
        }}
        error={errors.name}
        placeholder="e.g. Tea, Coffee, Vada"
        autoCapitalize="words"
        autoComplete="off"
        autoFocus={!item}
      />
      <TextField
        label="Price"
        prefix="₹"
        value={price}
        onChange={(v) => {
          setPrice(v)
          setErrors((e) => ({ ...e, price: undefined }))
        }}
        error={errors.price}
        hint={item ? 'A new price is used for new entries only. Old bills keep the old price.' : undefined}
        inputMode="decimal"
        autoComplete="off"
      />

      {item && (
        <label className="flex min-h-14 items-center justify-between gap-4 rounded-2xl bg-leaf-50 px-4 py-3">
          <span className="text-lg font-semibold">Show on entry screen</span>
          <input
            type="checkbox"
            checked={active === 1}
            onChange={(e) => setActive(e.target.checked ? 1 : 0)}
            className="h-7 w-7 accent-leaf-700"
          />
        </label>
      )}

      {message && <p className="text-lg font-semibold text-danger">{message}</p>}

      <Button type="submit" className="w-full">
        {item ? 'Save changes' : 'Save item'}
      </Button>

      {item && (
        <Button variant="danger" onClick={() => setConfirmDelete(true)} className="w-full">
          Delete item
        </Button>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete ${item?.name ?? 'item'}?`}
        confirmLabel="Delete item"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      >
        It will be removed from your item list.
      </ConfirmDialog>
    </form>
  )
}
