import { useState } from 'react'
import type { Item } from '../db/types'
import { useItems } from '../hooks/useItems'
import { formatRupees } from '../lib/money'
import BottomSheet from './BottomSheet'
import Button from './Button'
import ItemForm from './ItemForm'

type Editing = { mode: 'closed' } | { mode: 'add' } | { mode: 'edit'; item: Item }

export default function ItemsSection() {
  const items = useItems()
  const [editing, setEditing] = useState<Editing>({ mode: 'closed' })

  if (!items) return null
  const shown = items.filter((item) => item.active === 1)
  const hidden = items.filter((item) => item.active === 0)
  const editingItem = editing.mode === 'edit' ? editing.item : undefined
  const otherNames = items.filter((item) => item.id !== editingItem?.id).map((item) => item.name)

  const row = (item: Item) => (
    <li key={item.id}>
      <button
        type="button"
        onClick={() => setEditing({ mode: 'edit', item })}
        className="flex min-h-16 w-full items-center justify-between gap-3 px-4 py-3 text-left active:bg-leaf-50"
      >
        <span className={`text-lg font-semibold ${item.active ? 'text-ink' : 'text-gray-500'}`}>{item.name}</span>
        <span className={`text-lg font-bold tabular-nums ${item.active ? 'text-ink' : 'text-gray-500'}`}>
          {formatRupees(item.defaultPrice)}
        </span>
      </button>
    </li>
  )

  return (
    <section aria-labelledby="items-heading">
      <div className="flex items-end justify-between px-4 pb-2">
        <h2 id="items-heading" className="text-xl font-bold text-ink">
          Items and prices
        </h2>
      </div>

      {items.length === 0 ? (
        <p className="px-4 pb-3 text-lg text-gray-700">Add the things you sell, like tea, coffee and snacks, with their price.</p>
      ) : (
        <ul className="divide-y divide-gray-200 border-y border-gray-200">{shown.map(row)}</ul>
      )}

      {hidden.length > 0 && (
        <>
          <h3 className="px-4 pb-1 pt-4 text-base font-semibold text-gray-600">Hidden from entry screen</h3>
          <ul className="divide-y divide-gray-200 border-y border-gray-200">{hidden.map(row)}</ul>
        </>
      )}

      <div className="px-4 pt-3">
        <Button variant="secondary" onClick={() => setEditing({ mode: 'add' })} className="w-full">
          Add item
        </Button>
      </div>

      <BottomSheet
        open={editing.mode !== 'closed'}
        title={editingItem ? 'Edit item' : 'New item'}
        onClose={() => setEditing({ mode: 'closed' })}
      >
        <ItemForm
          key={editingItem?.id ?? 'new'}
          item={editingItem}
          otherNames={otherNames}
          onDone={() => setEditing({ mode: 'closed' })}
        />
      </BottomSheet>
    </section>
  )
}
