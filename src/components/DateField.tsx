import { useId } from 'react'
import { formatDisplayDate, isISODate } from '../lib/dates'

interface DateFieldProps {
  label: string
  value: string
  min?: string
  max: string
  onChange: (value: string) => void
}

/** Shows DD/MM/YYYY; a tap opens the phone's calendar. */
export default function DateField({ label, value, min, max, onChange }: DateFieldProps) {
  const id = useId()
  return (
    <div className="flex-1">
      <label htmlFor={id} className="mb-1.5 block text-base font-semibold text-ink">
        {label}
      </label>
      <div className="relative flex min-h-14 items-center rounded-2xl bg-white px-4 ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-leaf-600">
        <span className="text-lg font-semibold tabular-nums">{formatDisplayDate(value)}</span>
        <input
          id={id}
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={(e) => isISODate(e.target.value) && onChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  )
}
