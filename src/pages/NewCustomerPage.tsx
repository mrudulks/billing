import { useNavigate } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import PageHeader from '../components/PageHeader'
import { addCustomer } from '../db/customers'

export default function NewCustomerPage() {
  const navigate = useNavigate()

  return (
    <>
      <PageHeader title="New customer" backTo="/customers" />
      <CustomerForm
        submitLabel="Save customer"
        onSubmit={async (customer) => {
          await addCustomer(customer)
          navigate('/customers', { replace: true })
        }}
      />
    </>
  )
}
