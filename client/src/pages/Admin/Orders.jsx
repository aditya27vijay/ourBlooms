import { useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import AdminSidebar from '../../components/admin/AdminSidebar'
import OrderQueue from '../../components/admin/OrderQueue'
import Select from '../../components/common/Select'

const AdminOrders = () => {
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSlot, setFilterSlot] = useState('')

  // Placeholder orders - would be fetched from API
  const orders = []

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  const handleStatusUpdate = async (orderId, newStatus) => {
    console.log(`Updating order ${orderId} to ${newStatus}`)
    // API call would go here
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track all orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-card p-4 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Select
              label="Filter by Status"
              options={statusOptions}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
            <Select
              label="Filter by Delivery Slot"
              options={[
                { value: '', label: 'All Slots' },
                { value: 'today', label: 'Today' },
                { value: 'tomorrow', label: 'Tomorrow' },
                { value: 'this_week', label: 'This Week' },
              ]}
              value={filterSlot}
              onChange={(e) => setFilterSlot(e.target.value)}
            />
          </div>
        </div>

        {/* Order queue */}
        <OrderQueue orders={orders} onStatusUpdate={handleStatusUpdate} />
      </div>
    </div>
  )
}

export default AdminOrders
