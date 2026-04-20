import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/dateHelpers'
import { formatPrice } from '../../utils/formatPrice'
import { SUBSCRIPTION_FREQUENCY_LABELS, SUBSCRIPTION_STATUS } from '../../utils/constants'
import PageLayout from '../../components/layout/PageLayout'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'

const Subscriptions = () => {
  // Placeholder subscriptions - would be fetched from API
  const subscriptions = []

  const getStatusBadge = (status) => {
    const variants = {
      [SUBSCRIPTION_STATUS.ACTIVE]: 'success',
      [SUBSCRIPTION_STATUS.PAUSED]: 'warning',
      [SUBSCRIPTION_STATUS.CANCELLED]: 'danger',
    }
    return variants[status] || 'default'
  }

  if (subscriptions.length === 0) {
    return (
      <PageLayout>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
          My Subscriptions
        </h1>
        <EmptyState
          title="No active subscriptions"
          description="Subscribe to get fresh flowers delivered regularly"
          actionLabel="View Plans"
          onAction={() => (window.location.href = '/shop')}
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
        My Subscriptions
      </h1>

      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <div
            key={subscription.id}
            className="bg-white rounded-xl shadow-card p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {subscription.product?.name}
                  </h3>
                  <Badge variant={getStatusBadge(subscription.status)}>
                    {subscription.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {SUBSCRIPTION_FREQUENCY_LABELS[subscription.frequency]} •{' '}
                  {formatPrice(subscription.pricePaise)} / delivery
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Next Delivery</p>
                <p className="font-medium text-gray-900">
                  {subscription.nextDelivery ? formatDate(subscription.nextDelivery) : 'N/A'}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500 uppercase">Started On</p>
                <p className="text-sm text-gray-900">{formatDate(subscription.startDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Total Deliveries</p>
                <p className="text-sm text-gray-900">{subscription.totalDeliveries || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Delivered So Far</p>
                <p className="text-sm text-gray-900">{subscription.deliveredCount || 0}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              {subscription.status === SUBSCRIPTION_STATUS.ACTIVE && (
                <>
                  <Button variant="outline" size="sm">
                    Pause Subscription
                  </Button>
                  <Button variant="danger" size="sm">
                    Cancel
                  </Button>
                </>
              )}
              {subscription.status === SUBSCRIPTION_STATUS.PAUSED && (
                <Button size="sm">Resume Subscription</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}

export default Subscriptions
