import { Router } from 'express'
import { supabase } from '../lib/supabase.js'

const router = Router()

// POST /api/payments/create — Tripay Transaction Placeholder
router.post('/create', async (req, res) => {
  try {
    const { order_id, method, amount, customer_name, customer_email } = req.body

    const reference = `TRIPAY-${Date.now()}`

    const transaction = {
      reference,
      merchant_ref: order_id,
      payment_method: method || 'QRIS',
      payment_name: method === 'qris' ? 'QRIS All Payment' : 'Virtual Account Bank',
      amount: Number(amount) || 24000,
      fee_merchant: 0,
      fee_customer: 750,
      total_fee: 750,
      amount_received: Number(amount) || 24000,
      pay_code: method === 'qris' ? null : '8809129488392011',
      qr_string: method === 'qris' ? '00020101021226680016ID.CO.TRIPAY.WWW01189360099900000000015204581253033605405240005802ID5917ANYREEL+CREATIVE6007JAKARTA62070703A016304C92A' : null,
      status: 'UNPAID',
      expired_time: Math.floor(Date.now() / 1000) + 1800 // 30 minutes
    }

    return res.json({
      success: true,
      message: 'Transaksi Tripay berhasil disiapkan',
      data: transaction
    })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Gagal membuat pembayaran' })
  }
})

// POST /api/payments/callback — Tripay Webhook Callback
router.post('/callback', async (req, res) => {
  try {
    const callbackData = req.body
    console.log('Tripay Webhook Received:', callbackData)

    // Verify status: 'PAID'
    if (callbackData.status === 'PAID') {
      const orderId = callbackData.merchant_ref

      try {
        await supabase.from('orders').update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          tripay_reference: callbackData.reference
        }).or(`id.eq.${orderId},order_number.eq.${orderId}`)
      } catch (e) {
        console.error('Failed to update order on callback:', e)
      }
    }

    return res.json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: 'Callback error' })
  }
})

export default router
