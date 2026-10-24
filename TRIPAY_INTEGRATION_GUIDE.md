# 💳 Panduan Integrasi Tripay Payment Gateway — AnyReel Creative

Dokumen ini berisi panduan teknis langkah demi langkah untuk mengintegrasikan **Tripay Payment Gateway** ke dalam web e-commerce **AnyReel Creative**.

---

## 1. Persiapan Akun & Kredensial Tripay

1. Daftar akun di [Tripay Merchant](https://tripay.co.id) (atau [Tripay Sandbox](https://tripay.co.id/simulator) untuk uji coba).
2. Masuk ke **Pengaturan > Merchant**:
   - Salin **Kode Merchant** (Contoh: `T12345`)
   - Salin **API Key**
   - Salin **Private Key**
3. Masukkan kredensial ke dalam file `server/.env`:

```env
TRIPAY_API_KEY=your_tripay_api_key
TRIPAY_PRIVATE_KEY=your_tripay_private_key
TRIPAY_MERCHANT_CODE=your_merchant_code
TRIPAY_IS_PRODUCTION=false # Ubah ke true saat go-live
```

---

## 2. Endpoint Tripay

| Environment | Base URL |
|-------------|----------|
| **Sandbox / Test** | `https://tripay.co.id/api-sandbox/` |
| **Production** | `https://tripay.co.id/api/` |

---

## 3. Saluran Pembayaran yang Didukung

AnyReel Creative mendukung saluran pembayaran sesuai desain wireframe:

| Metode | Channel Code Tripay | Deskripsi |
|--------|---------------------|-----------|
| **QRIS** | `QRIS` / `QRIS2` | Instant QR scanner untuk semua e-wallet & m-banking |
| **VA BCA** | `BCAVA` | Bank Central Asia Virtual Account |
| **VA Mandiri** | `MANDIRIVA` | Bank Mandiri Virtual Account |
| **VA BNI** | `BNIVA` | Bank Negara Indonesia Virtual Account |
| **GoPay** | `GOPAY` | E-wallet GoPay |
| **ShopeePay** | `SHOPEEPAY` | E-wallet ShopeePay |
| **DANA** | `DANA` | E-wallet DANA |

---

## 4. Implementasi Request Transaksi (`POST /transaction/create`)

### Contoh Kode Node.js (Express):

```javascript
import crypto from 'crypto'

export async function createTripayTransaction(order) {
  const apiKey = process.env.TRIPAY_API_KEY
  const privateKey = process.env.TRIPAY_PRIVATE_KEY
  const merchantCode = process.env.TRIPAY_MERCHANT_CODE
  const isProd = process.env.TRIPAY_IS_PRODUCTION === 'true'

  const endpoint = isProd 
    ? 'https://tripay.co.id/api/transaction/create'
    : 'https://tripay.co.id/api-sandbox/transaction/create'

  // Buat Signature HMAC-SHA256: merchant_code + merchant_ref + amount
  const signature = crypto
    .createHmac('sha256', privateKey)
    .update(merchantCode + order.order_number + order.total)
    .digest('hex')

  const payload = {
    method: order.payment_method || 'QRIS',
    merchant_ref: order.order_number,
    amount: order.total,
    customer_name: order.user_name,
    customer_email: order.user_email,
    customer_phone: order.user_phone || '081234567890',
    order_items: [
      {
        sku: order.service_id,
        name: `${order.service_name} (${order.duration_minutes} Menit)`,
        price: order.total,
        quantity: 1
      }
    ],
    callback_url: 'https://your-domain.com/api/payments/callback',
    return_url: `https://your-domain.com/status/${order.order_number}`,
    expired_time: Math.floor(Date.now() / 1000) + 1800, // 30 Menit
    signature
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  return await response.json()
}
```

---

## 5. Menangani Webhook Callback Tripay

Saat pelanggan menyelesaikan pembayaran, Tripay akan mengirimkan HTTP POST ke `callback_url`.

### Verifikasi Keamanan Signature Callback:

```javascript
// server/src/routes/payments.js
router.post('/callback', async (req, res) => {
  const privateKey = process.env.TRIPAY_PRIVATE_KEY
  const callbackSignature = req.headers['x-callback-signature']
  const jsonBody = JSON.stringify(req.body)

  // Hitung signature HMAC-SHA256 dari raw body
  const calculatedSignature = crypto
    .createHmac('sha256', privateKey)
    .update(jsonBody)
    .digest('hex')

  if (callbackSignature !== calculatedSignature) {
    return res.status(403).json({ success: false, message: 'Invalid Signature' })
  }

  const { status, merchant_ref, reference } = req.body

  if (status === 'PAID') {
    // 1. Update status pesanan di database ke 'paid'
    await supabase
      .from('orders')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        tripay_reference: reference
      })
      .eq('order_number', merchant_ref)

    console.log(`✅ Pesanan ${merchant_ref} berhasil dibayar!`)
  }

  // Wajib kirim response JSON success: true ke Tripay
  return res.json({ success: true })
})
```

---

## 6. Uji Coba di Sandbox

1. Buat pesanan baru di web AnyReel Creative.
2. Di halaman Pembayaran, pilih metode (contoh: QRIS atau VA BCA).
3. Buka [Tripay Payment Simulator](https://tripay.co.id/simulator) lalu masukkan nomor referensi transaksi.
4. Klik **Bayar Transaksi**.
5. Status pesanan akan otomatis berubah menjadi **Dibayar** dan masuk ke antrean pengerjaan editor AnyReel Creative! 🎬
