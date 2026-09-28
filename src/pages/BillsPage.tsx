import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BillListRow from '../components/BillListRow'
import BillPreview from '../components/BillPreview'
import BottomActionBar from '../components/BottomActionBar'
import Button from '../components/Button'
import CustomerPicker from '../components/CustomerPicker'
import DateRangePicker from '../components/DateRangePicker'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import SectionHeading from '../components/SectionHeading'
import { NothingToBillError, saveBill } from '../db/bills'
import { useBillDraft } from '../hooks/useBillDraft'
import { useBills } from '../hooks/useBills'
import { useCustomers } from '../hooks/useCustomers'
import { billTotal } from '../lib/bills'
import { formatDisplayDate, lastNDaysRange } from '../lib/dates'

export default function BillsPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const customers = useCustomers()
  const bills = useBills()
  const [customerId, setCustomerId] = useState<number | undefined>(() => Number(params.get('customer')) || undefined)
  const [range, setRange] = useState(() => lastNDaysRange(14))
  const [pickerOpen, setPickerOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const customer = customers?.find((c) => c.id === customerId)
  const draft = useBillDraft(customer?.id, range.fromDate, range.toDate)

  const names = new Map(customers?.map((c) => [c.id, c.name]))
  const entries = draft?.entries ?? []
  const total = billTotal(entries)

  async function handleSave() {
    if (!customer) return
    setSaving(true)
    setError('')
    try {
      const id = await saveBill(customer.id, range.fromDate, range.toDate)
      navigate(`/bills/${id}`)
    } catch (e) {
      setError(e instanceof NothingToBillError ? e.message : 'Could not save the bill. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className={customer ? 'pb-32' : 'pb-6'}>
      <PageHeader title="Bills" />

      {customers && customers.length === 0 ? (
        <EmptyState title="No customers yet">Add customers and their daily entries first.</EmptyState>
      ) : (
        <section className="space-y-4 px-4 pt-4" aria-label="New bill">
          <h2 className="px-1 text-xl font-bold text-ink">Make a bill</h2>
          <CustomerPicker
            customers={customers ?? []}
            selected={customer}
            onSelect={setCustomerId}
            open={pickerOpen}
            onOpenChange={setPickerOpen}
          />
          <DateRangePicker
            fromDate={range.fromDate}
            toDate={range.toDate}
            onChange={setRange}
            sinceLastBill={draft?.sinceLastBill}
          />
        </section>
      )}

      {customer && draft && (
        <section className="pt-5" aria-label="Bill preview">
          {draft.older.count > 0 && draft.older.earliestDate && (
            <div className="mx-4 mb-4 rounded-3xl bg-chai-50 p-5 ring-1 ring-chai-700/20">
              <p className="text-lg font-semibold text-chai-700">
                {draft.older.count} older {draft.older.count === 1 ? 'entry is' : 'entries are'} not billed yet, from{' '}
                {formatDisplayDate(draft.older.earliestDate)}.
              </p>
              <Button
                variant="secondary"
                onClick={() => draft.older.earliestDate && setRange({ ...range, fromDate: draft.older.earliestDate })}
                className="mt-3 w-full"
              >
                Include them
              </Button>
            </div>
          )}

          {entries.length === 0 ? (
            <Panel className="p-5">
              <p className="text-lg text-gray-700">
                No unbilled entries for {customer.name} from {formatDisplayDate(range.fromDate)} to {formatDisplayDate(range.toDate)}.
              </p>
            </Panel>
          ) : (
            <Panel className="p-5">
              <BillPreview entries={entries} />
            </Panel>
          )}
          {error && <p className="px-5 pt-3 text-lg font-semibold text-danger">{error}</p>}
        </section>
      )}

      {bills && bills.length > 0 && (
        <section className="pt-10" aria-labelledby="past-bills">
          <SectionHeading id="past-bills" title="Past bills" />
          <Panel>
            <ul className="divide-y divide-ink/5">
              {bills.map((bill) => (
                <BillListRow key={bill.id} bill={bill} customerName={names.get(bill.customerId) ?? 'Deleted customer'} />
              ))}
            </ul>
          </Panel>
        </section>
      )}

      {customer && (
        <BottomActionBar caption={entries.length > 0 ? 'Bill total' : 'Nothing to bill'} amount={total}>
          <Button variant="light" onClick={handleSave} disabled={entries.length === 0 || saving} className="min-w-32 text-xl">
            {saving ? 'Saving…' : 'Save bill'}
          </Button>
        </BottomActionBar>
      )}
    </div>
  )
}
