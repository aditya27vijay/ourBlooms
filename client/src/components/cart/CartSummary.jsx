import { formatPrice } from '../../utils/formatPrice'

const CartSummary = ({
  subtotal,
  deliveryFee = 0,
  discount = 0,
  total,
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

      <dl className="space-y-3">
        <div className="flex items-center justify-between">
          <dt className="text-gray-600">Subtotal</dt>
          <dd className="font-medium text-gray-900">{formatPrice(subtotal)}</dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-gray-600">Delivery Fee</dt>
          <dd className="font-medium text-gray-900">
            {deliveryFee === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatPrice(deliveryFee)
            )}
          </dd>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between">
            <dt className="text-gray-600">Discount</dt>
            <dd className="font-medium text-green-600">- {formatPrice(discount)}</dd>
          </div>
        )}

        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between">
            <dt className="text-base font-semibold text-gray-900">Total</dt>
            <dd className="text-xl font-bold text-primary-600">{formatPrice(total)}</dd>
          </div>
        </div>
      </dl>

      <p className="mt-4 text-xs text-gray-500">
        Includes all taxes and charges
      </p>
    </div>
  )
}

export default CartSummary
