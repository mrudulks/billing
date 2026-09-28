import { NavLink } from 'react-router-dom'
import TabIcon, { type TabIconName } from './TabIcon'

const tabs: { to: string; label: string; icon: TabIconName }[] = [
  { to: '/', label: 'Entry', icon: 'entry' },
  { to: '/bills', label: 'Bills', icon: 'bills' },
  { to: '/customers', label: 'Customers', icon: 'customers' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

export default function BottomTabs() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/5 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_rgba(23,32,26,0.06)] print:hidden">
      <ul className="mx-auto grid max-w-xl grid-cols-4">
        {tabs.map((tab) => (
          <li key={tab.to}>
            <NavLink
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `group flex min-h-[4.5rem] flex-col items-center justify-center gap-1 text-[0.95rem] ${
                  isActive ? 'font-bold text-leaf-800' : 'font-medium text-gray-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-9 w-16 items-center justify-center rounded-full ${
                      isActive ? 'bg-leaf-100' : 'group-active:bg-gray-100'
                    }`}
                  >
                    <TabIcon name={tab.icon} />
                  </span>
                  {tab.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
