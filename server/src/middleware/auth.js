import jwt from 'jsonwebtoken'
import { supabase } from '../lib/supabase.js'

const JWT_SECRET = process.env.JWT_SECRET || 'anyreel_super_secret_jwt_key_2026'

const ADMIN_EMAILS = ['dyladyla328@gmail.com', 'admin@anyreel.com']

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token autentikasi tidak ditemukan' })
    }

    const token = authHeader.split(' ')[1]

    // 1. Try verify with JWT
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      if (ADMIN_EMAILS.includes((decoded.email || '').toLowerCase())) {
        decoded.role = 'admin'
      }
      req.user = decoded
      return next()
    } catch {
      // 2. Try verify with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token)
      if (error || !user) {
        return res.status(401).json({ error: 'Sesi kedaluwarsa atau token tidak valid' })
      }
      const isEmailAdmin = ADMIN_EMAILS.includes((user.email || '').toLowerCase()) || user.email.includes('admin')
      req.user = {
        id: user.id,
        email: user.email,
        role: isEmailAdmin ? 'admin' : (user.user_metadata?.role || 'user')
      }
      return next()
    }
  } catch (err) {
    return res.status(500).json({ error: 'Autentikasi gagal' })
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }
  return res.status(403).json({ error: 'Akses ditolak: Hanya untuk Administrator' })
}
