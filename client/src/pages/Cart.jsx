import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import { 
  ShoppingBag, 
  Trash2, 
  Tag, 
  ArrowRight, 
  CreditCard, 
  Link2, 
  Clock, 
  Sliders,
  CheckCircle2,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

export const Cart = () => {
  const { 
    items, 
    removeFromCart, 
    updateDuration, 
    voucher, 
    applyVoucher, 
    removeVoucher, 
    subtotal, 
    discountAmount, 
    total,
    clearCart
  } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [voucherCode, setVoucherCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleApplyVoucher = (e) => {
    e.preventDefault()
    if (!voucherCode.trim()) return
    applyVoucher(voucherCode.trim())
    setVoucherCode('')
  }

  const handleCheckout = async () => {
    if (items.length === 0) return

    if (!user) {
      toast.error('Silakan login terlebih dahulu untuk melanjutkan pembayaran.')
      navigate('/login', { state: { from: '/cart' } })
      return
    }

    setLoading(true)
    try {
      // Create first order from cart
      const primaryItem = items[0]
      const order = await api.createOrder({
        user_id: user.id,
        user_email: user.email,
        user_name: user.full_name || user.email.split('@')[0],
        service_id: primaryItem.service_id,
        service_name: primaryItem.service_name,
        duration_minutes: primaryItem.duration_minutes,
        file_link: primaryItem.file_link,
        editing_style: primaryItem.editing_style,
        voucher_code: voucher ? voucher.code : null,
        subtotal: subtotal,
        discount: discountAmount,
        total: total,
        status: 'pending' // Pending payment
      })

      clearCart()
      toast.success('Pesanan dibuat! Menuju halaman pembayaran...')
      navigate(`/payment/${order.order_number || order.id}`, { state: { order } })
    } catch (err) {
      toast.error(err.message || 'Gagal membuat pesanan')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div style={{ paddingTop: 'calc(72px + var(--space-3xl))', paddingBottom: 'var(--space-4xl)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 540 }}>
          <div className="card-glass" style={{ padding: 'var(--space-3xl) var(--space-xl)' }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--glass-bg)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              color: 'var(--text-tertiary)'
            }}>
              <ShoppingBag size={36} />
            </div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: 8 }}>Keranjang Masih Kosong</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              Kamu belum menambahkan layanan video editing ke dalam keranjang.
            </p>
            <Link to="/layanan" className="btn btn-primary btn-lg">
              <span>Lihat Paket Layanan</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page" style={{ paddingTop: 'calc(72px + var(--space-2xl))', paddingBottom: 'var(--space-4xl)' }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-2xl)' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>Keranjang Pesanan</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Tinjau paket editing dan detail video sebelum lanjut ke pembayaran
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 'var(--space-2xl)',
          alignItems: 'start'
        }}>
          {/* Cart Item List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {items.map((item) => (
              <div key={item.id} className="card-glass" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: 4 }}>{item.service_name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--accent-cyan-light)' }}>
                      <span>Rp{item.price_per_minute.toLocaleString('id-ID')} / menit</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      background: 'none',
                      color: 'var(--text-tertiary)',
                      padding: 6,
                      borderRadius: 6,
                      transition: '0.2s'
                    }}
                    title="Hapus item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Duration Control */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 14
                }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Durasi Video Jadi:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => updateDuration(item.id, item.duration_minutes - 1)}
                      disabled={item.duration_minutes <= 1}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: 'var(--glass-bg)',
                        color: '#fff',
                        fontWeight: 700
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 700, minWidth: 60, textAlign: 'center' }}>
                      {item.duration_minutes} Menit
                    </span>
                    <button
                      onClick={() => updateDuration(item.id, item.duration_minutes + 1)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: 'var(--glass-bg)',
                        color: '#fff',
                        fontWeight: 700
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* File Link Preview */}
                {item.file_link && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                    <Link2 size={14} color="var(--accent-cyan)" />
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 300 }}>
                      File: {item.file_link}
                    </span>
                  </div>
                )}

                {/* Style Notes */}
                {item.editing_style && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <Sliders size={14} color="var(--accent-violet-light)" />
                    <span style={{ fontStyle: 'italic' }}>
                      Konsep: "{item.editing_style}"
                    </span>
                  </div>
                )}

                {/* Item Subtotal */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: 12,
                  paddingTop: 10,
                  borderTop: '1px solid var(--glass-border)'
                }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Rp{(item.price_per_minute * item.duration_minutes).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Summary Card */}
          <div className="card-glass" style={{ position: 'sticky', top: 96 }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 16 }}>Ringkasan Pembayaran</h3>

            {/* Voucher Box */}
            <div className="form-group">
              <label className="form-label">Kode Voucher Diskon</label>
              {voucher ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: 'var(--success)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={16} />
                    <span style={{ fontWeight: 700 }}>{voucher.code} (-{voucher.discount_percent}%)</span>
                  </div>
                  <button 
                    onClick={removeVoucher}
                    style={{ background: 'none', color: 'var(--text-tertiary)', padding: 4 }}
                    title="Hapus voucher"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyVoucher} style={{ display: 'flex', gap: 8 }}>
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
                  <button type="submit" className="btn btn-secondary">
                    Pakai
                  </button>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div style={{
              background: 'rgba(0,0,0,0.25)',
              borderRadius: 'var(--radius-md)',
              padding: 16,
              margin: '16px 0',
              border: '1px solid var(--glass-border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>Subtotal ({items.length} item)</span>
                <span style={{ color: 'var(--text-primary)' }}>Rp{subtotal.toLocaleString('id-ID')}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem', color: 'var(--success)' }}>
                  <span>Diskon Voucher ({voucher?.discount_percent}%)</span>
                  <span>- Rp{discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}

              <div style={{ height: 1, background: 'var(--glass-border)', margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total Bayar</span>
                <span style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: 'var(--accent-cyan-light)',
                  fontFamily: 'var(--font-heading)'
                }}>
                  Rp{total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="btn btn-primary btn-full btn-lg"
              style={{ padding: 16 }}
            >
              <CreditCard size={18} />
              <span>{loading ? 'Membuat Pesanan...' : 'Lanjut ke Pembayaran Tripay'}</span>
            </button>

            <div style={{ marginTop: 14, textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              Didukung QRIS, Virtual Account BCA/Mandiri, GoPay, ShopeePay, DANA
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
