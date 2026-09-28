import { addDays, formatDisplayDate, isISODate, relativeDayName, todayISO } from '../lib/dates'

interface DateSwitcherProps {
  date: string
  onChange: (date: string) => void
}

function Arrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  )
}

/** Previous / next day buttons, and a tap on the date opens the phone's calendar. Future dates are blocked. */
export default function DateSwitcher({ date, onChange }: DateSwitcherProps) {
  const today = todayISO()
  const isToday = date >= today
  const arrowClass =
    'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-gray-300 text-ink active:bg-leaf-100 disabled:border-gray-200 disabled:text-gray-300'

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => onChange(addDays(date, -1))} aria-label="Previous day" className={arrowClass}>
        <Arrow direction="left" />
      </button>
      <label className="relative flex min-h-14 flex-1 flex-col items-center justify-center rounded-2xl border-2 border-gray-300 px-2 active:bg-leaf-50">
        <span className={`text-lg font-bold leading-tight ${isToday ? 'text-ink' : 'text-chai-700'}`}>
          {relativeDayName(date, today)}
        </span>
        <span className="text-base leading-tight text-gray-600">{formatDisplayDate(date)}</span>
        <input
          type="date"
          value={date}
          max={today}
          aria-label="Choose date"
          onChange={(e) => isISODate(e.target.value) && onChange(e.target.value > today ? today : e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </label>
      <button type="button" onClick={() => onChange(addDays(date, 1))} disabled={isToday} aria-label="Next day" className={arrowClass}>
        <Arrow direction="right" />
      </button>
    </div>
  )
}
