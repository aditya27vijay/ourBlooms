import PageLayout from '../../components/layout/PageLayout'
import AdminSidebar from '../../components/admin/AdminSidebar'
import DashboardStats from '../../components/admin/DashboardStats'
import OrderQueue from '../../components/admin/OrderQueue'
import StockAlert from '../../components/admin/StockAlert'

const AdminDashboard = () => {
  // Placeholder data - would be fetched from API
  const stats = {
    todayOrders: 12,
    todayRevenue: 1450000,
    pendingOrders: 5,
    lowStockItems: 3,
  }

  const recentOrders = [
    // Placeholder orders
  ]

  const lowStockProducts = [
    // Placeholder products
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your store's performance</p>
        </div>

        {/* Stats */}
        <DashboardStats stats={stats} />

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Order queue */}
          <div className="lg:col-span-2">
            <OrderQueue orders={recentOrders} />
          </div>

          {/* Stock alerts */}
          <div>
            <StockAlert products={lowStockProducts} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
