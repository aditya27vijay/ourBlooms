import { Link } from 'react-router-dom'
import Button from '../common/Button'

const CartEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-8">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
      <p className="text-gray-500 mb-6 max-w-xs">
        Looks like you haven't added any flowers to your cart yet.
      </p>
      <Link to="/shop">
        <Button>Start Shopping</Button>
      </Link>
    </div>
  )
}

export default CartEmpty
