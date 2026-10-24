import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api, DEFAULT_SERVICES } from '../lib/api'
import { useCart } from '../context/CartContext'
import { 
  ArrowLeft, 
  Clock, 
  Link2, 
  Sparkles, 
  Tag, 
  CheckCircle2, 
  ShoppingBag, 
  CreditCard,
  Sliders,
  ShieldCheck,
  Video
} from 'lucide-react'
import toast from 'react-hot-toast'

export const LayananDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, applyVoucher, voucher } = useCart()

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)

  // Form states
  const [duration, setDuration] = useState(3)
  const [fileLink, setFileLink] = useState('')
  const [editingStyle, setEditingStyle] = useState('')
  const [voucherInput, setVoucherInput] = useState('')

  useEffect(() => {
    const fetchSvc = async () => {
      const found = await api.getServiceById(id)
      setService(found || DEFAULT_SERVICES[0])
      setLoading(false)
    }
    fetchSvc()
  }, [id])

  if (loading) {
    return (
      <div style={{ paddingTop: 120, textAlign: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Memuat detail layanan...</p>
      </div>
    )
  }

  const pricePerMin = service?.price_per_minute || 10000
  const subtotal = duration * pricePerMin
  const discountPercent = voucher ? voucher.discount_percent : 0
  const discountAmount = Math.round(subtotal * (discountPercent / 100))
  const total = Math.max(0, subtotal - discountAmount)

  const handleApplyVoucher = (e) => {
    e.preventDefault()
    if (!voucherInput.trim()) return
    applyVoucher(voucherInput.trim())
  }

  const handleAddToCart = () => {
    if (!fileLink.trim()) {
      toast.error('Mohon masukkan Link file mentah (Google Drive)')
      return
    }

    addToCart({
      service_id: service.id,
      service_name: service.name,
      category: service.category,
      price_per_minute: pricePerMin,
      duration_minutes: duration,
      file_link: fileLink,
      editing_style: editingStyle
    })
  }

  const handleDirectCheckout = () => {
    if (!fileLink.trim()) {
      toast.error('Mohon masukkan Link file mentah (Google Drive)')
      return
    }

    addToCart({
      service_id: service.id,
      service_name: service.name,
      category: service.category,
      price_per_minute: pricePerMin,
      duration_minutes: duration,
      file_link: fileLink,
      editing_style: editingStyle
    })

    navigate('/cart')
  }

  return (
    <div style={{ paddingTop: 'calc(72px + var(--space-2xl))', paddingBottom: 'var(--space-4xl)' }}>
      <div className="container">
        {/* Breadcrumb (From Wireframe Page 2) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '0.85rem',
          color: 'var(--text-tertiary)',
          marginBottom: 'var(--space-xl)'
        }}>
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>Beranda</Link>
          <span>/</span>
          <Link to="/layanan" style={{ color: 'var(--text-secondary)' }}>Layanan</Link>
          <span>/</span>
          <span style={{ color: 'var(--accent-cyan-light)' }}>{service.name}</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 'var(--space-3xl)',
          alignItems: 'start'
        }}>
          {/* Left Column: Visual Preview & Service Information */}
          <div>
            <div style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              border: '1px solid var(--glass-border)',
              position: 'relative',
              aspectRatio: '16/10',
              marginBottom: 24,
              boxShadow: 'var(--shadow-lg)'
            }}>
              <img 
                src={service.image_url} 
                alt={service.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(10, 10, 20, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                border: '1px solid var(--glass-border)'
              }}>
                Sisa slot bulan ini: {service.slots_remaining}
              </div>
            </div>

            <h1 style={{ fontSize: '2rem', marginBottom: 12 }}>{service.name}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 24 }}>
              {service.description}
            </p>

            {/* Quality Guarantee Box */}
            <div className="card-glass" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <ShieldCheck size={20} color="var(--success)" />
                <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Jaminan AnyReel Creative</h4>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <li>✅ <strong>2x Kesempatan Revisi:</strong> Ajukan perbaikan jika potongan atau efek belum cocok.</li>
                <li>✅ <strong>Pengerjaan 24-48 Jam:</strong> Video kamu siap tayang tepat waktu.</li>
                <li>✅ <strong>Format Siap Upload:</strong> Full HD / 4K dengan kompresi optimal untuk algoritma.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Order Form (From Wireframe Page 2) */}
          <div className="card-glass" style={{
            position: 'sticky',
            top: 96,
            borderColor: 'rgba(124, 58, 237, 0.3)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 6,
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: '1px solid var(--glass-border)'
            }}>
              <span style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--accent-cyan-light)',
                fontFamily: 'var(--font-heading)'
              }}>
                Rp{pricePerMin.toLocaleString('id-ID')}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>/ menit durasi video</span>
            </div>

            {/* 1. Durasi Video */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label className="form-label" style={{ margin: 0 }}>
                  Durasi video (menit)
                </label>
                <span style={{ fontWeight: 700, color: 'var(--accent-violet-light)' }}>
                  {duration} Menit
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input 
                  type="range"
                  min="1"
                  max="30"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  style={{
                    flex: 1,
                    height: 8,
                    borderRadius: 4,
                    background: 'var(--bg-tertiary)',
                    accentColor: 'var(--accent-violet)',
                    cursor: 'pointer'
                  }}
                />
                <input 
                  type="number"
                  min="1"
                  max="120"
                  value={duration}
                  onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
                  className="form-input"
                  style={{ width: 70, textAlign: 'center', padding: '6px 8px' }}
                />
              </div>
              <div className="form-hint">Contoh: video 3 menit = Rp30.000</div>
            </div>

            {/* 2. Link file mentah (Google Drive) */}
            <div className="form-group">
              <label className="form-label">
                Link file mentah (Google Drive) <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Link2 size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-tertiary)' }} />
                <input 
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={fileLink}
                  onChange={(e) => setFileLink(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  required
                />
              </div>
              <div className="form-hint">Pastikan link Google Drive sudah diatur ke 'Siapa saja yang memiliki link dapat melihat/mengunduh'.</div>
            </div>

            {/* 3. Gaya editing yang diinginkan */}
            <div className="form-group">
              <label className="form-label">
                Gaya editing yang diinginkan
              </label>
              <textarea 
                placeholder="Contoh: Potongan cepat ala Alex Hormozi, subtitle kinetic warna kuning-putih, tambahkan sound effect swoosh dan pop..."
                value={editingStyle}
                onChange={(e) => setEditingStyle(e.target.value)}
                className="form-textarea"
                rows={3}
              />
            </div>

            {/* 4. Kode voucher */}
            <div className="form-group">
              <label className="form-label">Kode voucher</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Tag size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-tertiary)' }} />
                  <input 
                    type="text"
                    placeholder="Contoh: WELCOME20"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: 38 }}
                  />
                </div>
                <button 
                  type="button"
                  onClick={handleApplyVoucher}
                  className="btn btn-secondary"
                  style={{ padding: '0 18px' }}
                >
                  Pakai
                </button>
              </div>
              {voucher && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, color: 'var(--success)', fontSize: '0.8rem' }}>
                  <CheckCircle2 size={14} />
                  <span>Voucher aktif: Diskon {voucher.discount_percent}% ({voucher.code})</span>
                </div>
              )}
            </div>

            {/* Price Breakdown (From Wireframe Page 2) */}
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: 'var(--radius-md)',
              padding: 16,
              margin: '20px 0',
              border: '1px solid var(--glass-border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <span>{duration} menit x Rp{pricePerMin.toLocaleString('id-ID')}</span>
                <span style={{ color: 'var(--text-primary)' }}>Rp{subtotal.toLocaleString('id-ID')}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem', color: 'var(--success)' }}>
                  <span>Voucher {voucher.discount_percent}% ({voucher.code})</span>
                  <span>- Rp{discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}

              <div style={{ height: 1, background: 'var(--glass-border)', margin: '10px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 600, fontSize: '1rem' }}>Total</span>
                <span style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-heading)'
                }}>
                  Rp{total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button 
                type="button"
                onClick={handleDirectCheckout}
                className="btn btn-primary btn-full"
                style={{ padding: '14px' }}
              >
                <CreditCard size={18} />
                <span>Lanjut ke Pembayaran</span>
              </button>
              
              <button 
                type="button"
                onClick={handleAddToCart}
                className="btn btn-secondary btn-full"
                style={{ padding: '12px' }}
              >
                <ShoppingBag size={18} />
                <span>Tambah ke Keranjang</span>
              </button>
            </div>

            <div style={{
              marginTop: 16,
              textAlign: 'center',
              color: 'var(--text-tertiary)',
              fontSize: '0.78rem'
            }}>
              Pembayaran lewat Tripay: QRIS, VA BCA/Mandiri, GoPay, ShopeePay, DANA.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
