import { Outlet } from 'react-router-dom'
import BottomTabs from './BottomTabs'

export default function AppLayout() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col print:max-w-none bg-paper font-sans print:bg-white text-lg text-ink">
      <main className="flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom))] print:pb-0">
        <Outlet />
      </main>
      <BottomTabs />
    </div>
  )
}
