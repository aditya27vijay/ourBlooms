import { useState, useMemo } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCartContext } from '../context/CartContext'
import { useDebounce } from '../hooks/useDebounce'
import PageLayout from '../components/layout/PageLayout'
import ProductGrid from '../components/product/ProductGrid'
import ProductFilters from '../components/product/ProductFilters'
import Input from '../components/common/Input'
import Select from '../components/common/Select'

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [filters, setFilters] = useState({})
  const [currentPage, setCurrentPage] = useState(1)

  const { addItem } = useCartContext()
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Build query params
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: 12,
    search: debouncedSearch || undefined,
    category: filters.category || undefined,
    minPrice: filters.minPrice ? parseFloat(filters.minPrice) * 100 : undefined,
    maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) * 100 : undefined,
    inStock: filters.inStock || undefined,
    seasonal: filters.seasonal || undefined,
    sort: sortBy || undefined,
  }), [currentPage, debouncedSearch, filters, sortBy])

  const { data: productsResponse, isLoading } = useProducts(queryParams)
  const products = productsResponse?.data?.products || []
  const pagination = productsResponse?.data?.pagination

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchQuery('')
    setSortBy('')
    setCurrentPage(1)
  }

  const sortOptions = [
    { value: '', label: 'Featured' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'newest', label: 'Newest First' },
  ]

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">
          Shop All Flowers
        </h1>
        <p className="text-gray-600 mt-2">
          Discover our collection of fresh, hand-arranged bouquets
        </p>
      </div>

      {/* Search and sort bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search flowers, bouquets..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            leftElement={
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={sortOptions}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </div>

        {/* Product grid */}
        <div className="lg:col-span-3">
          <ProductGrid
            products={products}
            isLoading={isLoading}
            onAddToCart={addItem}
            columns={3}
          />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default Shop
