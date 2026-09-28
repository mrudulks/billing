import { useNavigate, useParams } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { updateCustomer } from '../db/customers'
import { useCustomer } from '../hooks/useCustomer'

export default function EditCustomerPage() {
  const id = Number(useParams().id)
  const customer = useCustomer(id)
  const navigate = useNavigate()
  const backTo = `/customers/${id}`

  if (customer === undefined) return <PageHeader title="Edit customer" backTo={backTo} />
  if (customer === null) {
    return (
      <>
        <PageHeader title="Edit customer" backTo="/customers" />
        <EmptyState title="Customer not found" />
      </>
    )
  }

  return (
    <>
      <PageHeader title="Edit customer" backTo={backTo} />
      <Panel className="mt-4">
        <CustomerForm
          initial={{
            name: customer.name,
            phone: customer.phone ?? '',
            address: customer.address ?? '',
            notes: customer.notes ?? '',
          }}
          submitLabel="Save changes"
          onSubmit={async (values) => {
            await updateCustomer(id, values)
            navigate(backTo, { replace: true })
          }}
        />
      </Panel>
    </>
  )
}
