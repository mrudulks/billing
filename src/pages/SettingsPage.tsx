import ItemsSection from '../components/ItemsSection'
import PageHeader from '../components/PageHeader'
import ShopDetailsForm from '../components/ShopDetailsForm'
import { useShopDetails } from '../hooks/useShopDetails'

export default function SettingsPage() {
  const shop = useShopDetails()

  return (
    <>
      <PageHeader title="Settings" />

      <div className="space-y-10 pb-8 pt-5">
        <ItemsSection />

        <section aria-labelledby="shop-heading">
          <h2 id="shop-heading" className="px-4 pb-3 text-xl font-bold text-ink">
            Shop details
          </h2>
          {shop && <ShopDetailsForm initial={shop} />}
        </section>

        <section className="px-4 text-base text-gray-600">
          <p>All data is saved on this phone and works without internet. Backup comes in a later update.</p>
          <p className="mt-1">Version {__APP_VERSION__}</p>
        </section>
      </div>
    </>
  )
}
