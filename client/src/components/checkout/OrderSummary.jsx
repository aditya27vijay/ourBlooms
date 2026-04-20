import { formatPrice } from '../../utils/formatPrice'

const OrderSummary = ({ items, subtotal, deliveryFee, discount, total }) => {
  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

      {/* Items */}
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.product?.images?.[0] || '/placeholder-product.jpg'}
                alt={item.product?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{item.product?.name}</p>
              <p className="text-sm text-gray-500">
                Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
              </p>
              <p className="text-sm font-medium text-primary-600 mt-1">
                {formatPrice(item.product?.pricePaise * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-medium text-gray-900">
            {deliveryFee === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatPrice(deliveryFee)
            )}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium text-green-600">- {formatPrice(discount)}</span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-2 flex justify-between">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-xl text-primary-600">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
