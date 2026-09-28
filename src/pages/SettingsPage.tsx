import PageHeader from '../components/PageHeader'

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" />
      <div className="space-y-3 p-4 text-xl text-gray-700">
        <p>Items, prices, shop name and backup will be added here.</p>
        <p>All data is saved on this phone. It works without internet.</p>
        <p className="text-base text-gray-500">Version {__APP_VERSION__}</p>
      </div>
    </>
  )
}
