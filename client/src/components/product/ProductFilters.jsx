import { useState } from 'react'
import clsx from 'clsx'
import { useCategories } from '../../hooks/useProducts'
import { formatPriceNumber, toPaise } from '../../utils/formatPrice'
import Button from '../common/Button'

const ProductFilters = ({
  filters = {},
  onFilterChange,
  onClear,
}) => {
  const { data: categoriesResponse } = useCategories()
  const categories = categoriesResponse?.data || []

  const [localFilters, setLocalFilters] = useState({
    category: filters.category || '',
    minPrice: filters.minPrice ? formatPriceNumber(filters.minPrice) : '',
    maxPrice: filters.maxPrice ? formatPriceNumber(filters.maxPrice) : '',
    inStock: filters.inStock || false,
    seasonal: filters.seasonal || false,
  })

  const handleChange = (key, value) => {
    const updated = { ...localFilters, [key]: value }
    setLocalFilters(updated)
    onFilterChange?.(updated)
  }

  const handleClear = () => {
    const cleared = {
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      seasonal: false,
    }
    setLocalFilters(cleared)
    onClear?.()
  }

  const activeFilterCount = Object.values(localFilters).filter(
    (v) => v !== '' && v !== false
  ).length

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={handleClear}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={localFilters.category === ''}
              onChange={() => handleChange('category', '')}
              className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">All Categories</span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={localFilters.category === category.slug}
                onChange={() => handleChange('category', category.slug)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
            <input
              type="number"
              placeholder="Min"
              value={localFilters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
            <input
              type="number"
              placeholder="Max"
              value={localFilters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Availability</h3>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={localFilters.inStock}
            onChange={(e) => handleChange('inStock', e.target.checked)}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
        </label>
      </div>

      {/* Seasonal */}
      <div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={localFilters.seasonal}
            onChange={(e) => handleChange('seasonal', e.target.checked)}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">Seasonal Only</span>
        </label>
      </div>
    </div>
  )
}

export default ProductFilters
