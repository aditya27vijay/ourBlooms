import { useParams, Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Button from '../components/common/Button'

const OrderSuccess = () => {
  const { orderId } = useParams()

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto text-center py-16">
        {/* Success icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
          Order Confirmed!
        </h1>

        <p className="text-lg text-gray-600 mb-2">
          Thank you for your order. We'll get it ready for delivery soon.
        </p>

        <p className="text-gray-500 mb-8">
          Order ID: <span className="font-mono">#{orderId?.slice(0, 8).toUpperCase()}</span>
        </p>

        {/* Order details card */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
          <h2 className="font-semibold text-gray-900 mb-4">What happens next?</h2>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </span>
              <div>
                <p className="font-medium text-gray-900">Order Confirmation</p>
                <p className="text-sm text-gray-500">You'll receive an email confirmation shortly</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </span>
              <div>
                <p className="font-medium text-gray-900">Preparing Your Bouquet</p>
                <p className="text-sm text-gray-500">Our florists will hand-arrange your flowers</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </span>
              <div>
                <p className="font-medium text-gray-900">Out for Delivery</p>
                <p className="text-sm text-gray-500">You'll receive a tracking link via SMS</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                4
              </span>
              <div>
                <p className="font-medium text-gray-900">Delivered</p>
                <p className="text-sm text-gray-500">Fresh flowers at your doorstep!</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/account/orders">
            <Button>View Order Details</Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}

export default OrderSuccess
