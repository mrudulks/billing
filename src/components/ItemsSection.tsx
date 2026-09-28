import { useState } from 'react'
import type { Item } from '../db/types'
import { useItems } from '../hooks/useItems'
import { formatRupees } from '../lib/money'
import BottomSheet from './BottomSheet'
import Panel from './Panel'
import SectionHeading from './SectionHeading'
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
        className="flex min-h-16 w-full items-center justify-between gap-3 px-5 py-3 text-left active:bg-leaf-50"
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
      <SectionHeading id="items-heading" title="Items and prices" aside={items.length > 0 ? `${shown.length} on entry screen` : undefined} />
      <Panel>
        {items.length === 0 && (
          <p className="px-5 pt-4 text-lg text-gray-700">Add the things you sell, like tea, coffee and snacks, with their price.</p>
        )}
        <ul className="divide-y divide-ink/5">
          {shown.map(row)}
          <li>
            <button
              type="button"
              onClick={() => setEditing({ mode: 'add' })}
              className="flex min-h-16 w-full items-center gap-3 px-5 py-3 text-left text-lg font-bold text-leaf-700 active:bg-leaf-50"
            >
              <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf-100 text-2xl leading-none">
                +
              </span>
              Add item
            </button>
          </li>
        </ul>
      </Panel>

      {hidden.length > 0 && (
        <>
          <h3 className="px-5 pb-2 pt-5 text-base font-semibold text-gray-600">Hidden from entry screen</h3>
          <Panel>
            <ul className="divide-y divide-ink/5">{hidden.map(row)}</ul>
          </Panel>
        </>
      )}

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
