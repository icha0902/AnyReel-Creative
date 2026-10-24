import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Film, Mail, Lock, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password.length < 6) {
      toast.error('Password minimal 6 karakter')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok!')
      return
    }

    setLoading(true)

    try {
      const user = await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        phone: formData.phone
      })

      toast.success('Akun berhasil dibuat! Selamat datang di AnyReel 🎉')
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      toast.error(err.message || 'Gagal mendaftar. Silakan coba lagi.')
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
        maxWidth: 480,
        padding: 'var(--space-2xl)',
        border: '1px solid rgba(124, 58, 237, 0.3)',
        boxShadow: 'var(--shadow-xl)'
      }}>
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
          <h1 style={{ fontSize: '1.6rem', marginBottom: 4 }}>Daftar Akun Baru</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            1 Email = 1 Akun untuk kemudahan tracking pesanan
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-tertiary)' }} />
              <input 
                type="text"
                required
                placeholder="Nama Anda atau Channel Kreator"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="form-input"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email (1 Email = 1 Akun)</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-tertiary)' }} />
              <input 
                type="email"
                required
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nomor WhatsApp</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-tertiary)' }} />
              <input 
                type="tel"
                placeholder="081234567890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
                style={{ paddingLeft: 38 }}
              />
            </div>
            <div className="form-hint">Digunakan untuk notifikasi saat video selesai diedit</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-tertiary)' }} />
                <input 
                  type="password"
                  required
                  placeholder="Min 6 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Ulangi Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-tertiary)' }} />
                <input 
                  type="password"
                  required
                  placeholder="Konfirmasi"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary btn-full"
            style={{ padding: 14, marginTop: 12 }}
          >
            <span>{loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Sudah punya akun?{' '}
          <Link to="/login" style={{ color: 'var(--accent-cyan-light)', fontWeight: 600 }}>
            Masuk di Sini
          </Link>
        </div>
      </div>
    </div>
  )
}
