import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Customer } from '../db/types'
import BottomSheet from './BottomSheet'
import CustomerAvatar from './CustomerAvatar'
import TextField from './TextField'

const SEARCH_FROM = 7

interface CustomerPickerProps {
  customers: Customer[]
  selected: Customer | undefined
  onSelect: (id: number) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CustomerPicker({ customers, selected, onSelect, open, onOpenChange }: CustomerPickerProps) {
  const [search, setSearch] = useState('')
  const query = search.trim().toLowerCase()
  const shown = query ? customers.filter((c) => c.name.toLowerCase().includes(query)) : customers

  function choose(id: number) {
    onSelect(id)
    onOpenChange(false)
    setSearch('')
  }

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="flex min-h-18 w-full items-center gap-3 rounded-3xl bg-white px-4 py-3 text-left ring-1 ring-ink/5 active:bg-leaf-50"
      >
        {selected ? (
          <CustomerAvatar name={selected.name} />
        ) : (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-chai-50 text-chai-700">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true">
              <path d="M16 19v-1a4 4 0 0 0-8 0v1M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
            </svg>
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block text-base text-gray-600">Customer</span>
          <span className="block truncate text-xl font-bold text-ink">{selected?.name ?? 'Tap to choose'}</span>
        </span>
        <span className="shrink-0 rounded-full bg-leaf-100 px-3 py-1 text-base font-bold text-leaf-800">{selected ? 'Change' : 'Choose'}</span>
      </button>

      <BottomSheet open={open} title="Choose customer" onClose={() => onOpenChange(false)}>
        {customers.length >= SEARCH_FROM && (
          <div className="pb-3">
            <TextField label="Find" value={search} onChange={setSearch} type="search" placeholder="Customer name" />
          </div>
        )}
        <ul className="-mx-5 divide-y divide-gray-200 border-y border-gray-200">
          {shown.map((customer) => (
            <li key={customer.id}>
              <button
                type="button"
                onClick={() => choose(customer.id)}
                className={`flex min-h-16 w-full items-center gap-3 px-5 py-2 text-left active:bg-leaf-50 ${
                  customer.id === selected?.id ? 'bg-leaf-100' : ''
                }`}
              >
                <CustomerAvatar name={customer.name} />
                <span className="min-w-0 flex-1 truncate text-lg font-semibold">{customer.name}</span>
                {customer.id === selected?.id && <span className="text-2xl font-bold text-leaf-700">✓</span>}
              </button>
            </li>
          ))}
        </ul>
        {shown.length === 0 && <p className="py-4 text-lg text-gray-700">No customer matches “{search}”.</p>}
        <Link to="/customers/new" className="mt-4 flex min-h-14 items-center justify-center text-lg font-bold text-leaf-700 underline underline-offset-4">
          Add a new customer
        </Link>
      </BottomSheet>
    </>
  )
}
