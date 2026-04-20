import { useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import AdminSidebar from '../../components/admin/AdminSidebar'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'
import { formatDate } from '../../utils/dateHelpers'

const AdminCoupons = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)

  // Placeholder coupons - would be fetched from API
  const coupons = [
    {
      id: '1',
      code: 'WELCOME10',
      discountType: 'percentage',
      value: 10,
      minOrderAmount: 100000,
      maxDiscount: 20000,
      usageLimit: 100,
      usedCount: 45,
      expiresAt: '2025-12-31T23:59:59Z',
      isActive: true,
    },
  ]

  const handleCreate = () => {
    setEditingCoupon(null)
    setShowModal(true)
  }

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon)
    setShowModal(true)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
            <p className="text-gray-500 mt-1">Manage discount codes</p>
          </div>
          <Button onClick={handleCreate}>Create Coupon</Button>
        </div>

        {/* Coupons table */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Min Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Expires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No coupons found. Create your first coupon.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-mono font-semibold text-gray-900">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-medium text-gray-900">
                          {coupon.discountType === 'percentage'
                            ? `${coupon.value}%`
                            : `₹${coupon.value / 100}`}
                        </span>
                        {coupon.maxDiscount && (
                          <p className="text-xs text-gray-500">
                            Max: ₹{coupon.maxDiscount / 100}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      ₹{coupon.minOrderAmount / 100}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">{coupon.usedCount}</span>
                      <span className="text-gray-500"> / {coupon.usageLimit}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {formatDate(coupon.expiresAt)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={coupon.isActive ? 'success' : 'default'}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Coupon Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setEditingCoupon(null)
          }}
          title={editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
          size="md"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setShowModal(false)
            }}
            className="space-y-4"
          >
            <Input
              label="Coupon Code"
              placeholder="SAVE20"
              required
              disabled={!!editingCoupon}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Discount Type"
                options={[
                  { value: 'percentage', label: 'Percentage (%)' },
                  { value: 'fixed', label: 'Fixed Amount (₹)' },
                ]}
                required
              />
              <Input
                label="Discount Value"
                type="number"
                placeholder="10"
                required
              />
            </div>

            <Input
              label="Minimum Order Amount (₹)"
              type="number"
              placeholder="1000"
            />

            <Input
              label="Maximum Discount (₹)"
              type="number"
              placeholder="200"
              hint="For percentage discounts only"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Usage Limit"
                type="number"
                placeholder="100"
              />
              <Input
                label="Expiry Date"
                type="date"
              />
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" />
              <span className="text-sm text-gray-700">Active</span>
            </label>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editingCoupon ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

export default AdminCoupons
