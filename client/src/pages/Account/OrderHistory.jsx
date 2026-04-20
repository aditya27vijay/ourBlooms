import { Link } from 'react-router-dom'
import { useOrders } from '../../hooks/useOrders'
import { formatPrice } from '../../utils/formatPrice'
import { formatDate } from '../../utils/dateHelpers'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../utils/constants'
import PageLayout from '../../components/layout/PageLayout'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'

const OrderHistory = () => {
  const { data: ordersResponse, isLoading } = useOrders({ limit: 20 })
  const orders = ordersResponse?.data

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </PageLayout>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <PageLayout>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
          My Orders
        </h1>
        <EmptyState
          title="No orders yet"
          description="Start shopping to see your orders here"
          actionLabel="Browse Products"
          onAction={() => (window.location.href = '/shop')}
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
        My Orders
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/account/orders/${order.id}`}
            className="block bg-white rounded-xl shadow-card hover:shadow-soft transition-shadow"
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-gray-500">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <Badge className={ORDER_STATUS_COLORS[order.status]}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                  <p className="text-gray-900">
                    {order.items?.length || 0} items • {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-bold text-primary-600">
                      {formatPrice(order.totalPaise)}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Order items preview */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3 overflow-x-auto">
                {order.items?.slice(0, 4).map((item, index) => (
                  <div key={index} className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.product?.images?.[0] || '/placeholder-product.jpg'}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {order.items?.length > 4 && (
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-gray-500">+{order.items.length - 4}</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  )
}

export default OrderHistory
