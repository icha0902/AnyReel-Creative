import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Layanan } from './pages/Layanan'
import { LayananDetail } from './pages/LayananDetail'
import { Kontak } from './pages/Kontak'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Cart } from './pages/Cart'
import { Payment } from './pages/Payment'
import { OrderStatus } from './pages/OrderStatus'
import { RevisionRequest } from './pages/RevisionRequest'
import { UserDashboard } from './pages/UserDashboard'
import { AdminDashboard } from './pages/AdminDashboard'
import { useAuth } from './context/AuthContext'

// Protected Route for authenticated users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

// Protected Route for Admin only
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

export function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '0.88rem'
          },
          success: {
            iconTheme: {
              primary: 'var(--success)',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: 'var(--error)',
              secondary: '#fff'
            }
          }
        }}
      />

      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Pages */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="layanan" element={<Layanan />} />
          <Route path="layanan/:id" element={<LayananDetail />} />
          <Route path="kontak" element={<Kontak />} />

          {/* Auth Pages */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* E-Commerce Flow */}
          <Route path="cart" element={<Cart />} />
          <Route path="payment/:id" element={<Payment />} />
          <Route path="status/:id" element={<OrderStatus />} />
          <Route path="order/:id/revision" element={<RevisionRequest />} />

          {/* User Dashboard */}
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Admin Dashboard */}
          <Route 
            path="admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
