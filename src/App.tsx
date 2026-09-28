import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import BillsPage from './pages/BillsPage'
import CustomersPage from './pages/CustomersPage'
import EntryPage from './pages/EntryPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<EntryPage />} />
        <Route path="bills" element={<BillsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
