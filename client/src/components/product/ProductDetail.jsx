import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useProduct, useRelatedProducts } from '../../hooks/useProducts'
import { useCartContext } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'
import { BOUQUET_SIZES } from '../../utils/constants'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import ProductGrid from './ProductGrid'
import ImageCarousel from './ImageCarousel'

const ProductDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCartContext()
  const { data: productResponse, isLoading } = useProduct(slug)
  const { data: relatedResponse } = useRelatedProducts(productResponse?.data?.id)

  const [selectedSize, setSelectedSize] = useState('medium')
  const [quantity, setQuantity] = useState(1)

  const product = productResponse?.data
  const relatedProducts = relatedResponse?.data

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>
    )
  }

  const sizeMultiplier = BOUQUET_SIZES[selectedSize.toUpperCase()]?.priceMultiplier || 1
  const finalPrice = Math.round(product.pricePaise * sizeMultiplier)
  const isOutOfStock = product.stockQty === 0

  const handleAddToCart = () => {
    addItem(product.id, quantity, selectedSize)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <a href="/shop" className="hover:text-primary-600">Shop</a>
        <span>/</span>
        <a href={`/shop?category=${product.category?.slug}`} className="hover:text-primary-600">
          {product.category?.name}
        </a>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      {/* Product detail */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div>
          <ImageCarousel images={product.images || []} alt={product.name} />
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <span className="text-sm text-primary-600 font-medium uppercase tracking-wide">
              {product.category.name}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-2">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-4">
            <span className="text-3xl font-bold text-primary-600">
              {formatPrice(finalPrice)}
            </span>
            {sizeMultiplier > 1 && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.pricePaise)}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div className="mt-4">
            {isOutOfStock ? (
              <span className="text-red-600 font-medium">Out of Stock</span>
            ) : product.stockQty < 10 ? (
              <span className="text-orange-600 font-medium">
                Only {product.stockQty} left in stock
              </span>
            ) : (
              <span className="text-green-600 font-medium">In Stock</span>
            )}
          </div>

          {/* Description */}
          <div
            className="mt-6 prose prose-gray"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          {/* Size selector */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Select Size</h3>
            <div className="flex gap-3">
              {Object.entries(BOUQUET_SIZES).map(([key, { label, priceMultiplier }]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSize(key.toLowerCase())}
                  className={clsx(
                    'px-4 py-3 border-2 rounded-lg font-medium transition-colors',
                    selectedSize === key.toLowerCase()
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  {label}
                  {priceMultiplier > 1 && (
                    <span className="block text-xs text-gray-500">
                      +{((priceMultiplier - 1) * 100).toFixed(0)}%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                disabled={quantity >= 10}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1"
              size="lg"
            >
              {isOutOfStock ? 'Out of Stock' : `Add to Cart - ${formatPrice(finalPrice * quantity)}`}
            </Button>
          </div>

          {/* Features */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <dl className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Fresh & Hand-arranged</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Same-day Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Free Card Message</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Easy Returns</span>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
            You May Also Like
          </h2>
          <ProductGrid products={relatedProducts} onAddToCart={addItem} />
        </section>
      )}
    </div>
  )
}

export default ProductDetail
