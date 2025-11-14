import React from "react";
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartItems } = useCart()

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">📚 BookSwap</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/listings" className="text-gray-700 hover:text-primary px-3 py-2 font-medium">
                Browse
              </Link>
              {user && (
                <Link to="/add-listing" className="text-gray-700 hover:text-primary px-3 py-2 font-medium">
                  Sell
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/cart" className="relative text-gray-700 hover:text-primary">
                  <span className="text-2xl">🛒</span>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-primary px-3 py-2 font-medium">
                  Profile
                </Link>
                <button onClick={logout} className="btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary px-3 py-2 font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
