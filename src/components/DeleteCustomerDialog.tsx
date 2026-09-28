import type { Customer } from '../db/types'
import { useCustomerRecordCounts } from '../hooks/useCustomerRecordCounts'
import ConfirmDialog from './ConfirmDialog'

interface DeleteCustomerDialogProps {
  open: boolean
  customer: Customer
  onConfirm: () => void
  onCancel: () => void
}

const count = (n: number, one: string, many: string) => (n > 0 ? `${n} ${n === 1 ? one : many}` : '')

export default function DeleteCustomerDialog({ open, customer, onConfirm, onCancel }: DeleteCustomerDialogProps) {
  const counts = useCustomerRecordCounts(customer.id)
  const records = counts
    ? [
        count(counts.entries, 'entry', 'entries'),
        count(counts.bills, 'bill', 'bills'),
        count(counts.payments, 'payment', 'payments'),
      ].filter(Boolean)
    : []

  return (
    <ConfirmDialog
      open={open}
      title={`Delete ${customer.name}?`}
      confirmLabel="Delete customer"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {records.length > 0 ? (
        <p>
          This also deletes their <strong className="text-ink">{records.join(', ')}</strong>. This cannot be undone.
        </p>
      ) : (
        <p>This cannot be undone.</p>
      )}
    </ConfirmDialog>
  )
}
