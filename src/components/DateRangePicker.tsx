import { lastNDaysRange, todayISO } from '../lib/dates'
import DateField from './DateField'

interface DateRangePickerProps {
  fromDate: string
  toDate: string
  onChange: (range: { fromDate: string; toDate: string }) => void
  /** Day after the customer's last bill, if they have one. */
  sinceLastBill?: string
}

export default function DateRangePicker({ fromDate, toDate, onChange, sinceLastBill }: DateRangePickerProps) {
  const today = todayISO()
  const last7 = lastNDaysRange(7, today)
  const last14 = lastNDaysRange(14, today)
  const shortcuts = [
    { label: 'Last 7 days', range: last7 },
    { label: 'Last 14 days', range: last14 },
    ...(sinceLastBill && sinceLastBill <= today ? [{ label: 'Since last bill', range: { fromDate: sinceLastBill, toDate: today } }] : []),
  ]

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <DateField
          label="From"
          value={fromDate}
          max={toDate}
          onChange={(v) => onChange({ fromDate: v, toDate })}
        />
        <DateField
          label="To"
          value={toDate}
          min={fromDate}
          max={today}
          onChange={(v) => onChange({ fromDate, toDate: v > today ? today : v })}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {shortcuts.map(({ label, range }) => {
          const active = range.fromDate === fromDate && range.toDate === toDate
          return (
            <button
              key={label}
              type="button"
              onClick={() => onChange(range)}
              aria-pressed={active}
              className={`min-h-11 rounded-full border-2 px-4 text-base font-semibold ${
                active ? 'border-leaf-700 bg-leaf-700 text-white' : 'border-gray-300 bg-white text-ink active:bg-leaf-50'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
