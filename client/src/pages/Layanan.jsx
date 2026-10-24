import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Check, ArrowRight, Sparkles, Filter, Clock, Flame } from 'lucide-react'
import { api, DEFAULT_SERVICES } from '../lib/api'

export const Layanan = () => {
  const [services, setServices] = useState(DEFAULT_SERVICES)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    api.getServices().then(setServices)
  }, [])

  const filtered = activeCategory === 'all' 
    ? services 
    : services.filter(s => s.category === activeCategory)

  return (
    <div className="layanan-page" style={{ paddingTop: 'calc(72px + var(--space-2xl))', paddingBottom: 'var(--space-4xl)' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-label" style={{ marginBottom: 12 }}>
            <Sparkles size={14} color="var(--accent-cyan)" />
            <span>Katalog Jasa Editing</span>
          </div>
          <h1>
            Pilih Paket Editing yang <br />
            <span className="gradient-text">Sesuai Format Kontenmu</span>
          </h1>
          <p>
            Harga flat Rp10.000 per menit durasi video jadi. Slot dibatasi setiap bulan untuk menjaga standar kualitas editing tertinggi.
          </p>

          {/* Filter Tabs */}
          <div style={{
            display: 'inline-flex',
            gap: 8,
            marginTop: 24,
            padding: 4,
            borderRadius: 'var(--radius-full)',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)'
          }}>
            {[
              { id: 'all', label: 'Semua Paket' },
              { id: 'short-form', label: 'Reels & TikTok' },
              { id: 'long-form', label: 'YouTube' },
              { id: 'commercial', label: 'Commercial Ads' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  background: activeCategory === tab.id ? 'var(--accent-gradient)' : 'transparent',
                  color: activeCategory === tab.id ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  transition: '0.2s',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
          gap: 'var(--space-2xl)'
        }}>
          {filtered.map(svc => (
            <div 
              key={svc.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                padding: 'var(--space-xl)',
                borderColor: svc.is_popular ? 'rgba(124, 58, 237, 0.4)' : 'var(--glass-border)',
                background: svc.is_popular ? 'rgba(124, 58, 237, 0.05)' : 'var(--bg-card)'
              }}
            >
              {svc.is_popular && (
                <div style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--accent-gradient)',
                  color: '#fff',
                  padding: '4px 14px',
                  borderRadius: 999,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <Flame size={12} fill="#fff" />
                  <span>PALING POPULER</span>
                </div>
              )}

              {/* Slot Indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span className="badge badge-info">{svc.category}</span>
                <span className="badge badge-slot">
                  <Clock size={12} />
                  <span>{svc.slots_remaining} / {svc.slots_per_month} slot bulan ini</span>
                </span>
              </div>

              {/* Image */}
              <div style={{
                height: 200,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: 20,
                position: 'relative'
              }}>
                <img 
                  src={svc.image_url} 
                  alt={svc.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <h2 style={{ fontSize: '1.4rem', marginBottom: 8 }}>{svc.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20, lineHeight: 1.5 }}>
                {svc.description}
              </p>

              {/* Price Banner */}
              <div style={{
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'baseline',
                gap: 6,
                border: '1px solid var(--glass-border)'
              }}>
                <span style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: 'var(--accent-cyan-light)',
                  fontFamily: 'var(--font-heading)'
                }}>
                  Rp{svc.price_per_minute.toLocaleString('id-ID')}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>/ menit durasi jadi</span>
              </div>

              {/* Included Features */}
              <div style={{ marginBottom: 24, flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 12 }}>
                  Fitur Paket:
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(svc.features || [
                    'Transisi dinamis & cutting presisi',
                    'Subtitle & sound effect premium',
                    'Color correction & grading',
                    '2x Kesempatan Revisi Gratis'
                  ]).map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--success)',
                        flexShrink: 0
                      }}>
                        <Check size={12} />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                to={`/layanan/${svc.id}`}
                className={`btn ${svc.is_popular ? 'btn-primary' : 'btn-secondary'} btn-full`}
                style={{ padding: '14px 20px' }}
              >
                <span>Pilih Paket & Pesan</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
