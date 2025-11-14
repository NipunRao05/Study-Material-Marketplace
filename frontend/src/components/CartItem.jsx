import React from 'react'
import { useCart } from '../context/CartContext'

export default function CartItem({ item }) {
  const { removeFromCart } = useCart()

  return (
    <div className="card flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center">
          <span className="text-3xl">📖</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{item.title || item.book_title}</h3>
          <p className="text-sm text-gray-600">{item.author}</p>
          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-primary mb-2">₹{(item.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={() => removeFromCart(item.listing_id)}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Remove
        </button>
      </div>
    </div>
  )
}
