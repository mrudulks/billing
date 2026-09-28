import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BillPreview from '../components/BillPreview'
import Button from '../components/Button'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import ShareBillButton from '../components/ShareBillButton'
import Toast from '../components/Toast'
import { deleteBill } from '../db/bills'
import { useBillDetails } from '../hooks/useBillDetails'
import { useShopDetails } from '../hooks/useShopDetails'
import { billDate, billShareText, billTotal, formatBillNumber, summariseItems } from '../lib/bills'
import { formatDisplayDate } from '../lib/dates'

export default function BillPage() {
  const id = Number(useParams().id)
  const details = useBillDetails(id)
  const shop = useShopDetails()
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  if (details === undefined || !shop) return <PageHeader title="Bill" backTo="/bills" />
  if (details === null) {
    return (
      <>
        <PageHeader title="Bill" backTo="/bills" />
        <EmptyState title="Bill not found">It may have been deleted.</EmptyState>
      </>
    )
  }

  const { bill, customer, entries, previous } = details
  const number = formatBillNumber(bill.number)
  const customerName = customer?.name ?? 'Deleted customer'
  const shareText = billShareText({
    shopName: shop.shopName,
    shopPhone: shop.shopPhone,
    billNumber: bill.number,
    customerName,
    fromDate: bill.fromDate,
    toDate: bill.toDate,
    items: summariseItems(entries),
    total: billTotal(entries),
    previous,
  })

  async function handleDelete() {
    setConfirmDelete(false)
    await deleteBill(id)
    navigate('/bills', { replace: true })
  }

  return (
    <div className="pb-8 print:pb-0">
      <PageHeader title={`Bill ${number}`} subtitle={customerName} backTo="/bills" />

      <article className="mx-4 mt-4 rounded-3xl border-2 border-gray-200 p-5 print:m-0 print:rounded-none print:border-0 print:p-0">
        <header className="border-b-2 border-dashed border-gray-300 pb-4 text-center">
          <p className="text-2xl font-bold text-leaf-800 print:text-ink">{shop.shopName || 'Bill'}</p>
          {shop.shopPhone && <p className="text-lg tabular-nums text-gray-700">{shop.shopPhone}</p>}
        </header>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 py-4 text-lg">
          <div>
            <dt className="text-base text-gray-600">Bill No.</dt>
            <dd className="font-bold tabular-nums">{number}</dd>
          </div>
          <div className="text-right">
            <dt className="text-base text-gray-600">Date</dt>
            <dd className="font-bold tabular-nums">{formatDisplayDate(billDate(bill))}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-base text-gray-600">To</dt>
            <dd className="text-xl font-bold">{customerName}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-base text-gray-600">For</dt>
            <dd className="font-semibold tabular-nums">
              {formatDisplayDate(bill.fromDate)} to {formatDisplayDate(bill.toDate)}
            </dd>
          </div>
        </dl>

        <BillPreview entries={entries} previous={previous} />
      </article>

      <div className="space-y-3 px-4 pt-5 print:hidden">
        {!shop.shopName && (
          <p className="text-base text-gray-600">
            Tip: add your shop name in{' '}
            <Link to="/settings" className="font-bold text-leaf-700 underline underline-offset-4">
              Settings
            </Link>{' '}
            so it shows on bills.
          </p>
        )}
        <ShareBillButton text={shareText} phone={customer?.phone} onMessage={setToast} />
        <Button variant="secondary" onClick={() => window.print()} className="w-full">
          Print or save PDF
        </Button>
        <div className="pt-6">
          <Button variant="danger" onClick={() => setConfirmDelete(true)} className="w-full">
            Delete bill
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete bill ${number}?`}
        confirmLabel="Delete bill"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      >
        <p>
          Its {entries.length} {entries.length === 1 ? 'entry goes' : 'entries go'} back to unbilled, so you can bill them again.
          Number {number} will not be used again.
        </p>
      </ConfirmDialog>

      <Toast message={toast} />
    </div>
  )
}
