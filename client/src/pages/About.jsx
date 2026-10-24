import { Link } from 'react-router-dom'
import { 
  Users, 
  Target, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Film, 
  Palette, 
  ArrowRight,
  Sliders,
  CheckCircle2
} from 'lucide-react'

export const About = () => {
  return (
    <div className="about-page" style={{ paddingTop: 'calc(72px + var(--space-2xl))', paddingBottom: 'var(--space-4xl)' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-label" style={{ marginBottom: 12 }}>
            <Users size={14} color="var(--accent-cyan)" />
            <span>Tentang AnyReel Creative</span>
          </div>
          <h1>
            Partner Editing Video Terpercaya untuk <br />
            <span className="gradient-text">Konten Kreator Indonesia</span>
          </h1>
          <p>
            AnyReel Creative hadir untuk membebaskan kreator dari beban teknis editing video yang memakan waktu, 
            sehingga kamu bisa fokus 100% pada pembuatan ide konten dan interaksi bersama audiens.
          </p>
        </div>

        {/* Story Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-2xl)',
          alignItems: 'center',
          marginBottom: 'var(--space-4xl)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: 16 }}>
              Transisi, musik, dan warna — <br />
              <span style={{ color: 'var(--accent-cyan-light)' }}>kamu yang tentukan arahnya.</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
              Kami percaya setiap kreator memiliki identitas dan persona visual yang unik. Kami tidak menggunakan template kaku atau preset murahan. Di AnyReel Creative, kamu memberikan footage mentah dan referensi gaya, lalu editor profesional kami mewujudkannya menjadi video yang punchy, dinamis, dan menahan perhatian penonton dari detik pertama hingga akhir.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
              Dengan sistem kalkulasi harga berbasis menit durasi jadi (<strong>Rp10.000 / menit</strong>), tidak ada biaya tersembunyi atau negosiasi berbelit-belit. Semuanya jelas sejak sebelum kamu menekan tombol pesan.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ padding: '12px 18px', borderRadius: 12, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-violet-light)' }}>500+</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Reels & Video Diproduksi</div>
              </div>
              <div style={{ padding: '12px 18px', borderRadius: 12, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan-light)' }}>99.2%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Tingkat Kepuasan Klien</div>
              </div>
              <div style={{ padding: '12px 18px', borderRadius: 12, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>24-48j</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Turnaround Cepat</div>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--shadow-xl)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1536240478700-b869070f9279?w=900&auto=format&fit=crop&q=80" 
                alt="Creative editing team" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* 4 Keunggulan Utama */}
        <div style={{ marginBottom: 'var(--space-4xl)' }}>
          <div className="section-header">
            <h2>Kenapa Memilih AnyReel Creative?</h2>
            <p>Standar produksi video modern yang dirancang untuk performa algoritma media sosial</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-lg)'
          }}>
            {[
              {
                title: 'Harga Transparan Rp10.000/Menit',
                desc: 'Tanpa biaya tersembunyi. Kamu hanya membayar sesuai durasi video jadi yang kamu inginkan.',
                icon: <Zap size={24} color="var(--accent-violet)" />
              },
              {
                title: 'Garansi 2x Revisi Gratis',
                desc: 'Jika potongan atau subtitle kurang pas, ajukan revisi langsung lewat dashboard dengan mudah.',
                icon: <ShieldCheck size={24} color="var(--accent-cyan)" />
              },
              {
                title: 'Editing Sesuai Gayamu Sendiri',
                desc: 'Bebas request sound design, kinetic subtitle, color grading, maupun tempo cepat ala kreator top.',
                icon: <Sliders size={24} color="var(--accent-violet-light)" />
              },
              {
                title: 'Slot Terbatas per Bulan',
                desc: 'Kami membatasi jumlah slot order per bulan untuk menjaga kualitas dan perhatian setiap karya.',
                icon: <Target size={24} color="var(--success)" />
              }
            ].map((f, i) => (
              <div key={i} className="card">
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
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Kelompok 8 */}
        <div className="card-glass" style={{ textAlign: 'center', padding: 'var(--space-3xl) var(--space-xl)' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: 12 }}>AnyReel Creative • Kelompok 8</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto 24px' }}>
            Inisiatif kreatif untuk memberdayakan ekosistem kreator konten video di era TikTok, Instagram Reels, dan YouTube Shorts.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <Link to="/layanan" className="btn btn-primary btn-lg">
              <span>Jelajahi Paket Layanan</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/kontak" className="btn btn-secondary btn-lg">
              <span>Konsultasi dengan Tim</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
