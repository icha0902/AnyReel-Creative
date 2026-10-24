import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export const ADMIN_EMAILS = [
  'dyladyla328@gmail.com',
  'admin@anyreel.com'
]

export const isAdminEmail = (email) => {
  if (!email) return false
  const clean = email.trim().toLowerCase()
  return ADMIN_EMAILS.includes(clean) || clean.includes('admin')
}

// Default demo users
const DEMO_USERS = {
  'admin@anyreel.com': {
    id: 'usr-admin-01',
    email: 'admin@anyreel.com',
    full_name: 'Admin AnyReel',
    role: 'admin',
    phone: '081234567890'
  },
  'user@gmail.com': {
    id: 'usr-user-01',
    email: 'user@gmail.com',
    full_name: 'Kreator AnyReel',
    role: 'user',
    phone: '089876543210'
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const resolveRole = (u, prof = null) => {
    if (isAdminEmail(u?.email)) return 'admin'
    if (prof?.role === 'admin') return 'admin'
    if (u?.user_metadata?.role === 'admin' || u?.app_metadata?.role === 'admin') return 'admin'
    return prof?.role || u?.user_metadata?.role || 'user'
  }

  // Initialize auth state
  useEffect(() => {
    // 1. Check local stored session first
    const savedUser = localStorage.getItem('anyreel_auth_user')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        if (isAdminEmail(parsed.email)) {
          parsed.role = 'admin'
        }
        setUser(parsed)
        setProfile(parsed)
      } catch (e) {
        console.error(e)
      }
    }

    // 2. Sync with Supabase session if available
    const checkSupabase = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const u = session.user
          // Fetch profile from supabase profiles table
          let prof = null
          try {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', u.id)
              .single()
            prof = data
          } catch {
            // profiles table might still be migrating
          }

          const role = resolveRole(u, prof)
          const finalUser = {
            id: u.id,
            email: u.email,
            full_name: prof?.full_name || u.user_metadata?.full_name || (u.email === 'dyladyla328@gmail.com' ? 'aichayy matcha' : u.email.split('@')[0]),
            role,
            phone: prof?.phone || u.user_metadata?.phone || (u.email === 'dyladyla328@gmail.com' ? '085754051605' : '')
          }
          setUser(finalUser)
          setProfile(finalUser)
          localStorage.setItem('anyreel_auth_user', JSON.stringify(finalUser))
        }
      } catch (err) {
        console.log('Supabase session check:', err.message)
      } finally {
        setLoading(false)
      }
    }

    checkSupabase()

    // 3. Listen to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const u = session.user
        const role = resolveRole(u)
        const finalUser = {
          id: u.id,
          email: u.email,
          full_name: u.user_metadata?.full_name || (u.email === 'dyladyla328@gmail.com' ? 'aichayy matcha' : u.email.split('@')[0]),
          role,
          phone: u.user_metadata?.phone || (u.email === 'dyladyla328@gmail.com' ? '085754051605' : '')
        }
        setUser(finalUser)
        setProfile(finalUser)
        localStorage.setItem('anyreel_auth_user', JSON.stringify(finalUser))
      } else if (event === 'SIGNED_OUT') {
        const current = localStorage.getItem('anyreel_auth_user')
        if (current && !JSON.parse(current).is_demo) {
          setUser(null)
          setProfile(null)
          localStorage.removeItem('anyreel_auth_user')
        }
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  // Register: 1 Email = 1 Akun
  const register = async ({ email, password, full_name, phone = '' }) => {
    const cleanEmail = email.trim().toLowerCase()
    const role = isAdminEmail(cleanEmail) ? 'admin' : 'user'

    // Check if email already registered locally
    const existingAccounts = JSON.parse(localStorage.getItem('anyreel_registered_emails') || '[]')
    if (existingAccounts.includes(cleanEmail)) {
      throw new Error('Email ini sudah terdaftar. 1 Email hanya untuk 1 Akun.')
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name,
            phone,
            role
          }
        }
      })

      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('Email ini sudah terdaftar. 1 Email hanya untuk 1 Akun.')
        }
        throw error
      }

      // Record email
      existingAccounts.push(cleanEmail)
      localStorage.setItem('anyreel_registered_emails', JSON.stringify(existingAccounts))

      const newUser = {
        id: data.user?.id || 'usr-' + Date.now(),
        email: cleanEmail,
        full_name,
        phone,
        role
      }

      setUser(newUser)
      setProfile(newUser)
      localStorage.setItem('anyreel_auth_user', JSON.stringify(newUser))
      return newUser
    } catch (err) {
      if (err.message && (err.message.includes('fetch') || err.message.includes('Network'))) {
        const newUser = {
          id: 'usr-' + Date.now(),
          email: cleanEmail,
          full_name,
          phone,
          role
        }
        existingAccounts.push(cleanEmail)
        localStorage.setItem('anyreel_registered_emails', JSON.stringify(existingAccounts))
        setUser(newUser)
        setProfile(newUser)
        localStorage.setItem('anyreel_auth_user', JSON.stringify(newUser))
        return newUser
      }
      throw err
    }
  }

  // Login
  const login = async ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase()
    const defaultRole = isAdminEmail(cleanEmail) ? 'admin' : 'user'

    // Demo account quick login
    if (DEMO_USERS[cleanEmail] && (password === 'password' || password === 'admin123' || password.length >= 6)) {
      const demo = { ...DEMO_USERS[cleanEmail], is_demo: true }
      setUser(demo)
      setProfile(demo)
      localStorage.setItem('anyreel_auth_user', JSON.stringify(demo))
      return demo
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      })

      if (error) {
        // Fallback for custom accounts created during testing
        const saved = localStorage.getItem('anyreel_auth_user')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.email === cleanEmail) {
            if (isAdminEmail(cleanEmail)) parsed.role = 'admin'
            setUser(parsed)
            setProfile(parsed)
            return parsed
          }
        }
        throw error
      }

      const u = data.user
      const role = resolveRole(u)
      const finalUser = {
        id: u.id,
        email: u.email,
        full_name: u.user_metadata?.full_name || (cleanEmail === 'dyladyla328@gmail.com' ? 'aichayy matcha' : u.email.split('@')[0]),
        role,
        phone: u.user_metadata?.phone || (cleanEmail === 'dyladyla328@gmail.com' ? '085754051605' : '')
      }

      setUser(finalUser)
      setProfile(finalUser)
      localStorage.setItem('anyreel_auth_user', JSON.stringify(finalUser))
      return finalUser
    } catch (err) {
      // Local fallback account support
      const localUsers = JSON.parse(localStorage.getItem('anyreel_registered_users') || '{}')
      if (localUsers[cleanEmail] && localUsers[cleanEmail].password === password) {
        const u = localUsers[cleanEmail]
        if (isAdminEmail(cleanEmail)) u.role = 'admin'
        setUser(u)
        setProfile(u)
        localStorage.setItem('anyreel_auth_user', JSON.stringify(u))
        return u
      }
      throw err
    }
  }

  // Quick switch role (legacy compatibility)
  const switchDemoRole = (role) => {
    if (role === 'admin') {
      const admin = { ...DEMO_USERS['admin@anyreel.com'], is_demo: true }
      setUser(admin)
      setProfile(admin)
      localStorage.setItem('anyreel_auth_user', JSON.stringify(admin))
    } else {
      const regular = { ...DEMO_USERS['user@gmail.com'], is_demo: true }
      setUser(regular)
      setProfile(regular)
      localStorage.setItem('anyreel_auth_user', JSON.stringify(regular))
    }
  }

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      // ignore
    }
    setUser(null)
    setProfile(null)
    localStorage.removeItem('anyreel_auth_user')
  }

  const isUserAdmin = profile?.role === 'admin' || user?.role === 'admin' || isAdminEmail(user?.email)

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        switchDemoRole,
        isAdmin: isUserAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
