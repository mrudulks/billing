import { useState } from 'react'
import { deleteEntryIfUnbilled } from '../db/entries'
import type { Entry } from '../db/types'
import { dayLabel, formatDisplayDate } from '../lib/dates'
import { groupEntriesByDate, lineAmount } from '../lib/entries'
import { formatRupees } from '../lib/money'
import ConfirmDialog from './ConfirmDialog'

interface RecentEntriesProps {
  entries: Entry[]
  /** Highlights the day being entered on the entry screen. */
  activeDate?: string
}

export default function RecentEntries({ entries, activeDate }: RecentEntriesProps) {
  const [toDelete, setToDelete] = useState<Entry | null>(null)
  const [message, setMessage] = useState('')
  const days = groupEntriesByDate(entries)

  async function handleDelete() {
    if (!toDelete) return
    const deleted = await deleteEntryIfUnbilled(toDelete.id)
    setMessage(deleted ? '' : 'This entry is on a bill, so it cannot be deleted.')
    setToDelete(null)
  }

  if (days.length === 0) return <p className="px-4 text-lg text-gray-600">No entries yet for this customer.</p>

  return (
    <div className="space-y-5">
      {message && <p className="px-4 text-lg font-semibold text-danger">{message}</p>}
      {days.map((day) => (
        <section key={day.date} aria-label={dayLabel(day.date)}>
          <div className={`flex items-baseline justify-between px-4 py-2 ${day.date === activeDate ? 'bg-leaf-100' : 'bg-gray-100'}`}>
            <h3 className="text-lg font-bold text-ink">{dayLabel(day.date)}</h3>
            <span className="text-lg font-bold tabular-nums text-ink">{formatRupees(day.total)}</span>
          </div>
          <ul className="divide-y divide-gray-200">
            {day.entries.map((entry) => (
              <li key={entry.id} className="flex min-h-14 items-center gap-3 pl-4 pr-1">
                <span className="min-w-0 flex-1">
                  <span className="text-lg font-semibold">{entry.itemName}</span>
                  <span className="ml-2 text-base tabular-nums text-gray-600">
                    {entry.qty} × {formatRupees(entry.unitPrice)}
                  </span>
                </span>
                <span className="text-lg tabular-nums">{formatRupees(lineAmount(entry.unitPrice, entry.qty))}</span>
                {entry.billId !== undefined ? (
                  <span className="w-12 text-center text-sm font-semibold text-gray-500">Billed</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setToDelete(entry)}
                    aria-label={`Delete ${entry.itemName}`}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-gray-500 active:bg-red-50 active:text-danger"
                  >
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                    </svg>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this entry?"
        confirmLabel="Delete entry"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      >
        {toDelete && (
          <p>
            {toDelete.qty} {toDelete.itemName} on {formatDisplayDate(toDelete.date)}, {formatRupees(lineAmount(toDelete.unitPrice, toDelete.qty))}.
          </p>
        )}
      </ConfirmDialog>
    </div>
  )
}
