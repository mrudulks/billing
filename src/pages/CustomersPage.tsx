import { useState } from 'react'
import { Link } from 'react-router-dom'
import BalanceText from '../components/BalanceText'
import CustomerAvatar from '../components/CustomerAvatar'
import EmptyState from '../components/EmptyState'
import FloatingAddButton from '../components/FloatingAddButton'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import TextField from '../components/TextField'
import { useBalances } from '../hooks/useBalances'
import { useCustomers } from '../hooks/useCustomers'

// Only show search once the list is long enough to need it.
const SEARCH_FROM = 7

export default function CustomersPage() {
  const customers = useCustomers()
  const balances = useBalances()
  const [search, setSearch] = useState('')

  if (!customers || !balances) return <PageHeader title="Customers" />

  const query = search.trim().toLowerCase()
  const shown = query
    ? customers.filter((c) => c.name.toLowerCase().includes(query) || c.phone?.includes(query))
    : customers

  return (
    <div className="pb-24">
      <PageHeader title="Customers" subtitle={customers.length > 0 ? `${customers.length} customers` : undefined} />

      {customers.length === 0 ? (
        <EmptyState title="No customers yet">Add the offices and shops you deliver to. Tap “Add customer” below.</EmptyState>
      ) : (
        <>
          {customers.length >= SEARCH_FROM && (
            <div className="px-4 pb-1 pt-4">
              <TextField label="Find a customer" value={search} onChange={setSearch} type="search" placeholder="Name or phone" />
            </div>
          )}
          <Panel className="mt-4">
            <ul className="divide-y divide-ink/5">
              {shown.map((customer) => (
                <li key={customer.id}>
                  <Link to={`/customers/${customer.id}`} className="flex min-h-18 items-center gap-3 px-4 py-3 active:bg-leaf-50">
                    <CustomerAvatar name={customer.name} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-lg font-semibold text-ink">{customer.name}</span>
                      {customer.phone && <span className="block text-base tabular-nums text-gray-600">{customer.phone}</span>}
                    </span>
                    <BalanceText paise={balances.get(customer.id) ?? 0} look="tag" className="shrink-0 text-base" />
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
          {shown.length === 0 && <p className="px-5 py-6 text-lg text-gray-700">No customer matches “{search}”.</p>}
        </>
      )}

      <FloatingAddButton to="/customers/new" label="Add customer" />
    </div>
  )
}
