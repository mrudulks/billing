import { Outlet } from 'react-router-dom'
import BottomTabs from './BottomTabs'

export default function AppLayout() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col bg-white text-lg text-gray-900">
      <main className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>
      <BottomTabs />
    </div>
  )
}
