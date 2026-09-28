import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BalanceText from '../components/BalanceText'
import Button, { buttonClass } from '../components/Button'
import CustomerAvatar from '../components/CustomerAvatar'
import DeleteCustomerDialog from '../components/DeleteCustomerDialog'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import { deleteCustomer } from '../db/customers'
import { useBalances } from '../hooks/useBalances'
import { useCustomer } from '../hooks/useCustomer'

export default function CustomerDetailPage() {
  const id = Number(useParams().id)
  const customer = useCustomer(id)
  const balances = useBalances()
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
    <>
      <PageHeader title={customer.name} backTo="/customers" />

      <div className="flex items-center gap-4 px-4 pt-5">
        <CustomerAvatar name={customer.name} size="lg" />
        <div className="min-w-0">
          <p className="text-base text-gray-600">Balance</p>
          <BalanceText paise={balances?.get(id) ?? 0} className="text-2xl" />
        </div>
      </div>

      <dl className="mx-4 mt-5 divide-y divide-gray-200 rounded-3xl border-2 border-gray-200">
        {customer.phone && (
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <dt className="text-base text-gray-600">Phone</dt>
              <dd className="text-lg font-semibold tabular-nums">{customer.phone}</dd>
            </div>
            <a href={`tel:${customer.phone}`} className={`${buttonClass('secondary')} min-h-12 px-4`}>
              Call
            </a>
          </div>
        )}
        {customer.address && (
          <div className="px-4 py-3">
            <dt className="text-base text-gray-600">Address</dt>
            <dd className="whitespace-pre-line text-lg">{customer.address}</dd>
          </div>
        )}
        {customer.notes && (
          <div className="px-4 py-3">
            <dt className="text-base text-gray-600">Notes</dt>
            <dd className="whitespace-pre-line text-lg">{customer.notes}</dd>
          </div>
        )}
        {!customer.phone && !customer.address && !customer.notes && (
          <p className="px-4 py-4 text-lg text-gray-600">No phone or address added.</p>
        )}
      </dl>

      <div className="flex flex-col gap-3 p-4">
        <Link to={`/customers/${id}/edit`} className={buttonClass('secondary')}>
          Edit details
        </Link>
      </div>

      <p className="px-4 text-lg text-gray-600">Entries, bills and payments for this customer will show here.</p>

      <div className="px-4 pb-6 pt-10">
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
    </>
  )
}
