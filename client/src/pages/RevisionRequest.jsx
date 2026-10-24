import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { 
  RotateCcw, 
  ArrowLeft, 
  CheckSquare, 
  MessageCircle, 
  Send, 
  Link2, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

export const RevisionRequest = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form states
  const [notes, setNotes] = useState('')
  const [sections, setSections] = useState([])
  const [referenceLink, setReferenceLink] = useState('')

  useEffect(() => {
    api.getOrderById(id).then(res => {
      setOrder(res)
      setLoading(false)
    })
  }, [id])

  const toggleSection = (item) => {
    if (sections.includes(item)) {
      setSections(sections.filter(s => s !== item))
    } else {
      setSections([...sections, item])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!notes.trim()) {
      toast.error('Mohon jelaskan catatan bagian mana yang perlu diperbaiki')
      return
    }

    setSubmitting(true)
    try {
      await api.requestRevision(order.id, {
        notes,
        sections_to_fix: sections,
        reference_link: referenceLink
      })

      toast.success('Permintaan revisi berhasil dikirim! Tim editor akan segera menindaklanjuti. 🚀')
      navigate(`/status/${order.order_number || order.id}`)
    } catch (err) {
      toast.error(err.message || 'Gagal mengajukan revisi')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ paddingTop: 120, textAlign: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Memuat data pesanan...</p>
      </div>
    )
  }

  const currentRev = (order?.revision_count || 0) + 1
  const maxRev = order?.max_revisions || 2
  const isLimitReached = (order?.revision_count || 0) >= maxRev

  return (
    <div style={{ paddingTop: 'calc(72px + var(--space-2xl))', paddingBottom: 'var(--space-4xl)' }}>
      <div className="container" style={{ maxWidth: 640 }}>
        {/* Back Link */}
        <div style={{ marginBottom: 20 }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Status Pesanan</span>
          </button>
        </div>

        <div className="card-glass" style={{
          padding: 'var(--space-2xl)',
          borderColor: 'rgba(249, 115, 22, 0.3)',
          boxShadow: 'var(--shadow-xl)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(249, 115, 22, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--revision)'
            }}>
              <RotateCcw size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', marginBottom: 2 }}>
                Permintaan Revisi Video
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Pesanan #{order?.order_number} • {order?.service_name}
              </p>
            </div>
          </div>

          {/* Revision quota alert */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: isLimitReached ? 'rgba(239, 68, 68, 0.1)' : 'rgba(249, 115, 22, 0.1)',
            border: isLimitReached ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(249, 115, 22, 0.3)',
            marginBottom: 24,
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={18} color={isLimitReached ? 'var(--error)' : 'var(--revision)'} />
              <span>
                {isLimitReached ? (
                  <strong>Batas maksimal revisi (2x) telah tercapai.</strong>
                ) : (
                  <span>Mengajukan <strong>Revisi ke-{currentRev}</strong> dari maksimal {maxRev}x revisi gratis.</span>
                )}
              </span>
            </div>
          </div>

          {isLimitReached ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: '0.9rem' }}>
                Untuk penyesuaian tambahan di luar batas revisi gratis, silakan diskusikan langsung bersama editor kami via WhatsApp.
              </p>
              <a 
                href={`https://wa.me/6281234567890?text=Halo%20AnyReel,%20saya%20ingin%20revisi%20tambahan%20untuk%20pesanan%20%23${order.order_number}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                <MessageCircle size={18} />
                <span>Diskusi Tambahan via WhatsApp</span>
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Checkboxes: Bagian yang Perlu Diperbaiki */}
              <div className="form-group">
                <label className="form-label">
                  Pilih Bagian yang Perlu Diperbaiki:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {[
                    'Transisi & Cutting',
                    'Musik / Sound Effects',
                    'Warna / Color Grading',
                    'Teks & Subtitle',
                    'Pacing / Kecepatan',
                    'Audio / Volume Suara'
                  ].map(sec => {
                    const isChecked = sections.includes(sec)
                    return (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => toggleSection(sec)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.82rem',
                          fontWeight: 500,
                          background: isChecked ? 'rgba(249, 115, 22, 0.2)' : 'var(--glass-bg)',
                          border: isChecked ? '1px solid var(--revision)' : '1px solid var(--glass-border)',
                          color: isChecked ? 'var(--revision)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          transition: '0.2s'
                        }}
                      >
                        {isChecked ? '✓ ' : '+ '}{sec}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Textarea: Catatan Rinci */}
              <div className="form-group">
                <label className="form-label">
                  Catatan Revisi Rinci <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Contoh: Pada menit 00:15 transisi terlalu lambat, ganti dengan zoom cut. Subtitle pada menit 00:30 ada salah ketik kata 'efektif'. Musik latar mohon diturunkan 20% saat suara vokal bicara..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-textarea"
                />
                <div className="form-hint">
                  Sertakan timestamp (menit/detik) jika ada bagian tertentu yang ingin diubah.
                </div>
              </div>

              {/* Reference Link */}
              <div className="form-group">
                <label className="form-label">
                  Link Contoh / Referensi Tambahan (Opsional)
                </label>
                <div style={{ position: 'relative' }}>
                  <Link2 size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-tertiary)' }} />
                  <input 
                    type="url"
                    placeholder="Link video Instagram/TikTok/Google Drive contoh gaya yang diinginkan"
                    value={referenceLink}
                    onChange={(e) => setReferenceLink(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: 38 }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={submitting}
                className="btn btn-warning btn-full"
                style={{ padding: 14, marginTop: 12 }}
              >
                <Send size={18} />
                <span>{submitting ? 'Mengirim...' : `Kirim Permintaan Revisi ke-${currentRev}`}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
