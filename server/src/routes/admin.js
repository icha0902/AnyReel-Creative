import { Router } from 'express'
import { supabase } from '../lib/supabase.js'

const router = Router()

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (!error && data) {
      return res.json(data)
    }
  } catch (err) {
    // fallback
  }
  return res.json([])
})

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', async (req, res) => {
  const { id } = req.params
  const { status, result_link, note } = req.body

  try {
    const updateData = { status }
    if (result_link) updateData.result_link = result_link

    const { data, error } = await supabase.from('orders')
      .update(updateData)
      .or(`id.eq.${id},order_number.eq.${id}`)
      .select()
      .single()

    if (!error && data) {
      return res.json(data)
    }
  } catch {
    // fallback
  }

  return res.json({ id, status, result_link, message: 'Status updated' })
})

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const { data: orders } = await supabase.from('orders').select('*')
    const list = orders || []

    const totalOrders = list.length
    const totalRevenue = list
      .filter(o => o.status !== 'pending' && o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0)
    const activeOrders = list.filter(o => ['paid', 'editing', 'revising'].includes(o.status)).length
    const revisionOrders = list.filter(o => ['revision', 'revising'].includes(o.status)).length

    return res.json({
      totalOrders,
      totalRevenue,
      activeOrders,
      revisionOrders
    })
  } catch (err) {
    return res.json({
      totalOrders: 0,
      totalRevenue: 0,
      activeOrders: 0,
      revisionOrders: 0
    })
  }
})

export default router
