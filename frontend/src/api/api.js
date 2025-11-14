import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL 
  // || 'http://localhost:5000/api',
})

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

// Listings API
export const listingsAPI = {
  getAll: (params) => api.get('/listings', { params }),
  getById: (id) => api.get(`/listings/${id}`),
  create: (data) => api.post('/listings', data),
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
}

// Cart API
export const cartAPI = {
  get: (userId) => api.get(`/cart/${userId}`),
  add: (data) => api.post('/cart/add', data),
  remove: (data) => api.post('/cart/remove', data),
}

// Orders API
export const ordersAPI = {
  checkout: (data) => api.post('/orders/checkout', data),
  getUserOrders: (userId) => api.get(`/orders/${userId}`),
}

export default api
