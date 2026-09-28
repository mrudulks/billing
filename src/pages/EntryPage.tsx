import PageHeader from '../components/PageHeader'
import SetupSteps from '../components/SetupSteps'
import { useCustomers } from '../hooks/useCustomers'
import { useItems } from '../hooks/useItems'
import { useShopDetails } from '../hooks/useShopDetails'
import { formatDisplayDate, todayISO } from '../lib/dates'

export default function EntryPage() {
  const shop = useShopDetails()
  const items = useItems()
  const customers = useCustomers()
  const loaded = items && customers
  const ready = loaded && items.some((item) => item.active === 1) && customers.length > 0

  return (
    <>
      <PageHeader title={shop?.shopName || 'Today'} subtitle={formatDisplayDate(todayISO())} />
      {loaded && !ready && (
        <SetupSteps hasItems={items.some((item) => item.active === 1)} hasCustomers={customers.length > 0} />
      )}
      {ready && (
        <p className="px-4 pt-5 text-lg text-gray-700">
          You have {items.filter((item) => item.active === 1).length} items and {customers.length} customers. Daily entry comes in the
          next update.
        </p>
      )}
    </>
  )
}
