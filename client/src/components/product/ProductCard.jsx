import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { formatPrice } from '../../utils/formatPrice'

const ProductCard = ({ product, onAddToCart }) => {
  const {
    id,
    name,
    slug,
    images,
    pricePaise,
    stockQty,
    isSeasonal,
    category,
  } = product

  const isOutOfStock = stockQty === 0
  const mainImage = images?.[0] || '/placeholder-product.jpg'

  return (
    <div className="group card overflow-hidden">
      {/* Image container */}
      <Link to={`/product/${slug}`} className="block relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isSeasonal && (
            <span className="bg-floral-lavender text-floral-burgundy text-xs font-semibold px-2 py-1 rounded">
              Seasonal
            </span>
          )}
          {!isOutOfStock && stockQty < 10 && (
            <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded">
              Only {stockQty} left
            </span>
          )}
        </div>

        {/* Quick add button */}
        {!isOutOfStock && (
          <button
            onClick={(e) => {
              e.preventDefault()
              onAddToCart?.(id)
            }}
            className="absolute bottom-2 right-2 bg-white hover:bg-primary-600 hover:text-white text-gray-900 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
            aria-label="Add to cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 font-semibold px-4 py-2 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product info */}
      <div className="p-4">
        {category && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {category.name}
          </p>
        )}
        <Link to={`/product/${slug}`}>
          <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>
        <p className="mt-1 text-primary-600 font-bold">
          {formatPrice(pricePaise)}
        </p>
      </div>
    </div>
  )
}

export default ProductCard
