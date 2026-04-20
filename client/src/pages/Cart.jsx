import { Link } from 'react-router-dom'
import { useCartContext } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'
import PageLayout from '../components/layout/PageLayout'
import Button from '../components/common/Button'
import CartEmpty from '../components/cart/CartEmpty'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import CouponInput from '../components/checkout/CouponInput'
import { useApplyCoupon, useRemoveCoupon } from '../hooks/useCart'

const Cart = () => {
  const { cart, items, isEmpty, cartTotal, isLoading } = useCartContext()
  const applyMutation = useApplyCoupon()
  const removeMutation = useRemoveCoupon()

  const deliveryFee = cartTotal >= 150000 ? 0 : 9900 // Free delivery above ₹1500
  const discount = cart?.discountPaise || 0
  const total = cartTotal + deliveryFee - discount

  return (
    <PageLayout>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
        Shopping Cart
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : isEmpty ? (
        <CartEmpty />
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Coupon section */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Have a coupon code?
              </h3>
              <CouponInput
                onApply={(code) => applyMutation.mutate(code)}
                onRemove={() => removeMutation.mutate()}
                appliedCoupon={cart?.coupon}
                isLoading={applyMutation.isPending}
              />
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary
                subtotal={cartTotal}
                deliveryFee={deliveryFee}
                discount={discount}
                total={total}
              />

              <Link to="/checkout">
                <Button className="w-full mt-4" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link
                to="/shop"
                className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium mt-3"
              >
                Continue Shopping
              </Link>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Secure Checkout
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Free Delivery above ₹1500
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Easy Returns & Exchanges
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}

export default Cart
