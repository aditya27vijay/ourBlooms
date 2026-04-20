import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import PageLayout from '../../components/layout/PageLayout'
import AdminSidebar from '../../components/admin/AdminSidebar'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const AdminAnalytics = () => {
  // Placeholder data - would be fetched from API
  const revenueData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        borderColor: '#db2777',
        backgroundColor: 'rgba(219, 39, 119, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const ordersData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Orders',
        data: [15, 22, 18, 28, 25, 35, 32],
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const topProducts = [
    { name: 'Crimson Rose Bouquet', sales: 45, revenue: 450000 },
    { name: 'Mixed Tulips Arrangement', sales: 38, revenue: 380000 },
    { name: 'White Lilies Basket', sales: 32, revenue: 320000 },
    { name: 'Pink Orchid Delight', sales: 28, revenue: 280000 },
    { name: 'Sunflower Surprise', sales: 25, revenue: 250000 },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your store performance</p>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Revenue Trend (Last 7 Days)
            </h2>
            <div className="h-64">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Orders Trend (Last 7 Days)
            </h2>
            <div className="h-64">
              <Line data={ordersData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Selling Products
          </h2>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Units Sold
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{product.sales}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    ₹{(product.revenue / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional metrics */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Average Order Value
            </h3>
            <p className="text-2xl font-bold text-gray-900">₹1,250</p>
            <p className="text-sm text-green-600 mt-2">↑ 12% from last week</p>
          </div>
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Conversion Rate
            </h3>
            <p className="text-2xl font-bold text-gray-900">3.2%</p>
            <p className="text-sm text-green-600 mt-2">↑ 0.4% from last week</p>
          </div>
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Customer Retention
            </h3>
            <p className="text-2xl font-bold text-gray-900">45%</p>
            <p className="text-sm text-red-600 mt-2">↓ 2% from last week</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics
