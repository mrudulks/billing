import type { ReactNode } from 'react'
import { formatRupees } from '../lib/money'

interface BottomActionBarProps {
  caption: string
  amount: number
  children: ReactNode
}

/** Total on the left and the main button on the right, just above the tabs so it is always under the thumb. */
export default function BottomActionBar({ caption, amount, children }: BottomActionBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 border-t border-gray-300 bg-white print:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-base text-gray-600">{caption}</p>
          <p className="text-2xl font-bold tabular-nums text-ink">{formatRupees(amount)}</p>
        </div>
        {children}
      </div>
    </div>
  )
}
