import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { 
  CheckCircle2, 
  Clock, 
  Film, 
  Download, 
  RotateCcw, 
  MessageCircle, 
  ExternalLink,
  ChevronRight,
  AlertCircle,
  FileCheck2,
  Sparkles,
  Link2
} from 'lucide-react'
import toast from 'react-hot-toast'

export const OrderStatus = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      const ord = await api.getOrderById(id)
      if (ord) {
        setOrder(ord)
      } else {
        // Fallback demo order
        setOrder({
          id: id,
          order_number: id.startsWith('AR-') ? id : 'AR-0001',
          service_name: 'Paket Reels & TikTok Editing',
          duration_minutes: 3,
          total: 24000,
          status: 'editing', // pending, paid, editing, review, revision, revising, done
          file_link: 'https://drive.google.com/drive/folders/demo-raw-footage',
          editing_style: 'Potongan cepat tempo tinggi, sound effect pop, subtitle kinetic',
          created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
          paid_at: new Date(Date.now() - 3600000 * 20).toISOString(),
          result_link: 'https://drive.google.com/drive/folders/demo-final-result',
          revision_count: 0,
          max_revisions: 2,
          revisions: []
        })
      }
      setLoading(false)
    }
    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div style={{ paddingTop: 120, textAlign: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Memuat status pengerjaan pesanan...</p>
      </div>
    )
  }

  // Determine current timeline active index
  // 0: Dibayar
  // 1: Sedang Diedit
  // 2: Hasil Terkirim
  // 3: Revisi (if applicable)
  // 4: Selesai
  const getStepIndex = (status) => {
    switch (status) {
      case 'pending': return 0
      case 'paid': return 1
      case 'editing': return 2
      case 'review': return 3
      case 'revision':
      case 'revising': return 4
      case 'done': return 5
      default: return 1
    }
  }

  const currentStep = getStepIndex(order.status)
  const hasRevisions = (order.revisions && order.revisions.length > 0) || order.status === 'revision' || order.status === 'revising'

  // Timeline steps
  const timelineSteps = [
    {
      id: 'paid',
      title: 'Dibayar',
      desc: 'Pembayaran diterima',
      time: order.paid_at ? new Date(order.paid_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Selesai'
    },
    {
      id: 'editing',
      title: 'Sedang diedit',
      desc: 'Estimasi: 24-48 Jam',
      time: order.status === 'editing' ? 'Sedang berlangsung' : ''
    },
    {
      id: 'review',
      title: 'Hasil terkirim',
      desc: 'Link unduh dikirim',
      time: order.result_link ? 'Tersedia' : ''
    },
    ...(hasRevisions ? [
      {
        id: 'revision',
        title: 'Revisi Diminta',
        desc: `Revisi ke-${order.revision_count || 1} sedang diproses`,
        time: order.status === 'revising' ? 'Dalam pengerjaan' : ''
      }
    ] : []),
    {
      id: 'done',
      title: 'Selesai',
      desc: 'Pesanan disetujui & ditutup',
      time: order.status === 'done' ? 'Tutup' : ''
    }
  ]

  const handleApprove = async () => {
    try {
      await api.completeOrder(order.id)
      setOrder({ ...order, status: 'done' })
      toast.success('Pesanan selesai! Terima kasih atas kerjasamanya 🎉')
    } catch (err) {
      toast.error('Gagal menyelesaikan pesanan')
    }
  }

  return (
    <div style={{ paddingTop: 'calc(72px + var(--space-2xl))', paddingBottom: 'var(--space-4xl)' }}>
      <div className="container" style={{ maxWidth: 760 }}>
        {/* Header Breadcrumb & Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <span>← Kembali ke Dashboard</span>
          </Link>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className={`badge ${
              order.status === 'done' ? 'badge-success' :
              order.status === 'review' ? 'badge-info' :
              order.status === 'revision' || order.status === 'revising' ? 'badge-warning' :
              'badge-popular'
            }`}>
              {order.status === 'pending' && 'Menunggu Bayar'}
              {order.status === 'paid' && 'Dibayar'}
              {order.status === 'editing' && 'Sedang Diedit 🎬'}
              {order.status === 'review' && 'Hasil Terkirim 📤'}
              {order.status === 'revision' && 'Revisi Diminta 🔄'}
              {order.status === 'revising' && 'Sedang Direvisi 🛠️'}
              {order.status === 'done' && 'Selesai ✅'}
            </span>
            <span className="badge badge-slot">
              Revisi: {order.revision_count || 0}/{order.max_revisions || 2}
            </span>
          </div>
        </div>

        {/* Order Details Header (From Wireframe Page 4) */}
        <div className="card-glass" style={{ marginBottom: 24, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 2 }}>
                Pesanan Saya
              </div>
              <h1 style={{ fontSize: '1.6rem', marginBottom: 6 }}>
                Pesanan #{order.order_number}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {order.service_name} • {order.duration_minutes} menit • <strong>Rp{(order.total || 0).toLocaleString('id-ID')}</strong>
              </p>
            </div>

            <a 
              href={`https://wa.me/6281234567890?text=Halo%20AnyReel,%20saya%20mau%20tanya%20status%20pesanan%20%23${order.order_number}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: 'var(--success)' }}
            >
              <MessageCircle size={16} />
              <span>Chat WhatsApp</span>
            </a>
          </div>

          {/* Raw Footage Link */}
          {order.file_link && (
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
              <Link2 size={16} color="var(--accent-cyan)" />
              <span style={{ color: 'var(--text-secondary)' }}>File Mentah:</span>
              <a href={order.file_link} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan-light)', textDecoration: 'underline' }}>
                Google Drive
              </a>
            </div>
          )}
        </div>

        {/* Visual Stepper Timeline (From Wireframe Page 4 & 5) */}
        <div className="card-glass" style={{ marginBottom: 24, padding: '28px 24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: 24 }}>Timeline Status Pengerjaan</h3>

          <div style={{ position: 'relative' }}>
            {timelineSteps.map((step, idx) => {
              const isPast = idx < currentStep
              const isCurrent = idx === currentStep || (idx === timelineSteps.length - 1 && order.status === 'done')

              return (
                <div key={idx} style={{
                  display: 'flex',
                  gap: 20,
                  position: 'relative',
                  paddingBottom: idx === timelineSteps.length - 1 ? 0 : 32
                }}>
                  {/* Connecting Line */}
                  {idx < timelineSteps.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      left: 18,
                      top: 36,
                      bottom: 0,
                      width: 2,
                      background: isPast ? 'var(--accent-violet)' : 'var(--glass-border)'
                    }} />
                  )}

                  {/* Step Dot */}
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: isCurrent 
                      ? 'var(--accent-gradient)' 
                      : isPast 
                        ? 'rgba(16, 185, 129, 0.2)' 
                        : 'var(--glass-bg)',
                    border: isCurrent 
                      ? '2px solid #fff' 
                      : isPast 
                        ? '1px solid var(--success)' 
                        : '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isPast ? 'var(--success)' : '#fff',
                    fontWeight: 700,
                    zIndex: 2,
                    boxShadow: isCurrent ? '0 0 20px rgba(124, 58, 237, 0.5)' : 'none',
                    flexShrink: 0
                  }}>
                    {isPast ? <CheckCircle2 size={20} /> : idx + 1}
                  </div>

                  {/* Step Info */}
                  <div style={{ flex: 1, paddingTop: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{
                        fontSize: '1rem',
                        color: isCurrent ? 'var(--text-primary)' : isPast ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                        fontWeight: isCurrent ? 700 : 500
                      }}>
                        {step.title}
                      </h4>
                      {step.time && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                          {step.time}
                        </span>
                      )}
                    </div>
                    <p style={{
                      color: isCurrent ? 'var(--accent-cyan-light)' : 'var(--text-tertiary)',
                      fontSize: '0.85rem',
                      marginTop: 2
                    }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Result & Revision Area (From Wireframe Page 5) ── */}
        {(order.status === 'review' || order.status === 'revision' || order.status === 'revising' || order.status === 'done') && (
          <div className="card-glass" style={{
            padding: '24px',
            marginBottom: 24,
            borderColor: 'rgba(6, 182, 212, 0.4)',
            boxShadow: '0 8px 32px rgba(6, 182, 212, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Sparkles size={20} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.25rem' }}>Hasil Editan Video Kamu Siap</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
              Video pesanan <strong>#{order.order_number}</strong> sudah selesai diedit oleh tim AnyReel Creative. Tinjau hasil dan simpan file sebelum link kedaluwarsa.
            </p>

            {/* Video Mockup Preview */}
            <div style={{
              aspectRatio: '16/9',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: 20,
              background: '#000',
              position: 'relative',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1000&auto=format&fit=crop&q=80" 
                alt="Video Result Preview" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
              />
              <div style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                padding: '12px 24px',
                borderRadius: 999
              }}>
                <Film size={24} color="var(--accent-cyan-light)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Pratinjau Video Hasil Editing (Full HD)</span>
              </div>
            </div>

            {/* Download Link Notice */}
            <div style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: 12,
              marginBottom: 20,
              fontSize: '0.82rem',
              color: 'var(--text-secondary)'
            }}>
              ⚠️ Link unduh aktif selama 14 hari. Silakan segera simpan filenya ke penyimpanan lokal Anda.
            </div>

            {/* Action Buttons: Unduh, Minta Revisi, Setujui */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {/* Unduh Link */}
              <a 
                href={order.result_link || 'https://drive.google.com'} 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-primary"
                style={{ padding: 14 }}
              >
                <Download size={18} />
                <span>Unduh Hasil (Google Drive)</span>
              </a>

              {/* Minta Revisi (Feature Requirement #2) */}
              {order.status !== 'done' && (
                <button
                  type="button"
                  onClick={() => navigate(`/order/${order.id}/revision`)}
                  disabled={(order.revision_count || 0) >= (order.max_revisions || 2)}
                  className="btn btn-warning"
                  style={{ padding: 14 }}
                >
                  <RotateCcw size={18} />
                  <span>
                    {(order.revision_count || 0) >= (order.max_revisions || 2)
                      ? 'Batas Revisi Habis (2/2)' 
                      : `Minta Revisi (${order.revision_count || 0}/2)`}
                  </span>
                </button>
              )}

              {/* Setujui & Selesaikan */}
              {order.status !== 'done' && (
                <button
                  type="button"
                  onClick={handleApprove}
                  className="btn btn-success"
                  style={{ padding: 14 }}
                >
                  <CheckCircle2 size={18} />
                  <span>Setuju & Selesaikan</span>
                </button>
              )}
            </div>

            {/* Revisions History Panel */}
            {order.revisions && order.revisions.length > 0 && (
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--glass-border)' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: 12, color: 'var(--text-secondary)' }}>
                  Riwayat Permintaan Revisi:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {order.revisions.map((rev, rIdx) => (
                    <div key={rIdx} style={{
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: 'var(--radius-md)',
                      padding: 12,
                      border: '1px solid rgba(249, 115, 22, 0.2)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--revision)', fontWeight: 700 }}>
                          Revisi #{rev.revision_number}
                        </span>
                        <span style={{ color: 'var(--text-tertiary)' }}>
                          {new Date(rev.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 6 }}>
                        "{rev.notes}"
                      </p>
                      {rev.sections_to_fix && rev.sections_to_fix.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {rev.sections_to_fix.map((sec, sIdx) => (
                            <span key={sIdx} style={{
                              fontSize: '0.72rem',
                              padding: '2px 8px',
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
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Admin Dev Helper to quick toggle status for demo */}
        <div className="card-glass" style={{ padding: 16, background: 'rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🛠️ Demo Fast-Forward Status (Uji Coba Alur):</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[
              { id: 'editing', label: '1. Sedang Diedit' },
              { id: 'review', label: '2. Hasil Terkirim' },
              { id: 'revising', label: '3. Sedang Direvisi' },
              { id: 'done', label: '4. Selesai' }
            ].map(st => (
              <button
                key={st.id}
                onClick={async () => {
                  const updated = await api.updateOrderStatus(order.id, st.id, {
                    result_link: 'https://drive.google.com/drive/folders/anyreel-demo-final-result'
                  })
                  setOrder({ ...order, status: st.id, result_link: 'https://drive.google.com/drive/folders/anyreel-demo-final-result' })
                  toast.success(`Status diubah ke ${st.label}`)
                }}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
