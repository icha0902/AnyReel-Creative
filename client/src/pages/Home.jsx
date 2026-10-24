import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Shield, 
  Zap, 
  CreditCard, 
  UploadCloud, 
  Video,
  FileCheck2,
  Award
} from 'lucide-react'
import { api, DEFAULT_SERVICES } from '../lib/api'
import { PriceCalculator } from '../components/PriceCalculator'

export const Home = () => {
  const [services, setServices] = useState(DEFAULT_SERVICES)

  useEffect(() => {
    api.getServices().then(setServices)
  }, [])

  return (
    <div className="home-page">
      {/* ── Hero Section (From Wireframe Page 1) ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="section-label" style={{ marginBottom: 16 }}>
                <Sparkles size={14} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Jasa Editing Video Konten Kreator</span>
              </div>
              <h1>
                Editan videomu, <br />
                <span className="gradient-text">gayamu sendiri.</span>
              </h1>
              <p>
                Jasa editing video untuk konten kreator. Transisi, musik, dan warna kamu yang tentukan. 
                Harga transparan: <strong>Rp10.000 per menit</strong> durasi video.
              </p>
              <div className="hero-actions">
                <Link to="/layanan" className="btn btn-primary btn-lg">
                  <span>Pesan Sekarang</span>
                  <ArrowRight size={18} />
                </Link>
                <a href="#kalkulator" className="btn btn-secondary btn-lg">
                  <Play size={18} />
                  <span>Hitung Harga</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div style={{ display: 'flex', gap: 24, marginTop: 32, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={18} color="var(--accent-cyan)" />
                  <span>Cepat 24-48 Jam</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Award size={18} color="var(--accent-violet-light)" />
                  <span>Garansi 2x Revisi</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Mockup */}
            <div className="hero-visual">
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: 480,
                aspectRatio: '16/10',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #1A1A2E 0%, #12121F 100%)',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1000&auto=format&fit=crop&q=80" 
                  alt="AnyReel Creative Video Editor Workspace"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10, 10, 20, 0.9) 0%, transparent 60%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: 24
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)',
                    padding: '6px 12px',
                    borderRadius: 999,
                    width: 'fit-content',
                    marginBottom: 8,
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>Preview Video Hasil Editan</span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
                    Reels & TikTok Dynamic Typography • Color Graded
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Voucher Banner (From Wireframe Page 1) ── */}
          <div className="voucher-banner">
            <span className="voucher-icon">🎁</span>
            <p>
              Voucher <strong>20%</strong> untuk pesanan pertama: jadi <strong>Rp8.000/menit</strong>. Kuota 20 pengguna. 
              Gunakan kode: <strong style={{ color: 'var(--accent-cyan-light)', textDecoration: 'underline' }}>WELCOME20</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── Services Catalog Section (Pilih Layanan) ── */}
      <section className="section" style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label" style={{ marginBottom: 12 }}>
              <span>Katalog Editing</span>
            </div>
            <h2>Pilih Layanan</h2>
            <p>
              Paket editing video yang disesuaikan untuk berbagai format konten digital kamu
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-xl)'
          }}>
            {services.map((svc) => (
              <div 
                key={svc.id} 
                className="card" 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  borderColor: svc.is_popular ? 'rgba(124, 58, 237, 0.4)' : 'var(--glass-border)',
                  boxShadow: svc.is_popular ? '0 10px 30px rgba(124, 58, 237, 0.15)' : 'none'
                }}
              >
                {/* Popular Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  {svc.is_popular ? (
                    <span className="badge badge-popular">Terlaris 🔥</span>
                  ) : (
                    <span className="badge badge-info">{svc.category}</span>
                  )}
                  <span className="badge badge-slot">
                    {svc.slots_remaining} slot tersisa
                  </span>
                </div>

                {/* Service Image */}
                <div style={{
                  height: 180,
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  marginBottom: 16,
                  position: 'relative'
                }}>
                  <img 
                    src={svc.image_url} 
                    alt={svc.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(18, 18, 31, 0.8) 0%, transparent 60%)'
                  }} />
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>{svc.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 16, flex: 1 }}>
                  {svc.description}
                </p>

                {/* Price Display */}
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 6,
                  padding: '12px 0',
                  borderTop: '1px solid var(--glass-border)',
                  borderBottom: '1px solid var(--glass-border)',
                  marginBottom: 16
                }}>
                  <span style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'var(--accent-cyan-light)',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    Rp{svc.price_per_minute.toLocaleString('id-ID')}
                  </span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>/ menit</span>
                </div>

                <Link 
                  to={`/layanan/${svc.id}`} 
                  className={`btn ${svc.is_popular ? 'btn-primary' : 'btn-secondary'} btn-full`}
                >
                  <span>Lihat Detail & Order</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Price Calculator Section (#kalkulator) ── */}
      <section id="kalkulator" className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label" style={{ marginBottom: 12 }}>
              <span>Hitung Biaya</span>
            </div>
            <h2>Kalkulator Harga Real-Time</h2>
            <p>
              Tentukan durasi video mentahmu, masukkan voucher diskon, dan dapatkan kepastian biaya sebelum memesan.
            </p>
          </div>

          <PriceCalculator />
        </div>
      </section>

      {/* ── Cara Pesan Section (From Wireframe Page 1) ── */}
      <section className="section" style={{ background: 'rgba(255, 255, 255, 0.015)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label" style={{ marginBottom: 12 }}>
              <span>Alur Pemesanan</span>
            </div>
            <h2>Cara Pesan</h2>
            <p>4 Langkah mudah memiliki video berkualitas tinggi untuk akun kreator kamu</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-lg)'
          }}>
            {[
              {
                step: '01',
                title: 'Pilih Paket',
                desc: 'Tentukan jenis video yang mau diedit: Reels, YouTube, atau Ads komersial.',
                icon: <Video size={24} color="var(--accent-violet)" />
              },
              {
                step: '02',
                title: 'Isi Durasi & Konsep',
                desc: 'Masukkan durasi, link file (Google Drive), dan gaya editing yang kamu inginkan.',
                icon: <UploadCloud size={24} color="var(--accent-cyan)" />
              },
              {
                step: '03',
                title: 'Bayar via Tripay',
                desc: 'Bayar instan dengan QRIS, Virtual Account BCA/Mandiri, atau E-Wallet.',
                icon: <CreditCard size={24} color="var(--accent-violet-light)" />
              },
              {
                step: '04',
                title: 'Terima Hasil & Revisi',
                desc: 'Link hasil editan dikirim. Tersedia 2x revisi gratis jika hasil belum sesuai.',
                icon: <FileCheck2 size={24} color="var(--success)" />
              }
            ].map((item, idx) => (
              <div key={idx} className="card" style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: 16,
                  right: 20,
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'rgba(255, 255, 255, 0.05)',
                  fontFamily: 'var(--font-heading)'
                }}>
                  {item.step}
                </div>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'var(--glass-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Metode Pembayaran Section (From Wireframe Page 1) ── */}
      <section className="section">
        <div className="container">
          <div className="card-glass" style={{ textAlign: 'center', padding: 'var(--space-3xl) var(--space-xl)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: 12 }}>Metode Pembayaran (Tripay)</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 24px' }}>
              Didukung integrasi payment gateway Tripay. Bayar dengan aman menggunakan metode favoritmu:
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 12,
              marginBottom: 32
            }}>
              {['QRIS', 'VA BCA', 'VA Mandiri', 'GoPay', 'ShopeePay', 'DANA'].map(name => (
                <div key={name} style={{
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)'
                }}>
                  {name}
                </div>
              ))}
            </div>

            <Link to="/layanan" className="btn btn-primary btn-lg">
              <span>Mulai Buat Video Pertamamu</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
