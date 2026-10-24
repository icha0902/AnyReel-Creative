import { createContext, useContext, useState, useEffect } from 'react'
import { getLocalCart, saveLocalCart, api } from '../lib/api'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [voucher, setVoucher] = useState(null)

  useEffect(() => {
    const loaded = getLocalCart()
    setItems(loaded)
  }, [])

  const saveItems = (newItems) => {
    setItems(newItems)
    saveLocalCart(newItems)
  }

  const addToCart = (item) => {
    const newItem = {
      id: 'cart-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      service_id: item.service_id,
      service_name: item.service_name,
      category: item.category,
      price_per_minute: item.price_per_minute || 10000,
      duration_minutes: Number(item.duration_minutes) || 1,
      file_link: item.file_link || '',
      editing_style: item.editing_style || '',
      notes: item.notes || '',
      added_at: new Date().toISOString()
    }

    const updated = [...items, newItem]
    saveItems(updated)
    toast.success('Layanan berhasil ditambahkan ke keranjang! 🛒')
    return newItem
  }

  const removeFromCart = (id) => {
    const updated = items.filter(i => i.id !== id)
    saveItems(updated)
    toast.success('Item dihapus dari keranjang')
  }

  const updateDuration = (id, duration) => {
    const dur = Math.max(1, Number(duration) || 1)
    const updated = items.map(i => i.id === id ? { ...i, duration_minutes: dur } : i)
    saveItems(updated)
  }

  const clearCart = () => {
    saveItems([])
    setVoucher(null)
  }

  const applyVoucher = (code) => {
    const res = api.validateVoucher(code)
    if (res.valid) {
      setVoucher(res.voucher)
      toast.success(res.message)
      return { success: true, voucher: res.voucher }
    } else {
      toast.error(res.message)
      return { success: false, message: res.message }
    }
  }

  const removeVoucher = () => {
    setVoucher(null)
    toast.success('Voucher dibatalkan')
  }

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.price_per_minute * item.duration_minutes), 0)
  const discountAmount = voucher ? Math.round(subtotal * (voucher.discount_percent / 100)) : 0
  const total = Math.max(0, subtotal - discountAmount)

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: items.length,
        addToCart,
        removeFromCart,
        updateDuration,
        clearCart,
        voucher,
        applyVoucher,
        removeVoucher,
        subtotal,
        discountAmount,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
