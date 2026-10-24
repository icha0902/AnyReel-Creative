import { Link } from 'react-router-dom'
import { Film, Instagram, MessageCircle, Heart } from 'lucide-react'

export const Footer = () => {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--glass-border)',
      padding: 'var(--space-4xl) 0 var(--space-xl)',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-2xl)',
          marginBottom: 'var(--space-3xl)'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Film size={18} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem' }}>
                AnyReel <span style={{
                  background: 'var(--accent-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Creative</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 16 }}>
              Jasa editing video profesional untuk kreator Reels, TikTok, dan YouTube. Transisi, warna, dan musik kamu yang tentukan.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: '0.2s'
                }}
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank" 
                rel="noreferrer"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: '0.2s'
                }}
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Navigasi Cepat */}
          <div>
            <h4 style={{ marginBottom: 16, fontSize: '1rem' }}>Navigasi</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Home</Link></li>
              <li><Link to="/about" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>About Us</Link></li>
              <li><Link to="/layanan" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Paket Layanan</Link></li>
              <li><Link to="/kontak" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Hubungi Kontak</Link></li>
              <li><Link to="/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Status Pesanan</Link></li>
            </ul>
          </div>

          {/* Layanan Kami */}
          <div>
            <h4 style={{ marginBottom: 16, fontSize: '1rem' }}>Layanan</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><Link to="/layanan" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Reels & TikTok Editing</Link></li>
              <li><Link to="/layanan" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>YouTube Video Editing</Link></li>
              <li><Link to="/layanan" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Commercial Ads Editing</Link></li>
              <li><span style={{ color: 'var(--accent-violet-light)', fontSize: '0.85rem' }}>Rp10.000 / menit video</span></li>
            </ul>
          </div>

          {/* Pembayaran Didukung */}
          <div>
            <h4 style={{ marginBottom: 16, fontSize: '1rem' }}>Metode Pembayaran</h4>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginBottom: 12 }}>
              Diproses aman dengan Tripay Payment Gateway:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['QRIS', 'BCA VA', 'Mandiri VA', 'GoPay', 'ShopeePay', 'DANA'].map(method => (
                <span key={method} style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)'
                }}>
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          paddingTop: 24,
          borderTop: '1px solid var(--glass-border)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          color: 'var(--text-tertiary)',
          fontSize: '0.82rem'
        }}>
          <div>
            © {new Date().getFullYear()} AnyReel Creative. All rights reserved. • Kelompok 8
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Dibuat untuk konten kreator Indonesia <Heart size={14} color="#ec4899" fill="#ec4899" />
          </div>
        </div>
      </div>
    </footer>
  )
}
