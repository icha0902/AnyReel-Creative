import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Film, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectPath = location.state?.from || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = await login({ email, password })
      toast.success(`Selamat datang kembali, ${user.full_name || 'Kreator'}! 👋`)
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate(redirectPath)
      }
    } catch (err) {
      toast.error(err.message || 'Gagal masuk. Periksa email dan password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'calc(72px + var(--space-xl)) var(--container-padding) var(--space-2xl)'
    }}>
      <div className="card-glass" style={{
        width: '100%',
        maxWidth: 440,
        padding: 'var(--space-2xl)',
        border: '1px solid rgba(124, 58, 237, 0.3)',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative'
      }}>
        {/* Top Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'var(--accent-gradient)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            boxShadow: '0 0 25px rgba(124, 58, 237, 0.5)'
          }}>
            <Film size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: 4 }}>Masuk ke Akun</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Akses status pesanan dan file video hasil editan
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-tertiary)' }} />
              <input 
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-tertiary)' }} />
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary btn-full"
            style={{ padding: 14, marginTop: 12 }}
          >
            <span>{loading ? 'Memproses...' : 'Masuk ke Dashboard'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Register Footer */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Belum punya akun?{' '}
          <Link to="/register" style={{ color: 'var(--accent-cyan-light)', fontWeight: 600 }}>
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  )
}
