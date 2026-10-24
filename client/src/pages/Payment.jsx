import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { api } from '../lib/api'
import { 
  QrCode, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  Copy, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  Smartphone
} from 'lucide-react'
import toast from 'react-hot-toast'

export const Payment = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!order)
  const [selectedMethod, setSelectedMethod] = useState('qris')
  const [timeLeft, setTimeLeft] = useState(24 * 60) // 24 minutes countdown

  useEffect(() => {
    if (!order) {
      api.getOrderById(id).then(res => {
        if (res) {
          setOrder(res)
        } else {
          // Mock order for preview
          setOrder({
            id: 'ord-preview',
            order_number: id || 'AR-0001',
            service_name: 'Paket Reels & TikTok Editing',
            duration_minutes: 3,
            total: 24000,
            status: 'pending'
          })
        }
        setLoading(false)
      })
    }
  }, [id, order])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} berhasil disalin! 📋`)
  }

  // Simulate payment confirmation
  const handleSimulatePayment = async () => {
    try {
      const updated = await api.updateOrderStatus(order.id, 'paid', {
        paid_at: new Date().toISOString(),
        payment_method: selectedMethod.toUpperCase()
      })
      toast.success('Pembayaran Berhasil Dikonfirmasi! 🎉')
      navigate(`/status/${order.order_number || order.id}`)
    } catch (err) {
      toast.error('Gagal memproses pembayaran')
    }
  }

  if (loading) {
    return (
      <div style={{ paddingTop: 120, textAlign: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Memuat instruksi pembayaran...</p>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 'calc(72px + var(--space-2xl))', paddingBottom: 'var(--space-4xl)' }}>
      <div className="container" style={{ maxWidth: 640 }}>
        {/* Header (From Wireframe Page 3) */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div className="badge badge-warning" style={{ marginBottom: 12 }}>
            <Clock size={12} />
            <span>Menunggu Pembayaran</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 4 }}>
            Pesanan #{order.order_number || id}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {order.service_name} • {order.duration_minutes} Menit
          </p>
        </div>

        {/* Total Bayar Card */}
        <div className="card-glass" style={{
          textAlign: 'center',
          padding: '24px',
          marginBottom: 20,
          background: 'var(--accent-gradient-soft)',
          borderColor: 'rgba(124, 58, 237, 0.4)'
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
            Total yang harus dibayar:
          </div>
          <div style={{
            fontSize: '2.4rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)'
          }}>
            Rp{(order.total || 24000).toLocaleString('id-ID')}
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 8,
            color: 'var(--warning)',
            fontSize: '0.82rem',
            fontWeight: 600
          }}>
            <Clock size={14} />
            <span>Selesaikan pembayaran dalam {formattedTime}</span>
          </div>
        </div>

        {/* Payment Channels Selection */}
        <div className="card-glass" style={{ marginBottom: 20 }}>
          <label className="form-label" style={{ marginBottom: 12 }}>Pilih Metode Pembayaran (Tripay)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
            {[
              { id: 'qris', label: 'QRIS' },
              { id: 'bca', label: 'VA BCA' },
              { id: 'mandiri', label: 'VA Mandiri' },
              { id: 'gopay', label: 'GoPay' },
              { id: 'shopeepay', label: 'ShopeePay' },
              { id: 'dana', label: 'DANA' }
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMethod(m.id)}
                style={{
                  padding: '10px 8px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  background: selectedMethod === m.id ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                  color: selectedMethod === m.id ? '#fff' : 'var(--text-secondary)',
                  border: selectedMethod === m.id ? 'none' : '1px solid var(--glass-border)',
                  cursor: 'pointer',
                  transition: '0.2s'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Dynamic Channel Content */}
          {selectedMethod === 'qris' ? (
            /* QRIS View (From Wireframe Page 3) */
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{
                width: 200,
                height: 200,
                margin: '0 auto 16px',
                background: '#fff',
                borderRadius: 16,
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }}>
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020101021226680016ID.CO.TRIPAY.WWW01189360099900000000015204581253033605405240005802ID5917ANYREEL+CREATIVE6007JAKARTA62070703A016304C92A" 
                  alt="QRIS AnyReel Creative"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 4 }}>
                Scan kode QRIS di atas dengan aplikasi BCA, GoPay, OVO, Dana, atau mobile banking kamu.
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Batas bayar: <strong>{formattedTime}</strong>
              </span>
            </div>
          ) : (
            /* Virtual Account / E-Wallet View */
            <div style={{ padding: '16px 0' }}>
              <div style={{
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 'var(--radius-md)',
                padding: 16,
                border: '1px solid var(--glass-border)'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Nomor {selectedMethod.toUpperCase()} (Tripay Sandbox/Production):
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: 'var(--accent-cyan-light)'
                  }}>
                    8809 1294 8839 2011
                  </span>
                  <button 
                    onClick={() => copyToClipboard('8809129488392011', 'Nomor Virtual Account')}
                    className="btn btn-secondary btn-sm"
                  >
                    <Copy size={14} />
                    <span>Salin</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Check Status */}
          <button 
            type="button"
            onClick={() => navigate(`/status/${order.order_number || order.id}`)}
            className="btn btn-secondary btn-full"
            style={{ padding: 14 }}
          >
            <span>Cek Status Pembayaran</span>
          </button>

          {/* Simulate Success (Very convenient for demo/testing) */}
          <button 
            type="button"
            onClick={handleSimulatePayment}
            className="btn btn-primary btn-full"
            style={{ padding: 14 }}
          >
            <CheckCircle2 size={18} />
            <span>Simulasi Pembayaran Berhasil (Tripay Callback)</span>
          </button>
        </div>

        {/* Footer Gateway Info */}
        <div style={{
          textAlign: 'center',
          marginTop: 20,
          color: 'var(--text-tertiary)',
          fontSize: '0.78rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6
        }}>
          <ShieldCheck size={14} color="var(--success)" />
          <span>Diproses aman oleh Tripay Payment Gateway</span>
        </div>
      </div>
    </div>
  )
}
