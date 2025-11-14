import React from 'react'
export default function SearchBar({ value, onChange, placeholder = "Search textbooks..." }) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <span className="absolute left-3 top-3 text-gray-400 text-xl">🔍</span>
    </div>
  )
}
