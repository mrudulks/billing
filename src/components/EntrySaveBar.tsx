import { formatRupees } from '../lib/money'
import Button from './Button'

interface EntrySaveBarProps {
  count: number
  total: number
  hasCustomer: boolean
  saving: boolean
  onSave: () => void
  onChooseCustomer: () => void
}

/** Sits just above the tabs so Save is always under the thumb. */
export default function EntrySaveBar({ count, total, hasCustomer, saving, onSave, onChooseCustomer }: EntrySaveBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 border-t border-gray-300 bg-white">
      <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-base text-gray-600">{count === 0 ? 'Nothing added' : `${count} ${count === 1 ? 'item' : 'items'}`}</p>
          <p className="text-2xl font-bold tabular-nums text-ink">{formatRupees(total)}</p>
        </div>
        {hasCustomer ? (
          <Button onClick={onSave} disabled={count === 0 || saving} className="min-w-36 text-xl">
            {saving ? 'Saving…' : 'Save'}
          </Button>
        ) : (
          <Button onClick={onChooseCustomer} className="min-w-36">
            Choose customer
          </Button>
        )}
      </div>
    </div>
  )
}
