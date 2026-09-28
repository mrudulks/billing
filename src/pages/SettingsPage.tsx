import ItemsSection from '../components/ItemsSection'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import SectionHeading from '../components/SectionHeading'
import ShopDetailsForm from '../components/ShopDetailsForm'
import { useShopDetails } from '../hooks/useShopDetails'

export default function SettingsPage() {
  const shop = useShopDetails()

  return (
    <>
      <PageHeader title="Settings" />

      <div className="space-y-8 pb-8 pt-5">
        <ItemsSection />

        <section aria-labelledby="shop-heading">
          <SectionHeading id="shop-heading" title="Shop details" />
          <Panel className="py-5">{shop && <ShopDetailsForm initial={shop} />}</Panel>
        </section>

        <section className="px-5 text-base text-gray-600">
          <p>All data is saved on this phone and works without internet. Backup comes in a later update.</p>
          <p className="mt-1">Version {__APP_VERSION__}</p>
        </section>
      </div>
    </>
  )
}
