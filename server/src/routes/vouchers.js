import { Router } from 'express'
import { supabase } from '../lib/supabase.js'

const router = Router()

const VOUCHERS = {
  'WELCOME20': {
    code: 'WELCOME20',
    discount_percent: 20,
    max_uses: 20,
    description: 'Voucher 20% untuk pesanan pertama: jadi Rp8.000/menit.'
  }
}

// POST /api/vouchers/validate
router.post('/validate', async (req, res) => {
  const { code } = req.body
  const normalized = (code || '').trim().toUpperCase()

  try {
    const { data, error } = await supabase.from('vouchers').select('*').eq('code', normalized).eq('is_active', true).single()
    if (!error && data) {
      return res.json({
        valid: true,
        voucher: data,
        message: `Voucher ${data.code} berhasil digunakan! Diskon ${data.discount_percent}%`
      })
    }
  } catch {
    // fallback
  }

  if (VOUCHERS[normalized]) {
    return res.json({
      valid: true,
      voucher: VOUCHERS[normalized],
      message: `Voucher ${normalized} berhasil digunakan! Diskon 20%`
    })
  }

  return res.status(400).json({
    valid: false,
    message: 'Kode voucher tidak valid atau sudah kedaluwarsa'
  })
})

export default router
