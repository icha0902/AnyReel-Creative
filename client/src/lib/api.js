import { supabase } from './supabase'

const API_BASE = '/api'

// Initial seed data for fallback if tables are not yet migrated
export const DEFAULT_SERVICES = [
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

export const VOUCHERS = {
  'WELCOME20': {
    code: 'WELCOME20',
    discount_percent: 20,
    max_uses: 20,
    description: 'Voucher 20% untuk pesanan pertama: jadi Rp8.000/menit. Kuota 20 pengguna.'
  }
}

// Local storage helpers for client-side state persistence
export const getLocalOrders = () => {
  try {
    const data = localStorage.getItem('anyreel_orders')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const saveLocalOrder = (order) => {
  const orders = getLocalOrders()
  const existingIdx = orders.findIndex(o => o.id === order.id || o.order_number === order.order_number)
  if (existingIdx >= 0) {
    orders[existingIdx] = { ...orders[existingIdx], ...order }
  } else {
    orders.unshift(order)
  }
  localStorage.setItem('anyreel_orders', JSON.stringify(orders))
  return order
}

export const getLocalCart = () => {
  try {
    const data = localStorage.getItem('anyreel_cart')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const saveLocalCart = (cart) => {
  localStorage.setItem('anyreel_cart', JSON.stringify(cart))
}

// API methods
export const api = {
  // Services
  async getServices() {
    try {
      const res = await fetch(`${API_BASE}/services`)
      if (res.ok) {
        const data = await res.json()
        if (data && data.length > 0) return data
      }
    } catch {
      // Backend offline, try Supabase directly
    }

    try {
      const { data, error } = await supabase.from('services').select('*')
      if (!error && data && data.length > 0) return data
    } catch {
      // fallback
    }

    return DEFAULT_SERVICES
  },

  async getServiceById(id) {
    const services = await this.getServices()
    return services.find(s => s.id === id) || services[0]
  },

  // Vouchers
  validateVoucher(code) {
    const normalized = (code || '').trim().toUpperCase()
    if (VOUCHERS[normalized]) {
      return {
        valid: true,
        voucher: VOUCHERS[normalized],
        message: 'Voucher berhasil digunakan! Diskon 20%'
      }
    }
    return {
      valid: false,
      message: 'Kode voucher tidak valid atau telah habis'
    }
  },

  // Orders
  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      if (res.ok) {
        const saved = await res.json()
        saveLocalOrder(saved)
        return saved
      }
    } catch {
      // fallback
    }

    // Direct local / Supabase fallback
    const orderNumber = `AR-${Math.floor(1000 + Math.random() * 9000)}`
    const newOrder = {
      id: 'ord-' + Date.now(),
      order_number: orderNumber,
      status: 'pending', // pending, paid, editing, review, revision, revising, done
      created_at: new Date().toISOString(),
      revision_count: 0,
      max_revisions: 2,
      revisions: [],
      ...orderData
    }

    try {
      const { data, error } = await supabase.from('orders').insert([newOrder]).select().single()
      if (!error && data) {
        saveLocalOrder(data)
        return data
      }
    } catch {
      // fallback
    }

    saveLocalOrder(newOrder)
    return newOrder
  },

  async getOrders(userId = null) {
    try {
      const res = await fetch(`${API_BASE}/orders${userId ? `?userId=${userId}` : ''}`)
      if (res.ok) return await res.json()
    } catch {
      // fallback
    }

    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
      if (userId) query = query.eq('user_id', userId)
      const { data, error } = await query
      if (!error && data && data.length > 0) return data
    } catch {
      // fallback
    }

    const local = getLocalOrders()
    if (userId) {
      return local.filter(o => o.user_id === userId)
    }
    return local
  },

  async getOrderById(id) {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}`)
      if (res.ok) return await res.json()
    } catch {
      // fallback
    }

    try {
      const { data, error } = await supabase.from('orders').select('*').eq('id', id).single()
      if (!error && data) return data
    } catch {
      // fallback
    }

    const local = getLocalOrders()
    return local.find(o => o.id === id || o.order_number === id) || null
  },

  async updateOrderStatus(id, status, extra = {}) {
    try {
      const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...extra })
      })
      if (res.ok) {
        const saved = await res.json()
        saveLocalOrder(saved)
        return saved
      }
    } catch {
      // fallback
    }

    try {
      const updateData = { status, ...extra }
      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .or(`id.eq.${id},order_number.eq.${id}`)
        .select()
        .single()
      if (!error && data) {
        saveLocalOrder(data)
        return data
      }
    } catch {
      // fallback
    }

    const local = getLocalOrders()
    const target = local.find(o => o.id === id || o.order_number === id)
    if (target) {
      target.status = status
      Object.assign(target, extra)
      saveLocalOrder(target)
      return target
    }
    return null
  },

  async requestRevision(id, revisionData) {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/revision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(revisionData)
      })
      if (res.ok) return await res.json()
    } catch {
      // fallback
    }

    const local = getLocalOrders()
    const order = local.find(o => o.id === id || o.order_number === id)
    if (order) {
      const revCount = (order.revision_count || 0) + 1
      if (revCount > (order.max_revisions || 2)) {
        throw new Error('Batas maksimal revisi (2x) telah tercapai. Hubungi kami via WhatsApp.')
      }

      const revRecord = {
        id: 'rev-' + Date.now(),
        order_id: order.id,
        revision_number: revCount,
        notes: revisionData.notes,
        sections_to_fix: revisionData.sections_to_fix || [],
        reference_link: revisionData.reference_link || '',
        created_at: new Date().toISOString(),
        status: 'pending'
      }

      order.revision_count = revCount
      order.status = 'revision'
      order.revisions = [...(order.revisions || []), revRecord]
      saveLocalOrder(order)
      return order
    }
    throw new Error('Pesanan tidak ditemukan')
  },

  async completeOrder(id) {
    return this.updateOrderStatus(id, 'done', {
      completed_at: new Date().toISOString()
    })
  }
}
