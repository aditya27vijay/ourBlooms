import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'

const CouponInput = ({ onApply, onRemove, appliedCoupon, isLoading }) => {
  const [code, setCode] = useState('')
  const [showInput, setShowInput] = useState(!appliedCoupon)

  const handleApply = () => {
    if (code.trim()) {
      onApply(code.trim().toUpperCase())
    }
  }

  const handleRemove = () => {
    setCode('')
    setShowInput(true)
    onRemove?.()
  }

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-green-800">Coupon Applied</p>
            <p className="text-sm text-green-600">Code: {appliedCoupon.code}</p>
          </div>
          <button
            onClick={handleRemove}
            className="text-green-600 hover:text-green-800 font-medium text-sm"
          >
            Remove
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {showInput ? (
        <div className="flex gap-2">
          <Input
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="flex-1"
          />
          <Button onClick={handleApply} loading={isLoading} disabled={!code.trim()}>
            Apply
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="flex-1"
          />
          <Button variant="ghost" onClick={() => setShowInput(true)}>
            Cancel
          </Button>
          <Button onClick={handleApply} loading={isLoading} disabled={!code.trim()}>
            Apply
          </Button>
        </div>
      )}
    </div>
  )
}

export default CouponInput
