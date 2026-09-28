import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'

export default function BillsPage() {
  return (
    <>
      <PageHeader title="Bills" />
      <EmptyState title="Bills come next">Once daily entries are added, you can make a bill for any customer here.</EmptyState>
    </>
  )
}
