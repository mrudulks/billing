import BottomActionBar from './BottomActionBar'
import Button from './Button'

interface EntrySaveBarProps {
  count: number
  total: number
  hasCustomer: boolean
  saving: boolean
  onSave: () => void
  onChooseCustomer: () => void
}

export default function EntrySaveBar({ count, total, hasCustomer, saving, onSave, onChooseCustomer }: EntrySaveBarProps) {
  return (
    <BottomActionBar caption={count === 0 ? 'Nothing added' : `${count} ${count === 1 ? 'item' : 'items'}`} amount={total}>
      {hasCustomer ? (
        <Button variant="light" onClick={onSave} disabled={count === 0 || saving} className="min-w-32 text-xl">
          {saving ? 'Saving…' : 'Save'}
        </Button>
      ) : (
        <Button variant="light" onClick={onChooseCustomer} className="min-w-32">
          Choose customer
        </Button>
      )}
    </BottomActionBar>
  )
}
