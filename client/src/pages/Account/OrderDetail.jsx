import { useParams, Link } from 'react-router-dom'
import { useOrder } from '../../hooks/useOrders'
import { formatPrice } from '../../utils/formatPrice'
import { formatDate } from '../../utils/dateHelpers'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../utils/constants'
import PageLayout from '../../components/layout/PageLayout'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'

const OrderDetail = () => {
  const { orderId } = useParams()
  const { data: orderResponse, isLoading } = useOrder(orderId)
  const order = orderResponse?.data

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center py-16">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    )
  }

  if (!order) {
    return (
      <PageLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
          <Link to="/account/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-8">
        <Link to="/account/orders" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Orders
        </Link>
        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Order Details
            </h1>
            <p className="text-gray-500 mt-1">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <Badge className={ORDER_STATUS_COLORS[order.status]} size="lg">
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product?.images?.[0] || '/placeholder-product.jpg'}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Link
                      to={`/product/${item.product?.slug}`}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {item.product?.name}
                    </Link>
                    {item.size && (
                      <p className="text-sm text-gray-500 capitalize">Size: {item.size}</p>
                    )}
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.product?.pricePaise * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery info */}
          <div className="mt-6 bg-white rounded-xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Delivery Address</h3>
                <address className="not-italic text-gray-900">
                  {order.address?.name}<br />
                  {order.address?.addressLine1}<br />
                  {order.address?.addressLine2 && <>{order.address.addressLine2}<br /></>}
                  {order.address?.city}, {order.address?.state} {order.address?.pincode}<br />
                  {order.address?.phone}
                </address>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Delivery Slot</h3>
                <p className="text-gray-900">
                  {order.deliverySlot?.date && formatDate(order.deliverySlot.date)}
                </p>
                <p className="text-gray-600">
                  {order.deliverySlot?.startTime} - {order.deliverySlot?.endTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(order.subtotalPaise)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(order.deliveryFeePaise || 0)}
                </span>
              </div>
              {order.discountPaise > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">
                    - {formatPrice(order.discountPaise)}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-primary-600">
                    {formatPrice(order.totalPaise)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">Payment Method</h3>
              <p className="text-gray-900 capitalize">{order.paymentProvider || 'Razorpay'}</p>
              {order.paymentRef && (
                <p className="text-xs text-gray-500 mt-1 font-mono">
                  {order.paymentRef}
                </p>
              )}
            </div>

            {/* Order timeline */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-700 mb-3">Order Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full" />
                  <span className="text-sm text-gray-600">
                    Placed on {formatDate(order.createdAt, true)}
                  </span>
                </div>
                {order.deliveredAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span className="text-sm text-gray-600">
                      Delivered on {formatDate(order.deliveredAt, true)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {order.status === 'pending' && (
              <Button variant="danger" className="w-full mt-4">
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default OrderDetail
