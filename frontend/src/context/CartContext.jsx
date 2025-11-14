import React,{ createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { cartAPI } from '../api/api'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setCartItems([])
    }
  }, [user])

  const fetchCart = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const response = await cartAPI.get(user.user_id)
      setCartItems(response.data || [])
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (listing, quantity = 1) => {
    if (!user) {
      return { success: false, error: 'Please login first' }
    }

    try {
      await cartAPI.add({
        user_id: user.user_id,
        listing_id: listing.listing_id,
        quantity,
      })
      await fetchCart()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to add to cart' }
    }
  }

  const removeFromCart = async (listingId) => {
    if (!user) return

    try {
      await cartAPI.remove({
        user_id: user.user_id,
        listing_id: listingId,
      })
      await fetchCart()
    } catch (error) {
      console.error('Failed to remove from cart:', error)
    }
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)

  const value = {
    cartItems,
    cartTotal,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    fetchCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
