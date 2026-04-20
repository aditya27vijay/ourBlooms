import { useRemoveCartItem, useUpdateCartItem } from '../../hooks/useCart'
import { formatPrice } from '../../utils/formatPrice'

const CartItem = ({ item }) => {
  const removeMutation = useRemoveCartItem()
  const updateMutation = useUpdateCartItem()

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return
    await updateMutation.mutateAsync({ itemId: item.id, quantity: newQuantity })
  }

  const handleRemove = async () => {
    await removeMutation.mutateAsync(item.id)
  }

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100">
      {/* Image */}
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={item.product?.images?.[0] || '/placeholder-product.jpg'}
          alt={item.product?.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{item.product?.name}</h4>
        {item.size && (
          <p className="text-sm text-gray-500 capitalize mt-1">Size: {item.size}</p>
        )}
        <p className="text-primary-600 font-semibold mt-1">
          {formatPrice(item.product?.pricePaise)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
            disabled={item.quantity <= 1}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
            disabled={item.quantity >= 10}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={handleRemove}
        className="text-gray-400 hover:text-red-600 transition-colors self-start"
        aria-label="Remove item"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}

export default CartItem
