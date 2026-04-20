import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartContext } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useCreateOrder, useVerifyPayment } from '../hooks/useOrders'
import PageLayout from '../components/layout/PageLayout'
import OrderSummary from '../components/checkout/OrderSummary'
import AddressForm from '../components/checkout/AddressForm'
import SlotPicker from '../components/checkout/SlotPicker'
import PaymentButton from '../components/checkout/PaymentButton'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { formatPrice } from '../utils/formatPrice'

const Checkout = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cart, items, cartTotal, clearCart } = useCartContext()
  const createOrderMutation = useCreateOrder()
  const verifyPaymentMutation = useVerifyPayment()

  const [step, setStep] = useState(1)
  const [selectedAddress, setSelectedAddress] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [giftMessage, setGiftMessage] = useState('')

  const deliveryFee = cartTotal >= 150000 ? 0 : 9900
  const discount = cart?.discountPaise || 0
  const total = cartTotal + deliveryFee - discount

  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId)
  }

  const handleSlotSelect = (slotId) => {
    setSelectedSlot(slotId)
  }

  const handleCreateOrder = async () => {
    if (!selectedAddress || !selectedSlot) return

    try {
      const response = await createOrderMutation.mutateAsync({
        addressId: selectedAddress,
        deliverySlotId: selectedSlot,
        giftMessage,
      })

      // Initialize Razorpay payment - response structure: { success, message, data: { order, razorpay } }
      const { razorpay } = response.data.data
      const { order_id: razorpayOrderId, amount, currency } = razorpay

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'ourBlooms',
        description: 'Flower Order Payment',
        order_id: razorpayOrderId,
        handler: function (paymentResponse) {
          handleVerifyPayment(paymentResponse)
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        theme: {
          color: '#db2777',
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error('Order creation failed:', error)
    }
  }

  const handleVerifyPayment = async (paymentData) => {
    try {
      await verifyPaymentMutation.mutateAsync(paymentData)
      await clearCart()
      navigate(`/order-success/${paymentData.razorpay_order_id}`)
    } catch (error) {
      console.error('Payment verification failed:', error)
    }
  }

  const canProceedToPayment = selectedAddress && selectedSlot
  const canProceedToReview = canProceedToPayment

  return (
    <PageLayout>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
        Checkout
      </h1>

      {/* Progress steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            1
          </div>
          <span className={`ml-2 font-medium ${step >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>Address</span>
          <div className={`w-16 h-1 mx-4 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            2
          </div>
          <span className={`ml-2 font-medium ${step >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>Delivery</span>
          <div className={`w-16 h-1 mx-4 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            3
          </div>
          <span className={`ml-2 font-medium ${step >= 3 ? 'text-gray-900' : 'text-gray-500'}`}>Payment</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Delivery Address
              </h2>

              {/* Saved addresses */}
              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-600 mb-2">Select from saved addresses:</p>
                {/* Placeholder for saved addresses - would be populated from API */}
                <div className="text-center py-8 text-gray-500">
                  <p>No saved addresses found.</p>
                  <p className="text-sm mt-1">Add a new address below.</p>
                </div>
              </div>

              {/* Add new address */}
              <Button onClick={() => setShowAddressModal(true)} className="w-full">
                Add New Address
              </Button>
            </div>
          )}

          {/* Step 2: Delivery Slot */}
          {step === 2 && (
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Select Delivery Slot
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Choose a convenient time slot for your delivery
              </p>

              {/* Placeholder slots - would be populated from API */}
              <div className="text-center py-8 text-gray-500">
                <p>Delivery slots will be loaded based on your address.</p>
              </div>

              {/* Gift message */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gift Message (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Write a message to include with your order..."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{giftMessage.length}/500 characters</p>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Payment
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 border-2 border-primary-600 bg-primary-50 rounded-lg">
                  <input
                    type="radio"
                    name="payment"
                    checked
                    readOnly
                    className="w-4 h-4 text-primary-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Razorpay (UPI, Cards, Net Banking)</p>
                    <p className="text-sm text-gray-500">Secure payment gateway</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg opacity-50">
                  <input
                    type="radio"
                    name="payment"
                    disabled
                    className="w-4 h-4 text-gray-400"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Coming soon</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Amount to pay:</strong> {formatPrice(total)}
                </p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-4 mt-6">
            {step > 1 && (
              <Button variant="ghost" onClick={() => setStep(step - 1)} className="flex-1">
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !selectedAddress}
                className="flex-1"
              >
                Continue
              </Button>
            ) : (
              <PaymentButton
                orderData={{
                  amount: total,
                  currency: 'INR',
                  customerName: user?.name,
                  customerEmail: user?.email,
                  customerPhone: user?.phone,
                }}
                onSuccess={handleVerifyPayment}
                onError={(error) => console.error('Payment error:', error)}
                amount={formatPrice(total)}
              />
            )}
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <OrderSummary
              items={items}
              subtotal={cartTotal}
              deliveryFee={deliveryFee}
              discount={discount}
              total={total}
            />
          </div>
        </div>
      </div>

      {/* Address modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title="Add New Address"
        size="lg"
      >
        <AddressForm
          onSubmit={(data) => {
            console.log('New address:', data)
            setShowAddressModal(false)
          }}
          onCancel={() => setShowAddressModal(false)}
          isLoading={false}
        />
      </Modal>
    </PageLayout>
  )
}

export default Checkout
