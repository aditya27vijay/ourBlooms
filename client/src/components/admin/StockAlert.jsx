import { Link } from 'react-router-dom'
import Badge from '../common/Badge'

const StockAlert = ({ products = [] }) => {
  if (products.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-800 font-medium">All products are well stocked!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
        <p className="text-sm text-gray-500 mt-1">
          {products.length} products need restocking
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images?.[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">
                  Stock: {product.stockQty} units
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={product.stockQty <= 5 ? 'danger' : 'warning'}
              >
                {product.stockQty <= 5 ? 'Critical' : 'Low'}
              </Badge>
              <Link
                to={`/admin/products?edit=${product.id}`}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <Link
          to="/admin/products"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all products →
        </Link>
      </div>
    </div>
  )
}

export default StockAlert
