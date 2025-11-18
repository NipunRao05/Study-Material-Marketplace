import React,{ useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listingsAPI } from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function AddListing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    edition: '',
    course_code: '',
    price: '',
    condition: 'Good',
    quantity: '1',
    description: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await listingsAPI.create({
        seller_id: user.UserID,
        title: formData.title,
        author: formData.author,
        edition: formData.edition,
        course_code: formData.course_code,
        price: parseFloat(formData.price),
        condition: formData.condition,
        quantity: parseInt(formData.quantity),
        description: formData.description,
      })
      
      alert('Listing created successfully!')
      navigate('/listings')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Sell Your Textbook</h1>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Introduction to Algorithms"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Cormen, Leiserson, Rivest"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edition
              </label>
              <input
                type="text"
                name="edition"
                value={formData.edition}
                onChange={handleChange}
                className="input-field"
                placeholder="3rd Edition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Code
              </label>
              <input
                type="text"
                name="course_code"
                value={formData.course_code}
                onChange={handleChange}
                className="input-field"
                placeholder="CS101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="input-field"
                placeholder="500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="input-field"
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                className="input-field"
                placeholder="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input-field"
              placeholder="Any additional details about the book..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/listings')}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
