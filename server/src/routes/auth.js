import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { supabase } from '../lib/supabase.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'anyreel_super_secret_jwt_key_2026'

const ADMIN_EMAILS = ['dyladyla328@gmail.com', 'admin@anyreel.com']

// POST /api/auth/register — 1 Email = 1 Akun
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Nama lengkap, email, dan password wajib diisi' })
    }

    const cleanEmail = email.trim().toLowerCase()
    const role = (ADMIN_EMAILS.includes(cleanEmail) || cleanEmail.includes('admin')) ? 'admin' : 'user'

    // Supabase signup
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name, phone, role }
      }
    })

    if (error) {
      if (error.message.includes('already registered')) {
        return res.status(400).json({ error: 'Email ini sudah terdaftar. 1 Email hanya untuk 1 Akun.' })
      }
      return res.status(400).json({ error: error.message })
    }

    const token = jwt.sign(
      { id: data.user.id, email: cleanEmail, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(201).json({
      message: 'Registrasi berhasil',
      user: {
        id: data.user.id,
        email: cleanEmail,
        full_name,
        phone,
        role
      },
      token
    })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Terjadi kesalahan saat registrasi' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const cleanEmail = (email || '').trim().toLowerCase()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    })

    if (error) {
      return res.status(401).json({ error: 'Email atau password salah' })
    }

    const u = data.user
    const role = (ADMIN_EMAILS.includes(cleanEmail) || u.user_metadata?.role === 'admin' || cleanEmail.includes('admin')) ? 'admin' : (u.user_metadata?.role || 'user')

    const token = jwt.sign(
      { id: u.id, email: cleanEmail, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({
      message: 'Login berhasil',
      user: {
        id: u.id,
        email: cleanEmail,
        full_name: u.user_metadata?.full_name || cleanEmail.split('@')[0],
        phone: u.user_metadata?.phone || '',
        role
      },
      token
    })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Terjadi kesalahan saat login' })
  }
})

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  return res.json({ user: req.user })
})

export default router
