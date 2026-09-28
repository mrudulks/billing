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
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-gray-300 bg-white pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto grid max-w-xl grid-cols-4">
        {tabs.map((tab) => (
          <li key={tab.to}>
            <NavLink
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex min-h-16 flex-col items-center justify-center gap-0.5 text-base font-semibold ${
                  isActive ? 'bg-green-900 text-white' : 'text-gray-700 active:bg-gray-200'
                }`
              }
            >
              <TabIcon name={tab.icon} />
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
