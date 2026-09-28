import type { ReactNode } from 'react'
import { formatRupees } from '../lib/money'

interface BottomActionBarProps {
  caption: string
  amount: number
  /** The main button. Use Button variant="light" so it stands out on the dark bar. */
  children: ReactNode
}

/** Floating dark bar just above the tabs: total on the left, main button under the thumb. */
export default function BottomActionBar({ caption, amount, children }: BottomActionBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(4.9rem+env(safe-area-inset-bottom))] z-20 px-3 print:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-3 rounded-3xl bg-leaf-900 py-2.5 pl-5 pr-2.5 text-white shadow-xl shadow-leaf-900/30">
        <div className="min-w-0 flex-1">
          <p className="text-base text-leaf-100">{caption}</p>
          <p className="text-2xl font-bold tabular-nums">{formatRupees(amount)}</p>
        </div>
        {children}
      </div>
    </div>
  )
}
