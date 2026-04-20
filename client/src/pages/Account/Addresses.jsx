import { useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import AddressForm from '../../components/checkout/AddressForm'
import EmptyState from '../../components/common/EmptyState'

const Addresses = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)

  // Placeholder addresses - would be fetched from API
  const addresses = []

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">
          Saved Addresses
        </h1>
        <Button onClick={() => setShowAddModal(true)}>
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          title="No saved addresses"
          description="Add an address to speed up checkout"
          actionLabel="Add Address"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white rounded-xl shadow-card p-6 relative"
            >
              {address.isDefault && (
                <span className="absolute top-4 right-4 bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded">
                  Default
                </span>
              )}
              <address className="not-italic">
                <p className="font-semibold text-gray-900">{address.name}</p>
                <p className="text-gray-600 mt-2">{address.addressLine1}</p>
                {address.addressLine2 && <p className="text-gray-600">{address.addressLine2}</p>}
                <p className="text-gray-600">
                  {address.city}, {address.state} {address.pincode}
                </p>
                <p className="text-gray-600 mt-2">{address.phone}</p>
              </address>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingAddress(address)}
                >
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Address Modal */}
      <Modal
        isOpen={showAddModal || !!editingAddress}
        onClose={() => {
          setShowAddModal(false)
          setEditingAddress(null)
        }}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
        size="lg"
      >
        <AddressForm
          initialData={editingAddress}
          onSubmit={(data) => {
            console.log('Address data:', data)
            setShowAddModal(false)
            setEditingAddress(null)
          }}
          onCancel={() => {
            setShowAddModal(false)
            setEditingAddress(null)
          }}
          isLoading={false}
        />
      </Modal>
    </PageLayout>
  )
}

export default Addresses
