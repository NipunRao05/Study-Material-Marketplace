import React, { useState, useEffect } from 'react'
import { listingsAPI } from '../api/api'
import ListingCard from '../components/ListingCard'
import SearchBar from '../components/SearchBar'

export default function Listings() {
  const [listings, setListings] = useState([])
  const [filteredListings, setFilteredListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [conditionFilter, setConditionFilter] = useState('All')

  useEffect(() => {
    fetchListings()
  }, [])

  useEffect(() => {
    filterListings()
  }, [searchQuery, conditionFilter, listings])

  const fetchListings = async () => {
    try {
      const response = await listingsAPI.getAll()
      setListings(response.data || [])
      setFilteredListings(response.data || [])
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterListings = () => {
    let filtered = listings

    if (searchQuery) {
      filtered = filtered.filter((listing) => {
        const title = (listing.Title || '').toLowerCase()
        const author = (listing.Author || '').toLowerCase()
        const query = searchQuery.toLowerCase()
        return title.includes(query) || author.includes(query)
      })
    }

    if (conditionFilter !== 'All') {
      filtered = filtered.filter((listing) => listing.Condition === conditionFilter)
    }

    setFilteredListings(filtered)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Textbooks</h1>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        
        <div className="flex gap-2 flex-wrap">
          {['All', 'New', 'Like New', 'Good', 'Fair', 'Poor'].map((condition) => (
            <button
              key={condition}
              onClick={() => setConditionFilter(condition)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                conditionFilter === condition
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {condition}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No textbooks found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.ListingID} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}
