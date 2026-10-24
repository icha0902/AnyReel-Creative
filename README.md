# 🎬 AnyReel Creative — E-Commerce Jasa Editing Video

Web e-commerce profesional untuk jasa editing video bagi konten kreator (TikTok, Instagram Reels, YouTube, dan Commercial Ads). 

Dibangun dengan **Vite + React** (frontend), **Node.js + Express** (backend), dan terintegrasi dengan **Supabase** (database & auth) serta **Tripay Payment Gateway**.

---

## 🚀 Fitur Unggulan

1. **Autentikasi (1 Email = 1 Akun)**:
   - Login & Register dengan validasi unik email per akun.
   - Demo switcher instan antara role **User Kreator** dan **Admin**.
2. **Navigasi Sesuai Permintaan**:
   - Struktur navbar: **Home, About, Layanan, Kontak**.
   - Badge counter keranjang belanja & dropdown akun.
3. **Katalog 3 Paket Layanan**:
   - Paket Reels & TikTok Editing (Terlaris • 15 slot/bulan).
   - Paket YouTube Editing (8 slot/bulan).
   - Paket Commercial Ads Editing (5 slot/bulan).
   - Indikator sisa slot real-time.
4. **Kalkulator Harga Interaktif**:
   - Slider durasi video interaktif (harga flat Rp10.000 / menit).
   - Input voucher diskon real-time (contoh voucher: `WELCOME20` diskon 20%).
5. **Keranjang Belanja (Cart)**:
   - Pengaturan durasi video, link Google Drive footage mentah, dan konsep editing.
   - Ringkasan subtotal, potongan diskon, dan total akhir.
6. **Pembayaran Tripay UI**:
   - Metode QRIS (dengan QR scanner), Virtual Account (BCA, Mandiri), dan E-Wallet (GoPay, ShopeePay, DANA).
   - Countdown timer 24 menit.
   - Tombol simulasi callback pembayaran langsung.
7. **Status Pengerjaan & Request Revisi**:
   - Visual multi-step timeline: *Dibayar → Sedang diedit → Hasil terkirim → (Revisi diminta → Sedang direvisi) → Selesai*.
   - Pratinjau video hasil editing & tombol unduh file Google Drive.
   - **Fitur Request Revisi**: Form interaktif dengan timestamp notes, checkbox bagian yang diperbaiki (transisi, musik, warna, subtitle, pacing), kuota maksimal 2x revisi gratis.
8. **Dashboard Pengguna & Dashboard Admin**:
   - **Dashboard User**: Ringkasan pesanan aktif, riwayat pesanan, profil.
   - **Dashboard Admin**: Metrik statistik pendapatan, tabel manajemen order, pengubah status, pengirim link hasil editan, dan antrean revisi.

---

## 🛠️ Cara Menjalankan Aplikasi

### 1. Menjalankan Frontend (Client):
```bash
cd client
npm run dev
```
Buka browser di: [http://localhost:5173](http://localhost:5173)

### 2. Menjalankan Backend (Server):
```bash
cd server
npm start
```
Server berjalan di: [http://localhost:3001](http://localhost:3001)

### 3. Migrasi Database Supabase (Opsional):
Jalankan file SQL `server/schema.sql` di **Supabase Dashboard > SQL Editor**.

---

## 💳 Panduan Integrasi Tripay
Lihat file [`TRIPAY_INTEGRATION_GUIDE.md`](./TRIPAY_INTEGRATION_GUIDE.md) untuk detail lengkap setup merchant, API key, dan webhook signature.
