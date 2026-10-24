import { useState } from 'react'
import { Calculator, Tag, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export const PriceCalculator = ({ initialService = null, onSelectPlan = null }) => {
  const [duration, setDuration] = useState(3)
  const [selectedService, setSelectedService] = useState(initialService || 'svc-reels-tiktok')
  const [voucherCode, setVoucherCode] = useState('')
  const [appliedVoucher, setAppliedVoucher] = useState(null)
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const services = [
    { id: 'svc-reels-tiktok', name: 'Paket Reels & TikTok Editing', price: 10000, max: 10 },
    { id: 'svc-youtube', name: 'Paket YouTube Editing', price: 10000, max: 60 },
    { id: 'svc-commercial', name: 'Paket Commercial Ads Editing', price: 10000, max: 15 }
  ]

  const currentService = services.find(s => s.id === selectedService) || services[0]
  const pricePerMin = currentService.price
  const subtotal = duration * pricePerMin
  const discount = appliedVoucher ? Math.round(subtotal * (appliedVoucher.discount_percent / 100)) : 0
  const total = Math.max(0, subtotal - discount)

  const handleApplyVoucher = (e) => {
    e.preventDefault()
    const code = voucherCode.trim().toUpperCase()
    if (code === 'WELCOME20') {
      setAppliedVoucher({
        code: 'WELCOME20',
        discount_percent: 20,
        description: 'Diskon 20% Pesanan Pertama'
      })
      toast.success('Voucher WELCOME20 berhasil dipakai! Hemat 20% 🎉')
    } else if (code) {
      toast.error('Kode voucher tidak valid atau kedaluwarsa')
    }
  }

  const handleContinue = () => {
    const item = {
      service_id: currentService.id,
      service_name: currentService.name,
      duration_minutes: duration,
      price_per_minute: pricePerMin
    }
    addToCart(item)
    if (onSelectPlan) {
      onSelectPlan(item)
    } else {
      navigate('/cart')
    }
  }

  return (
    <div className="card-glass" style={{
      maxWidth: 580,
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(124, 58, 237, 0.3)',
      boxShadow: 'var(--shadow-xl)'
    }}>
      {/* Decorative gradient top bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: 'var(--accent-gradient)'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'var(--accent-gradient-soft)',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-violet-light)'
        }}>
          <Calculator size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 2 }}>Kalkulator Harga Estimasi</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Transparan: Rp10.000 / menit durasi video jadi
          </p>
        </div>
      </div>

      {/* Select Service */}
      <div className="form-group">
        <label className="form-label">Pilih Paket Layanan</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
          {services.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedService(s.id)}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textAlign: 'center',
                background: selectedService === s.id ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                color: selectedService === s.id ? '#fff' : 'var(--text-secondary)',
                border: selectedService === s.id ? 'none' : '1px solid var(--glass-border)',
                transition: '0.2s',
                boxShadow: selectedService === s.id ? '0 0 20px rgba(124, 58, 237, 0.3)' : 'none'
              }}
            >
              {s.name.replace('Paket ', '').replace(' Editing', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Duration Slider + Input */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label className="form-label" style={{ margin: 0 }}>Durasi Video Jadi (Menit)</label>
          <span style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--accent-cyan-light)',
            fontFamily: 'var(--font-heading)'
          }}>
            {duration} Menit
          </span>
        </div>
        <input 
          type="range"
          min="1"
          max={currentService.max}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          style={{
            width: '100%',
            height: 8,
            borderRadius: 4,
            background: 'var(--bg-tertiary)',
            accentColor: 'var(--accent-violet)',
            cursor: 'pointer'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          <span>1 Menit</span>
          <span>Max {currentService.max} Menit</span>
        </div>
      </div>

      {/* Voucher Input */}
      <div className="form-group">
        <label className="form-label">Kode Voucher (Opsional)</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Tag size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-tertiary)' }} />
            <input 
              type="text"
              placeholder="Coba: WELCOME20"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
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
            Terapkan
          </button>
        </div>
        {appliedVoucher && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, color: 'var(--success)', fontSize: '0.8rem' }}>
            <CheckCircle2 size={14} />
            <span>Voucher aktif: Hemat 20% (WELCOME20)</span>
          </div>
        )}
      </div>

      {/* Price Summary Breakdown */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        margin: '16px 0',
        border: '1px solid var(--glass-border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          <span>{duration} menit x Rp{pricePerMin.toLocaleString('id-ID')}</span>
          <span style={{ color: 'var(--text-primary)' }}>Rp{subtotal.toLocaleString('id-ID')}</span>
        </div>

        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem', color: 'var(--success)' }}>
            <span>Diskon Voucher ({appliedVoucher.discount_percent}%)</span>
            <span>- Rp{discount.toLocaleString('id-ID')}</span>
          </div>
        )}

        <div style={{ height: 1, background: 'var(--glass-border)', margin: '10px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Estimasi</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              Rp{total.toLocaleString('id-ID')}
            </div>
          </div>
          <button 
            type="button"
            onClick={handleContinue}
            className="btn btn-primary"
            style={{ padding: '12px 20px' }}
          >
            <span>Pesan Sekarang</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
        <Sparkles size={12} color="var(--accent-cyan)" />
        <span>Garansi 2x revisi gratis & pengerjaan cepat 24-48 jam</span>
      </div>
    </div>
  )
}
