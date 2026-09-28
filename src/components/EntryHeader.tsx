import type { ReactNode } from 'react'
import { longDateLabel, todayISO } from '../lib/dates'
import CupMark from './CupMark'

interface EntryHeaderProps {
  shopName: string
  /** Controls shown on the green band, e.g. customer and date. */
  children?: ReactNode
}

/** The home screen's green band: shop name, today's date and the main choices. */
export default function EntryHeader({ shopName, children }: EntryHeaderProps) {
  return (
    <header className="rounded-b-[2rem] bg-leaf-800 px-4 pb-5 pt-[calc(1.25rem+env(safe-area-inset-top))] text-white print:hidden">
      <div className="flex items-center gap-3 px-1">
        <CupMark />
        <div className="min-w-0">
          <h1 className="truncate text-[1.65rem] font-bold leading-tight">{shopName || 'Tea Billing'}</h1>
          <p className="text-base text-leaf-100">{longDateLabel(todayISO())}</p>
        </div>
      </div>
      {children && <div className="mt-5 space-y-3">{children}</div>}
    </header>
  )
}
