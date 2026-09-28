import { useEffect, useState } from 'react'
import Button from '../components/Button'
import CustomerPicker from '../components/CustomerPicker'
import DateSwitcher from '../components/DateSwitcher'
import EntrySaveBar from '../components/EntrySaveBar'
import ItemStepper from '../components/ItemStepper'
import EntryHeader from '../components/EntryHeader'
import Panel from '../components/Panel'
import SectionHeading from '../components/SectionHeading'
import RecentEntries from '../components/RecentEntries'
import SetupSteps from '../components/SetupSteps'
import Toast from '../components/Toast'
import { addEntries } from '../db/entries'
import { useCustomers } from '../hooks/useCustomers'
import { useEntrySelection } from '../hooks/useEntrySelection'
import { useItems } from '../hooks/useItems'
import { useRecentEntries } from '../hooks/useRecentEntries'
import { useShopDetails } from '../hooks/useShopDetails'
import { dayLabel } from '../lib/dates'
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

  const shopName = shop?.shopName ?? ''
  if (!items || !customers) return <EntryHeader shopName={shopName} />

  const activeItems = items.filter((item) => item.active === 1)
  if (activeItems.length === 0 || customers.length === 0) {
    return (
      <>
        <EntryHeader shopName={shopName} />
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
    <div className="pb-32">
      <EntryHeader shopName={shopName}>
        <CustomerPicker
          customers={customers}
          selected={customer}
          onSelect={setCustomerId}
          open={pickerOpen}
          onOpenChange={setPickerOpen}
        />
        <DateSwitcher date={date} onChange={setDate} />
      </EntryHeader>

      {customer && lastTime && count === 0 && (
        <div className="px-4 pt-4">
          <Button variant="secondary" onClick={() => setQtys(lastTime.qtys)} className="w-full">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4" />
            </svg>
            Same as last time ({dayLabel(lastTime.date)})
          </Button>
        </div>
      )}

      <section className="pt-5" aria-labelledby="items-heading">
        <SectionHeading
          id="items-heading"
          title="What was delivered?"
          aside={
            count > 0 && (
              <button type="button" onClick={() => setQtys({})} className="min-h-11 px-1 text-base font-bold text-leaf-700 underline underline-offset-4">
                Clear all
              </button>
            )
          }
        />
        <Panel>
          <ul className="divide-y divide-ink/5">
            {activeItems.map((item) => (
              <ItemStepper
                key={item.id}
                item={item}
                qty={qtys[item.id] ?? 0}
                onChange={(qty) => setQtys((q) => ({ ...q, [item.id]: qty }))}
              />
            ))}
          </ul>
        </Panel>
      </section>

      {customer && (
        <section className="pt-8" aria-labelledby="recent-heading">
          <SectionHeading id="recent-heading" title={`Recent for ${customer.name}`} />
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
