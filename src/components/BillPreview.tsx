import type { Entry } from '../db/types'
import { billTotal, dayRows, summariseItems } from '../lib/bills'
import { shortDayLabel } from '../lib/dates'
import { formatRupees } from '../lib/money'

interface BillPreviewProps {
  entries: Entry[]
  /** Balance before this bill; the total due line is shown when given. */
  previous?: number
}

/** Day-wise table, item summary and totals. Used for the preview and the printed bill. */
export default function BillPreview({ entries, previous }: BillPreviewProps) {
  const days = dayRows(entries)
  const items = summariseItems(entries)
  const total = billTotal(entries)
  const th = 'py-2 text-left text-base font-semibold text-gray-600'

  return (
    <div className="space-y-6">
      <section>
        <h3 className="pb-1 text-lg font-bold text-ink">Day by day</h3>
        <table className="w-full border-collapse">
          <thead className="border-b-2 border-gray-300">
            <tr>
              <th className={th}>Date</th>
              <th className={th}>Items</th>
              <th className={`${th} text-right`}>Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {days.map((day) => (
              <tr key={day.date} className="break-inside-avoid align-top">
                <td className="whitespace-nowrap py-2 pr-3 text-base font-semibold">{shortDayLabel(day.date)}</td>
                <td className="py-2 pr-2 text-base">{day.items.map((i) => `${i.itemName} ${i.qty}`).join(', ')}</td>
                <td className="py-2 text-right text-base tabular-nums">{formatRupees(day.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3 className="pb-1 text-lg font-bold text-ink">Summary</h3>
        <table className="w-full border-collapse">
          <thead className="border-b-2 border-gray-300">
            <tr>
              <th className={th}>Item</th>
              <th className={`${th} text-right`}>Qty</th>
              <th className={`${th} text-right`}>Rate</th>
              <th className={`${th} text-right`}>Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={`${item.itemName}-${item.unitPrice}`}>
                <td className="py-2 text-lg font-semibold">{item.itemName}</td>
                <td className="py-2 text-right text-lg tabular-nums">{item.qty}</td>
                <td className="py-2 text-right text-lg tabular-nums">{formatRupees(item.unitPrice)}</td>
                <td className="py-2 text-right text-lg font-semibold tabular-nums">{formatRupees(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <dl className="space-y-1 border-t-2 border-ink pt-3 text-lg">
        <div className="flex justify-between">
          <dt>This bill</dt>
          <dd className="font-semibold tabular-nums">{formatRupees(total)}</dd>
        </div>
        {previous !== undefined && previous !== 0 && (
          <div className="flex justify-between">
            <dt>{previous > 0 ? 'Previous balance' : 'Advance paid'}</dt>
            <dd className="font-semibold tabular-nums">
              {previous > 0 ? '' : '−'}
              {formatRupees(Math.abs(previous))}
            </dd>
          </div>
        )}
        {previous !== undefined && (
          <div className="flex justify-between pt-1 text-2xl font-bold">
            <dt>Total due</dt>
            <dd className="tabular-nums">{formatRupees(total + previous)}</dd>
          </div>
        )}
      </dl>
    </div>
  )
}
