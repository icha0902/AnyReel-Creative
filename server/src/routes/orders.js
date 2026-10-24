import { Router } from 'express'
import { supabase } from '../lib/supabase.js'

const router = Router()

// Memory store fallback if Supabase table is not yet migrated
let memoryOrders = []

// GET /api/orders
router.get('/', async (req, res) => {
  const { userId } = req.query
  try {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (userId) {
      query = query.eq('user_id', userId)
    }
    const { data, error } = await query
    if (!error && data) {
      return res.json(data)
    }
  } catch (err) {
    // fallback
  }

  if (userId) {
    return res.json(memoryOrders.filter(o => o.user_id === userId))
  }
  return res.json(memoryOrders)
})

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const { data, error } = await supabase.from('orders').select('*').or(`id.eq.${id},order_number.eq.${id}`).single()
    if (!error && data) {
      return res.json(data)
    }
  } catch (err) {
    // fallback
  }

  const found = memoryOrders.find(o => o.id === id || o.order_number === id)
  if (found) return res.json(found)
  return res.status(404).json({ error: 'Pesanan tidak ditemukan' })
})

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      user_email,
      user_name,
      service_id,
      service_name,
      duration_minutes,
      file_link,
      editing_style,
      voucher_code,
      subtotal,
      discount,
      total
    } = req.body

    const orderNumber = `AR-${Math.floor(1000 + Math.random() * 9000)}`

    const newOrder = {
      id: 'ord-' + Date.now(),
      order_number: orderNumber,
      user_id,
      user_email,
      user_name,
      service_id,
      service_name,
      duration_minutes: Number(duration_minutes) || 1,
      file_link,
      editing_style,
      voucher_code,
      subtotal: Number(subtotal) || 10000,
      discount: Number(discount) || 0,
      total: Number(total) || 10000,
      status: 'pending', // pending, paid, editing, review, revision, revising, done
      revision_count: 0,
      max_revisions: 2,
      revisions: [],
      created_at: new Date().toISOString()
    }

    try {
      const { data, error } = await supabase.from('orders').insert([newOrder]).select().single()
      if (!error && data) {
        memoryOrders.unshift(data)
        return res.status(201).json(data)
      }
    } catch (err) {
      // fallback
    }

    memoryOrders.unshift(newOrder)
    return res.status(201).json(newOrder)
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Gagal membuat pesanan' })
  }
})

// POST /api/orders/:id/revision — User Request Revisi (Max 2x)
router.post('/:id/revision', async (req, res) => {
  const { id } = req.params
  const { notes, sections_to_fix, reference_link } = req.body

  if (!notes || !notes.trim()) {
    return res.status(400).json({ error: 'Catatan revisi wajib diisi' })
  }

  try {
    // Find order
    let order = memoryOrders.find(o => o.id === id || o.order_number === id)

    try {
      const { data } = await supabase.from('orders').select('*').or(`id.eq.${id},order_number.eq.${id}`).single()
      if (data) order = data
    } catch {
      // fallback
    }

    if (!order) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' })
    }

    const currentCount = (order.revision_count || 0) + 1
    const maxRevisions = order.max_revisions || 2

    if (currentCount > maxRevisions) {
      return res.status(400).json({
        error: `Batas maksimal revisi (${maxRevisions}x) telah tercapai. Silakan hubungi kami via WhatsApp untuk revisi tambahan.`
      })
    }

    const revisionRecord = {
      id: 'rev-' + Date.now(),
      order_id: order.id,
      revision_number: currentCount,
      notes,
      sections_to_fix: sections_to_fix || [],
      reference_link: reference_link || '',
      status: 'pending',
      created_at: new Date().toISOString()
    }

    order.revision_count = currentCount
    order.status = 'revision'
    order.revisions = [...(order.revisions || []), revisionRecord]

    try {
      await supabase.from('orders').update({
        revision_count: currentCount,
        status: 'revision'
      }).eq('id', order.id)

      await supabase.from('revision_requests').insert([revisionRecord])
    } catch {
      // fallback
    }

    // Update in memory
    const idx = memoryOrders.findIndex(o => o.id === order.id || o.order_number === order.order_number)
    if (idx >= 0) memoryOrders[idx] = order

    return res.json({
      message: `Permintaan revisi ke-${currentCount} berhasil dikirim`,
      order
    })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Gagal mengajukan revisi' })
  }
})

// POST /api/orders/:id/complete — User setujui hasil
router.post('/:id/complete', async (req, res) => {
  const { id } = req.params
  try {
    let order = memoryOrders.find(o => o.id === id || o.order_number === id)
    if (order) {
      order.status = 'done'
      order.completed_at = new Date().toISOString()
    }

    try {
      await supabase.from('orders').update({
        status: 'done',
        completed_at: new Date().toISOString()
      }).or(`id.eq.${id},order_number.eq.${id}`)
    } catch {
      // fallback
    }

    return res.json({ message: 'Pesanan selesai disetujui', order })
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menyelesaikan pesanan' })
  }
})

export default router
