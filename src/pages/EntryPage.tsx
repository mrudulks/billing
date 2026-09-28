import ComingSoon from '../components/ComingSoon'
import PageHeader from '../components/PageHeader'
import { formatDisplayDate, todayISO } from '../lib/dates'

export default function EntryPage() {
  return (
    <>
      <PageHeader title="Entry" />
      <p className="px-4 pt-4 text-xl font-semibold">Today: {formatDisplayDate(todayISO())}</p>
      <ComingSoon text="Daily entries will be added here." />
    </>
  )
}
