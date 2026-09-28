import { useEffect, useState } from 'react'
import Button from '../components/Button'
import CustomerPicker from '../components/CustomerPicker'
import DateSwitcher from '../components/DateSwitcher'
import EntrySaveBar from '../components/EntrySaveBar'
import ItemStepper from '../components/ItemStepper'
import PageHeader from '../components/PageHeader'
import RecentEntries from '../components/RecentEntries'
import SetupSteps from '../components/SetupSteps'
import Toast from '../components/Toast'
import { addEntries } from '../db/entries'
import { useCustomers } from '../hooks/useCustomers'
import { useEntrySelection } from '../hooks/useEntrySelection'
import { useItems } from '../hooks/useItems'
import { useRecentEntries } from '../hooks/useRecentEntries'
import { useShopDetails } from '../hooks/useShopDetails'
import { dayLabel, formatDisplayDate, todayISO } from '../lib/dates'
import { buildEntries, draftCount, draftTotal, quantitiesFromLastDay, type Quantities } from '../lib/entries'
import { formatRupees } from '../lib/money'

export default function EntryPage() {
  const shop = useShopDetails()
  const items = useItems()
  const customers = useCustomers()
  const { customerId, date, setCustomerId, setDate } = useEntrySelection()
  const customer = customers?.find((c) => c.id === customerId)
  const recent = useRecentEntries(customer?.id)

  const [qtys, setQtys] = useState<Quantities>({})
  const [pickerOpen, setPickerOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  const header = <PageHeader title={shop?.shopName || 'Entry'} subtitle={formatDisplayDate(todayISO())} />
  if (!items || !customers) return header

  const activeItems = items.filter((item) => item.active === 1)
  if (activeItems.length === 0 || customers.length === 0) {
    return (
      <>
        {header}
        <SetupSteps hasItems={activeItems.length > 0} hasCustomers={customers.length > 0} />
      </>
    )
  }

  const count = draftCount(qtys)
  const total = draftTotal(activeItems, qtys)
  const lastTime = recent ? quantitiesFromLastDay(recent, activeItems.map((item) => item.id), date) : null

  async function handleSave() {
    if (!customer || count === 0) return
    setSaving(true)
    try {
      await addEntries(buildEntries(customer.id, date, activeItems, qtys))
      setQtys({})
      setToast(`Saved ${formatRupees(total)} for ${customer.name}`)
      navigator.vibrate?.(40)
    } catch {
      setToast('Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pb-28">
      {header}

      <div className="space-y-3 px-4 pt-4">
        <CustomerPicker
          customers={customers}
          selected={customer}
          onSelect={setCustomerId}
          open={pickerOpen}
          onOpenChange={setPickerOpen}
        />
        <DateSwitcher date={date} onChange={setDate} />
        {customer && lastTime && count === 0 && (
          <Button variant="secondary" onClick={() => setQtys(lastTime.qtys)} className="w-full">
            Same as last time ({dayLabel(lastTime.date)})
          </Button>
        )}
      </div>

      <ul className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
        {activeItems.map((item) => (
          <ItemStepper
            key={item.id}
            item={item}
            qty={qtys[item.id] ?? 0}
            onChange={(qty) => setQtys((q) => ({ ...q, [item.id]: qty }))}
          />
        ))}
      </ul>

      {count > 0 && (
        <div className="px-4 pt-2">
          <Button variant="quiet" onClick={() => setQtys({})} className="w-full">
            Clear all
          </Button>
        </div>
      )}

      {customer && (
        <section className="pt-8" aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="px-4 pb-2 text-xl font-bold text-ink">
            Recent for {customer.name}
          </h2>
          {recent && <RecentEntries entries={recent} activeDate={date} />}
        </section>
      )}

      <Toast message={toast} />
      <EntrySaveBar
        count={count}
        total={total}
        hasCustomer={Boolean(customer)}
        saving={saving}
        onSave={handleSave}
        onChooseCustomer={() => setPickerOpen(true)}
      />
    </div>
  )
}
