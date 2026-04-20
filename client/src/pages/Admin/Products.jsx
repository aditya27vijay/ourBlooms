import { useState } from 'react'
import { useProducts, useCategories } from '../../hooks/useProducts'
import PageLayout from '../../components/layout/PageLayout'
import AdminSidebar from '../../components/admin/AdminSidebar'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import ProductForm from '../../components/admin/ProductForm'
import Badge from '../../components/common/Badge'
import { formatPrice } from '../../utils/formatPrice'

const AdminProducts = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const { data: productsResponse, isLoading } = useProducts({ limit: 50 })
  const { data: categoriesResponse } = useCategories()
  const products = productsResponse?.data?.products || []
  const categories = categoriesResponse?.data || []

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleCreate = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">Manage your product catalog</p>
          </div>
          <Button onClick={handleCreate}>Add Product</Button>
        </div>

        {/* Products table */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No products found. Create your first product.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={product.images?.[0] || '/placeholder-product.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge>{product.category?.name || 'Uncategorized'}</Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {formatPrice(product.pricePaise)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={product.stockQty <= 10 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                        {product.stockQty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {product.isSeasonal && (
                          <Badge variant="info" size="sm">Seasonal</Badge>
                        )}
                        {product.stockQty === 0 ? (
                          <Badge variant="danger" size="sm">Out of Stock</Badge>
                        ) : product.stockQty < 10 ? (
                          <Badge variant="warning" size="sm">Low Stock</Badge>
                        ) : (
                          <Badge variant="success" size="sm">In Stock</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
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

        {/* Product Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setEditingProduct(null)
          }}
          title={editingProduct ? 'Edit Product' : 'Add New Product'}
          size="xl"
        >
          <ProductForm
            initialData={editingProduct}
            categories={categories}
            onSubmit={(data) => {
              console.log('Product data:', data)
              setShowModal(false)
              setEditingProduct(null)
            }}
            onCancel={() => {
              setShowModal(false)
              setEditingProduct(null)
            }}
            isLoading={false}
          />
        </Modal>
      </div>
    </div>
  )
}

export default AdminProducts
