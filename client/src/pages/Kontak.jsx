import { useState } from 'react'
import { 
  MessageCircle, 
  Mail, 
  Instagram, 
  MapPin, 
  Send, 
  HelpCircle, 
  CheckCircle2, 
  Clock,
  Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

export const Kontak = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    toast.success('Pesan kamu berhasil dikirim! Tim kami akan membalas via WhatsApp.')
  }

  return (
    <div className="kontak-page" style={{ paddingTop: 'calc(72px + var(--space-2xl))', paddingBottom: 'var(--space-4xl)' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-label" style={{ marginBottom: 12 }}>
            <MessageCircle size={14} color="var(--accent-cyan)" />
            <span>Hubungi AnyReel Creative</span>
          </div>
          <h1>
            Konsultasikan Konsep Videomu <br />
            <span className="gradient-text">Bersama Tim Editor Kami</span>
          </h1>
          <p>
            Punya pertanyaan mengenai footage, durasi, atau butuh custom bundle? Hubungi kami langsung via WhatsApp atau formulir di bawah.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-3xl)',
          marginBottom: 'var(--space-4xl)'
        }}>
          {/* Left Column: Direct Contact Info & WhatsApp */}
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: 20 }}>Saluran Kontak Langsung</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              {/* WhatsApp Card */}
              <a 
                href="https://wa.me/6281234567890?text=Halo%20AnyReel%20Creative,%20saya%20mau%20konsultasi%20jasa%20editing%20video" 
                target="_blank" 
                rel="noreferrer"
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  borderColor: 'rgba(16, 185, 129, 0.4)',
                  background: 'rgba(16, 185, 129, 0.05)',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--success)'
                }}>
                  <MessageCircle size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Respon Tercepat (Online)
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    Chat WhatsApp Kami
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    +62 812-3456-7890 (09:00 - 21:00 WIB)
                  </div>
                </div>
              </a>

              {/* Instagram Card */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="card"
                style={{ display: 'flex', alignItems: 'center', gap: 16 }}
              >
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'rgba(236, 72, 153, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ec4899'
                }}>
                  <Instagram size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#ec4899', fontWeight: 600 }}>Portofolio & DM</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    @anyreel.creative
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Lihat hasil-hasil editan terbaru kami
                  </div>
                </div>
              </a>

              {/* Email Card */}
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'rgba(59, 130, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3b82f6'
                }}>
                  <Mail size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600 }}>Email Dukungan</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    halo@anyreelcreative.com
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Untuk pertanyaan komersial & kerjasama
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="card-glass">
            <h2 style={{ fontSize: '1.4rem', marginBottom: 8 }}>Formulir Konsultasi</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 20 }}>
              Isi data di bawah dan tim kami akan segera menghubungi kamu.
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ marginBottom: 8 }}>Terima Kasih, {formData.name}!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
                  Pesanmu sudah kami terima. Kami akan segera menghubungi nomor WhatsApp kamu.
                </p>
                <button 
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', whatsapp: '', message: '' }) }}
                  className="btn btn-secondary btn-sm"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nama Lengkap</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Alamat Email</label>
                  <input 
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nomor WhatsApp</label>
                  <input 
                    type="tel"
                    required
                    placeholder="08123456789"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pesan / Konsep Video yang Diinginkan</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Ceritakan jenis video yang ingin kamu buat, referensi akun atau gaya editing..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full" style={{ padding: 14 }}>
                  <Send size={18} />
                  <span>Kirim Formulir Konsultasi</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="card-glass">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <HelpCircle size={22} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.3rem' }}>Pertanyaan yang Sering Diajukan (FAQ)</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: 6, color: 'var(--text-primary)' }}>
                Berapa lama estimasi pengerjaan video?
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                Pengerjaan standar adalah 24 hingga 48 jam kerja terhitung sejak pembayaran terkonfirmasi dan file Google Drive dapat diakses.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: 6, color: 'var(--text-primary)' }}>
                Bagaimana jika hasil belum sesuai?
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                Setiap pesanan mendapatkan 2x hak revisi gratis. Kamu bisa menjelaskan poin yang perlu disesuaikan melalui tombol "Minta Revisi" di dashboard.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: 6, color: 'var(--text-primary)' }}>
                Format footage apa saja yang didukung?
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                Kami menerima footage video dari HP (iPhone/Android), mirrorless (Sony, Canon, Fujifilm), screen recording, format MP4, MOV, ProRes, dan MKV.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: 6, color: 'var(--text-primary)' }}>
                Apakah audio / musik bebas copyright?
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                Ya, kami menggunakan audio bebas lisensi atau audio trending resmi yang aman untuk monetisasi dan upload ke platform media sosial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
