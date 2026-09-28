import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BalanceText from '../components/BalanceText'
import BillListRow from '../components/BillListRow'
import Button, { buttonClass } from '../components/Button'
import CustomerAvatar from '../components/CustomerAvatar'
import DeleteCustomerDialog from '../components/DeleteCustomerDialog'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import RecentEntries from '../components/RecentEntries'
import SectionHeading from '../components/SectionHeading'
import { deleteCustomer } from '../db/customers'
import { useBalances } from '../hooks/useBalances'
import { useBills } from '../hooks/useBills'
import { useCustomer } from '../hooks/useCustomer'
import { useRecentEntries } from '../hooks/useRecentEntries'

export default function CustomerDetailPage() {
  const id = Number(useParams().id)
  const customer = useCustomer(id)
  const balances = useBalances()
  const recent = useRecentEntries(id)
  const bills = useBills(id)
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (customer === undefined) return <PageHeader title="Customer" backTo="/customers" />
  if (customer === null) {
    return (
      <>
        <PageHeader title="Customer" backTo="/customers" />
        <EmptyState title="Customer not found">They may have been deleted.</EmptyState>
      </>
    )
  }

  async function handleDelete() {
    setConfirmDelete(false)
    await deleteCustomer(id)
    navigate('/customers', { replace: true })
  }

  return (
    <div className="pb-6">
      <PageHeader title={customer.name} backTo="/customers" />

      <Panel className="mt-4">
        <div className="flex items-center gap-4 px-5 py-5">
          <CustomerAvatar name={customer.name} size="lg" />
          <div className="min-w-0">
            <p className="text-base text-gray-600">Balance</p>
            <BalanceText paise={balances?.get(id) ?? 0} className="text-2xl" />
          </div>
        </div>

        <dl className="divide-y divide-ink/5 border-t border-ink/5">
          {customer.phone && (
            <div className="flex items-center justify-between gap-3 px-5 py-3">
              <div>
                <dt className="text-base text-gray-600">Phone</dt>
                <dd className="text-lg font-semibold tabular-nums">{customer.phone}</dd>
              </div>
              <a href={`tel:${customer.phone}`} className={`${buttonClass('secondary')} min-h-12 px-5`}>
                Call
              </a>
            </div>
          )}
          {customer.address && (
            <div className="px-5 py-3">
              <dt className="text-base text-gray-600">Address</dt>
              <dd className="whitespace-pre-line text-lg">{customer.address}</dd>
            </div>
          )}
          {customer.notes && (
            <div className="px-5 py-3">
              <dt className="text-base text-gray-600">Notes</dt>
              <dd className="whitespace-pre-line text-lg">{customer.notes}</dd>
            </div>
          )}
          {!customer.phone && !customer.address && !customer.notes && (
            <p className="px-5 py-4 text-lg text-gray-600">No phone or address added.</p>
          )}
        </dl>
      </Panel>

      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        <Link to={`/?customer=${id}`} className={buttonClass('primary')}>
          Add entry
        </Link>
        <Link to={`/bills?customer=${id}`} className={buttonClass('secondary')}>
          Make bill
        </Link>
        <Link to={`/customers/${id}/edit`} className={`${buttonClass('quiet')} col-span-2`}>
          Edit details
        </Link>
      </div>

      {bills && bills.length > 0 && (
        <section className="pt-6" aria-labelledby="bills-heading">
          <SectionHeading id="bills-heading" title="Bills" />
          <Panel>
            <ul className="divide-y divide-ink/5">
              {bills.map((bill) => (
                <BillListRow key={bill.id} bill={bill} />
              ))}
            </ul>
          </Panel>
        </section>
      )}

      <section className="pt-6" aria-labelledby="entries-heading">
        <SectionHeading id="entries-heading" title="Recent entries" />
        {recent && <RecentEntries entries={recent} />}
      </section>

      <div className="px-4 pt-10">
        <Button variant="danger" onClick={() => setConfirmDelete(true)} className="w-full">
          Delete customer
        </Button>
      </div>

      <DeleteCustomerDialog
        open={confirmDelete}
        customer={customer}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
