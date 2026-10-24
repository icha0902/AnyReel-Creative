import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, DEFAULT_SERVICES } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { 
  ShieldCheck, 
  Users, 
  Film, 
  DollarSign, 
  RotateCcw, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Upload,
  Link2,
  Filter,
  Save,
  MessageCircle,
  Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

export const AdminDashboard = () => {
  const { user, isAdmin } = useAuth()
  const [orders, setOrders] = useState([])
  const [services, setServices] = useState(DEFAULT_SERVICES)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  // Edit states
  const [editingResultId, setEditingResultId] = useState(null)
  const [resultLinkInput, setResultLinkInput] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const allOrders = await api.getOrders()
    const allServices = await api.getServices()
    setOrders(allOrders)
    setServices(allServices)
    setLoading(false)
  }

  // Update status handler
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(o => (o.id === orderId || o.order_number === orderId) ? { ...o, status: newStatus } : o))
      toast.success(`Status pesanan berhasil diperbarui ke '${newStatus}'!`)
    } catch (err) {
      toast.error('Gagal memperbarui status')
    }
  }

  // Upload/Save Result Link
  const handleSaveResult = async (orderId) => {
    if (!resultLinkInput.trim()) {
      toast.error('Masukkan link hasil Google Drive')
      return
    }

    try {
      await api.updateOrderStatus(orderId, 'review', {
        result_link: resultLinkInput.trim()
      })
      setOrders(orders.map(o => (o.id === orderId || o.order_number === orderId) ? { 
        ...o, 
        status: 'review', 
        result_link: resultLinkInput.trim() 
      } : o))
      setEditingResultId(null)
      setResultLinkInput('')
      toast.success('Link hasil editan berhasil dikirim ke pelanggan! 📤')
    } catch (err) {
      toast.error('Gagal menyimpan link hasil')
    }
  }

  // Calculate Metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'pending' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0)

  const activeOrders = orders.filter(o => ['paid', 'editing', 'revising'].includes(o.status))
  const revisionOrders = orders.filter(o => ['revision', 'revising'].includes(o.status))
  const completedOrders = orders.filter(o => o.status === 'done')

  const filteredOrders = filter === 'all' 
    ? orders 
    : filter === 'revision'
      ? orders.filter(o => ['revision', 'revising'].includes(o.status))
      : orders.filter(o => o.status === filter)

  return (
    <div style={{ paddingTop: 'calc(72px + var(--space-2xl))', paddingBottom: 'var(--space-4xl)' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 32
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <ShieldCheck size={22} color="var(--accent-violet-light)" />
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Panel Admin AnyReel</h1>
              <span className="badge badge-popular">Admin Master</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Kelola seluruh alur pesanan, update status pengerjaan, dan tindak lanjuti permintaan revisi
            </p>
          </div>

          <button onClick={loadData} className="btn btn-secondary btn-sm">
            <span>Refresh Data</span>
          </button>
        </div>

        {/* 4 Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 32
        }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: 6 }}>
              <span>Total Pendapatan</span>
              <DollarSign size={16} color="var(--success)" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Rp{totalRevenue.toLocaleString('id-ID')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
              Dari pesanan terkonfirmasi
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: 6 }}>
              <span>Pesanan Aktif</span>
              <Clock size={16} color="var(--accent-cyan)" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan-light)' }}>
              {activeOrders.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
              Sedang dalam proses editing
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: 6 }}>
              <span>Antrean Revisi</span>
              <RotateCcw size={16} color="var(--revision)" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--revision)' }}>
              {revisionOrders.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
              Memerlukan penyesuaian editor
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: 6 }}>
              <span>Pesanan Selesai</span>
              <CheckCircle2 size={16} color="var(--success)" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>
              {completedOrders.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
              Telah disetujui pelanggan
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 20
        }}>
          {[
            { id: 'all', label: `Semua (${orders.length})` },
            { id: 'editing', label: 'Sedang Diedit' },
            { id: 'review', label: 'Hasil Siap' },
            { id: 'revision', label: `Revisi (${revisionOrders.length})` },
            { id: 'done', label: 'Selesai' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: filter === tab.id ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                color: filter === tab.id ? '#fff' : 'var(--text-secondary)',
                border: filter === tab.id ? 'none' : '1px solid var(--glass-border)',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="card-glass" style={{ padding: 0, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '14px 18px', color: 'var(--text-tertiary)', fontWeight: 600 }}>No. Pesanan</th>
                  <th style={{ padding: '14px 18px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Pelanggan</th>
                  <th style={{ padding: '14px 18px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Paket & Durasi</th>
                  <th style={{ padding: '14px 18px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Total</th>
                  <th style={{ padding: '14px 18px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Status Pengerjaan</th>
                  <th style={{ padding: '14px 18px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Link Hasil</th>
                  <th style={{ padding: '14px 18px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: 32, textAlign: 'center', color: 'var(--text-tertiary)' }}>
                      Tidak ada pesanan pada filter ini.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(ord => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      {/* Order Number */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-cyan-light)' }}>
                          #{ord.order_number}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                          Rev: {ord.revision_count || 0}/{ord.max_revisions || 2}
                        </div>
                      </td>

                      {/* Customer */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {ord.user_name || 'Pelanggan'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                          {ord.user_email || 'user@gmail.com'}
                        </div>
                      </td>

                      {/* Package & Duration */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ color: 'var(--text-primary)' }}>{ord.service_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {ord.duration_minutes} Menit
                        </div>
                        {ord.file_link && (
                          <a href={ord.file_link} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', textDecoration: 'underline' }}>
                            File Mentah ↗
                          </a>
                        )}
                      </td>

                      {/* Total */}
                      <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                        Rp{(ord.total || 0).toLocaleString('id-ID')}
                      </td>

                      {/* Status Dropdown */}
                      <td style={{ padding: '14px 18px' }}>
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--glass-border)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pending">Menunggu Bayar</option>
                          <option value="paid">Dibayar</option>
                          <option value="editing">Sedang Diedit</option>
                          <option value="review">Hasil Terkirim</option>
                          <option value="revision">Revisi Diminta</option>
                          <option value="revising">Sedang Direvisi</option>
                          <option value="done">Selesai</option>
                        </select>
                      </td>

                      {/* Result Link */}
                      <td style={{ padding: '14px 18px' }}>
                        {editingResultId === ord.id ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <input 
                              type="url"
                              placeholder="https://drive.google.com/..."
                              value={resultLinkInput}
                              onChange={(e) => setResultLinkInput(e.target.value)}
                              style={{
                                padding: '4px 8px',
                                fontSize: '0.75rem',
                                borderRadius: 4,
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--accent-violet)',
                                color: '#fff',
                                width: 140
                              }}
                            />
                            <button
                              onClick={() => handleSaveResult(ord.id)}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '4px 8px' }}
                            >
                              <Save size={12} />
                            </button>
                          </div>
                        ) : ord.result_link ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <a href={ord.result_link} target="_blank" rel="noreferrer" style={{ color: 'var(--success)', fontSize: '0.8rem', textDecoration: 'underline' }}>
                              Link Terkirim ↗
                            </a>
                            <button 
                              onClick={() => { setEditingResultId(ord.id); setResultLinkInput(ord.result_link); }}
                              style={{ background: 'none', color: 'var(--text-tertiary)', fontSize: '0.7rem' }}
                            >
                              (Ubah)
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingResultId(ord.id); setResultLinkInput(''); }}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                          >
                            <Upload size={12} />
                            <span>Upload Link</span>
                          </button>
                        )}
                      </td>

                      {/* Action */}
                      <td style={{ padding: '14px 18px' }}>
                        <Link 
                          to={`/status/${ord.order_number || ord.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        >
                          Detail ↗
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revision Requests Handling Section */}
        {revisionOrders.length > 0 && (
          <div className="card-glass" style={{ borderColor: 'rgba(249, 115, 22, 0.4)', padding: 24, marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <RotateCcw size={20} color="var(--revision)" />
              <h2 style={{ fontSize: '1.25rem' }}>Antrean Permintaan Revisi Pelanggan ({revisionOrders.length})</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {revisionOrders.map(ro => {
                const latestRev = ro.revisions?.[ro.revisions.length - 1]
                return (
                  <div key={ro.id} style={{
                    background: 'rgba(0,0,0,0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: 16,
                    border: '1px solid rgba(249, 115, 22, 0.2)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--revision)' }}>
                          #{ro.order_number} — Revisi ke-{ro.revision_count || 1}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: 8 }}>
                          {ro.service_name} ({ro.user_name || ro.user_email})
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {ro.status === 'revision' && (
                          <button
                            onClick={() => handleStatusChange(ro.id, 'revising')}
                            className="btn btn-warning btn-sm"
                          >
                            <span>Mulai Revisi</span>
                          </button>
                        )}
                        <button
                          onClick={() => { setEditingResultId(ro.id); setResultLinkInput(''); }}
                          className="btn btn-success btn-sm"
                        >
                          <span>Kirim Hasil Revisi Baru</span>
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 8, fontStyle: 'italic' }}>
                      "{latestRev?.notes || 'Mohon periksa potongan transisi dan musik latar'}"
                    </div>

                    {latestRev?.sections_to_fix && latestRev.sections_to_fix.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {latestRev.sections_to_fix.map((sec, idx) => (
                          <span key={idx} style={{
                            fontSize: '0.72rem',
                            padding: '3px 8px',
                            borderRadius: 4,
                            background: 'rgba(249, 115, 22, 0.15)',
                            color: 'var(--revision)'
                          }}>
                            {sec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Service Slot Management */}
        <div className="card-glass" style={{ padding: 24 }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 16 }}>Kelola Slot Layanan Bulanan</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {services.map(svc => (
              <div key={svc.id} className="card" style={{ padding: 16 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{svc.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                  Harga: Rp{svc.price_per_minute.toLocaleString('id-ID')}/menit
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Sisa Slot:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => {
                        const updated = services.map(s => s.id === svc.id ? { ...s, slots_remaining: Math.max(0, s.slots_remaining - 1) } : s)
                        setServices(updated)
                        toast.success('Slot dikurangi')
                      }}
                      style={{ width: 26, height: 26, borderRadius: 4, background: 'var(--glass-bg)', color: '#fff' }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 700, minWidth: 30, textAlign: 'center' }}>{svc.slots_remaining}</span>
                    <button
                      onClick={() => {
                        const updated = services.map(s => s.id === svc.id ? { ...s, slots_remaining: s.slots_remaining + 1 } : s)
                        setServices(updated)
                        toast.success('Slot ditambah')
                      }}
                      style={{ width: 26, height: 26, borderRadius: 4, background: 'var(--glass-bg)', color: '#fff' }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
