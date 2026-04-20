import { useState } from 'react'
import Button from '../common/Button'
import { RAZORPAY_KEY_ID } from '../../utils/constants'

const PaymentButton = ({ orderData, onSuccess, onError, amount }) => {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)

    try {
      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)

      script.onload = async () => {
        const options = {
          key: RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'ourBlooms',
          description: 'Flower Order Payment',
          order_id: orderData.razorpayOrderId,
          handler: function (response) {
            onSuccess({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            })
          },
          prefill: {
            name: orderData.customerName,
            email: orderData.customerEmail,
            contact: orderData.customerPhone,
          },
          theme: {
            color: '#db2777',
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', function (response) {
          onError(response.error)
        })
        rzp.open()
      }
    } catch (error) {
      console.error('Payment error:', error)
      onError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      loading={loading}
      className="w-full"
      size="lg"
      leftIcon={
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.96 10.88c-.14-.66-.58-1.22-1.19-1.52L13.88 6.4a.75.75 0 00-.66 0L2.5 10.88c-.6.3-1.04.86-1.18 1.52a2.25 2.25 0 00.62 2.12l9.25 8.75a.75.75 0 001.06 0l9.25-8.75a2.25 2.25 0 00.62-2.12zM12 19.89l-8.25-7.8 8.25-3.94 8.25 3.94-8.25 7.8z" />
        </svg>
      }
    >
      Pay {amount}
    </Button>
  )
}

export default PaymentButton
