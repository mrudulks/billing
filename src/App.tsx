import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import BillsPage from './pages/BillsPage'
import CustomerDetailPage from './pages/CustomerDetailPage'
import CustomersPage from './pages/CustomersPage'
import EditCustomerPage from './pages/EditCustomerPage'
import EntryPage from './pages/EntryPage'
import NewCustomerPage from './pages/NewCustomerPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<EntryPage />} />
        <Route path="bills" element={<BillsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/new" element={<NewCustomerPage />} />
        <Route path="customers/:id" element={<CustomerDetailPage />} />
        <Route path="customers/:id/edit" element={<EditCustomerPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
