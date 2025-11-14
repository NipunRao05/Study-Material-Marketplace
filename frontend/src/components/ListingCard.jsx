import React from 'react'
import { Link } from 'react-router-dom'

export default function ListingCard({ listing }) {
  const conditionColors = {
    'New': 'bg-green-100 text-green-800',
    'Like New': 'bg-blue-100 text-blue-800',
    'Good': 'bg-yellow-100 text-yellow-800',
    'Fair': 'bg-orange-100 text-orange-800',
  }

  return (
    <Link to={`/listings/${listing.ListingID}`} className="card hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center mb-4">
        <span className="text-6xl">📖</span>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {listing.Title}
      </h3>

      <p className="text-sm text-gray-600 mb-3">{listing.Author}</p>

      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-primary">₹{listing.Price}</span>
        <span className={`text-xs px-2 py-1 rounded ${conditionColors[listing.Condition] || 'bg-gray-100'}`}>
          {listing.Condition}
        </span>
      </div>
    </Link>
  )
}
