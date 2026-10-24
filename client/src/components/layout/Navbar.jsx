import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { 
  ShoppingBag, 
  User, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck, 
  Menu, 
  X, 
  Film,
  Sparkles
} from 'lucide-react'

export const Navbar = () => {
  const { user, profile, isAdmin, logout } = useAuth()
  const { itemCount } = useCart()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    setDropdownOpen(false)
    navigate('/')
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)'
            }}>
              <Film size={20} color="#fff" />
            </div>
            <span>
              AnyReel <span className="logo-gradient">Creative</span>
            </span>
          </Link>

          {/* Navigation Links (Home, About, Layanan, Kontak) */}
          <ul className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
            <li>
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/about" 
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/layanan" 
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                Layanan
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/kontak" 
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                Kontak
              </NavLink>
            </li>
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            {/* Cart Button */}
            <Link to="/cart" className="cart-btn" aria-label="Keranjang belanja">
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
              )}
            </Link>

            {/* Auth Dropdown / Login Button */}
            {user ? (
              <div className="user-dropdown">
                <button 
                  className="user-dropdown-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--accent-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: '#fff',
                    fontWeight: 700
                  }}>
                    {(user.full_name || user.email)[0].toUpperCase()}
                  </div>
                  <span>{user.full_name || user.email.split('@')[0]}</span>
                </button>

                <div className={`user-dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
                  <div style={{ padding: '8px 14px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {user.full_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      {user.email}
                    </div>
                  </div>
                  <div className="divider" />
                  
                  <Link 
                    to="/dashboard" 
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LayoutDashboard size={16} />
                    <span>Dashboard Saya</span>
                  </Link>

                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      onClick={() => setDropdownOpen(false)}
                      style={{ color: 'var(--accent-cyan-light)' }}
                    >
                      <ShieldCheck size={16} />
                      <span>Panel Admin</span>
                    </Link>
                  )}

                  <div className="divider" />
                  <button onClick={handleLogout} style={{ color: 'var(--error)' }}>
                    <LogOut size={16} />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                <span>Masuk</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
