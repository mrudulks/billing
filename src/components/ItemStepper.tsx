import type { Item } from '../db/types'
import { clampQty, lineAmount, MAX_QTY } from '../lib/entries'
import { formatRupees } from '../lib/money'

interface ItemStepperProps {
  item: Item
  qty: number
  onChange: (qty: number) => void
}

export default function ItemStepper({ item, qty, onChange }: ItemStepperProps) {
  const stepClass =
    'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl font-bold leading-none active:scale-95 disabled:opacity-30'

  return (
    <li className={`flex items-center gap-3 px-4 py-3 ${qty > 0 ? 'bg-leaf-50' : ''}`}>
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-bold text-ink">{item.name}</p>
        <p className="text-base tabular-nums text-gray-600">{formatRupees(item.defaultPrice)} each</p>
        {qty > 0 && <p className="text-lg font-bold tabular-nums text-leaf-800">{formatRupees(lineAmount(item.defaultPrice, qty))}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(clampQty(qty - 1))}
        disabled={qty === 0}
        aria-label={`One less ${item.name}`}
        className={`${stepClass} border-2 border-gray-300 bg-white text-ink`}
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={qty === 0 ? '' : String(qty)}
        placeholder="0"
        maxLength={String(MAX_QTY).length}
        aria-label={`${item.name} quantity`}
        onFocus={(e) => e.target.select()}
        onChange={(e) => onChange(clampQty(Number(e.target.value.replace(/\D/g, '') || '0')))}
        className="h-14 w-14 shrink-0 rounded-xl border-2 border-transparent bg-transparent text-center text-2xl font-bold tabular-nums text-ink outline-none placeholder:text-gray-400 focus:border-leaf-600 focus:bg-white"
      />
      <button
        type="button"
        onClick={() => onChange(clampQty(qty + 1))}
        aria-label={`One more ${item.name}`}
        className={`${stepClass} bg-leaf-700 text-white active:bg-leaf-800`}
      >
        +
      </button>
    </li>
  )
}
