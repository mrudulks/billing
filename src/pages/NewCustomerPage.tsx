import { useNavigate } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { addCustomer } from '../db/customers'

export default function NewCustomerPage() {
  const navigate = useNavigate()

  return (
    <>
      <PageHeader title="New customer" backTo="/customers" />
      <Panel className="mt-4">
        <CustomerForm
          submitLabel="Save customer"
          onSubmit={async (customer) => {
            await addCustomer(customer)
            navigate('/customers', { replace: true })
          }}
        />
      </Panel>
    </>
  )
}
