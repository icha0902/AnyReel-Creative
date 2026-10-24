import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import { 
  User, 
  Film, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  PlusCircle, 
  ShoppingBag,
  ExternalLink,
  MessageCircle
} from 'lucide-react'

export const UserDashboard = () => {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await api.getOrders(user?.id)
      setOrders(data)
      setLoading(false)
    }
    fetchOrders()
  }, [user])

  const activeOrders = orders.filter(o => o.status !== 'done' && o.status !== 'cancelled')
  const completedOrders = orders.filter(o => o.status === 'done')

  return (
    <div style={{ paddingTop: 'calc(72px + var(--space-2xl))', paddingBottom: 'var(--space-4xl)' }}>
      <div className="container">
        {/* Profile Card Header */}
        <div className="card-glass" style={{
          padding: '28px',
          marginBottom: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#fff',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)'
            }}>
              {(user?.full_name || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                  {user?.full_name || 'Kreator AnyReel'}
                </h1>
                <span className="badge badge-popular">Kreator Member</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                {user?.email} • {user?.phone || 'No WhatsApp terdaftar'}
              </p>
            </div>
          </div>

          <Link to="/layanan" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Pesan Video Baru</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32
        }}>
          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Total Pesanan</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {orders.length}
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Sedang Dikerjakan</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan-light)' }}>
              {activeOrders.length}
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Pesanan Selesai</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)' }}>
              {completedOrders.length}
            </div>
          </div>
        </div>

        {/* Orders List Section */}
        <div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: 16 }}>Daftar Pesanan Saya</h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
              Memuat pesanan...
            </div>
          ) : orders.length === 0 ? (
            <div className="card-glass" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Film size={40} color="var(--text-tertiary)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: 6 }}>Belum Ada Pesanan</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
                Mulai ubah footage mentahmu menjadi video viral dengan AnyReel Creative.
              </p>
              <Link to="/layanan" className="btn btn-primary">
                <span>Pilih Paket Layanan</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {orders.map((ord) => (
                <div key={ord.id} className="card-glass" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 16,
                  padding: '18px 24px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem', color: 'var(--accent-cyan-light)' }}>
                        #{ord.order_number}
                      </span>
                      <span className={`badge ${
                        ord.status === 'done' ? 'badge-success' :
                        ord.status === 'review' ? 'badge-info' :
                        ord.status === 'revision' || ord.status === 'revising' ? 'badge-warning' :
                        'badge-popular'
                      }`}>
                        {ord.status === 'pending' && 'Menunggu Bayar'}
                        {ord.status === 'paid' && 'Dibayar'}
                        {ord.status === 'editing' && 'Sedang Diedit 🎬'}
                        {ord.status === 'review' && 'Hasil Siap 📤'}
                        {ord.status === 'revision' && 'Revisi Diminta 🔄'}
                        {ord.status === 'revising' && 'Sedang Direvisi 🛠️'}
                        {ord.status === 'done' && 'Selesai ✅'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {ord.service_name} • {ord.duration_minutes} Menit
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                      Dibuat pada {new Date(ord.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Rp{(ord.total || 0).toLocaleString('id-ID')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        Revisi: {ord.revision_count || 0}/{ord.max_revisions || 2}
                      </div>
                    </div>

                    <Link 
                      to={`/status/${ord.order_number || ord.id}`}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '8px 16px' }}
                    >
                      <span>Lihat Status</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
