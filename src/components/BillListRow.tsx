import { Link } from 'react-router-dom'
import type { Bill } from '../db/types'
import { formatBillNumber } from '../lib/bills'
import { formatDisplayDate } from '../lib/dates'
import { formatRupees } from '../lib/money'

interface BillListRowProps {
  bill: Bill
  /** Omit on a customer's own page, where the name is already shown. */
  customerName?: string
}

export default function BillListRow({ bill, customerName }: BillListRowProps) {
  return (
    <li>
      <Link to={`/bills/${bill.id}`} className="flex min-h-18 items-center gap-3 px-4 py-3 active:bg-leaf-50">
        <span className="flex h-12 min-w-14 shrink-0 items-center justify-center rounded-xl bg-paper px-2 text-base font-bold tabular-nums text-ink">
          {formatBillNumber(bill.number)}
        </span>
        <span className="min-w-0 flex-1">
          {customerName && <span className="block truncate text-lg font-semibold text-ink">{customerName}</span>}
          <span className={`block tabular-nums ${customerName ? 'text-base text-gray-600' : 'text-lg font-semibold text-ink'}`}>
            {formatDisplayDate(bill.fromDate)} to {formatDisplayDate(bill.toDate)}
          </span>
        </span>
        <span className="shrink-0 text-lg font-bold tabular-nums">{formatRupees(bill.total)}</span>
      </Link>
    </li>
  )
}
