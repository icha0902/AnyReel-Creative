import { Router } from 'express'
import { supabase } from '../lib/supabase.js'

const router = Router()

const DEFAULT_SERVICES = [
  {
    id: 'svc-reels-tiktok',
    name: 'Paket Reels & TikTok Editing',
    description: 'Video vertikal singkat dengan potongan cepat, subtitle, dan musik.',
    category: 'short-form',
    price_per_minute: 10000,
    slots_per_month: 15,
    slots_remaining: 15,
    is_popular: true,
    image_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80',
    features: [
      'Format vertikal 9:16 (TikTok & IG Reels)',
      'Potongan dinamis & cepat',
      'Subtitle otomatis / kinetic typography',
      'Sound effects & background music trending',
      'Color correction standar',
      'Maksimal 2x revisi gratis'
    ]
  },
  {
    id: 'svc-youtube',
    name: 'Paket YouTube Editing',
    description: 'Video panjang dengan transisi, color grading, dan sound design.',
    category: 'long-form',
    price_per_minute: 10000,
    slots_per_month: 8,
    slots_remaining: 8,
    is_popular: false,
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    features: [
      'Format horizontal 16:9 Full HD / 4K',
      'Transisi mulus & b-roll insertion',
      'Color grading sinematik',
      'Sound design & balancing audio vokal',
      'Thumbnail template (opsional)',
      'Maksimal 2x revisi gratis'
    ]
  },
  {
    id: 'svc-commercial',
    name: 'Paket Commercial Ads Editing',
    description: 'Video iklan produk dengan tampilan rapi dan pesan yang tegas.',
    category: 'commercial',
    price_per_minute: 10000,
    slots_per_month: 5,
    slots_remaining: 5,
    is_popular: false,
    image_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
    features: [
      'Multi-format (1:1, 9:16, 16:9)',
      'High-impact hook 3 detik pertama',
      'Pesan tegas dengan CTA dinamis',
      'Grafis promo & motion graphics branding',
      'Lisensi musik komersial siap pakai',
      'Maksimal 2x revisi gratis'
    ]
  }
]

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true })
    if (!error && data && data.length > 0) {
      return res.json(data)
    }
  } catch (err) {
    // fallback
  }
  return res.json(DEFAULT_SERVICES)
})

// GET /api/services/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const { data, error } = await supabase.from('services').select('*').eq('id', id).single()
    if (!error && data) {
      return res.json(data)
    }
  } catch (err) {
    // fallback
  }
  const found = DEFAULT_SERVICES.find(s => s.id === id) || DEFAULT_SERVICES[0]
  return res.json(found)
})

export default router
