import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, passwordChangeSchema } from '../../utils/validators'
import PageLayout from '../../components/layout/PageLayout'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { updateProfile, changePassword } from '../../api/auth'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: zodResolver(passwordChangeSchema),
  })

  const handleProfileUpdate = async (data) => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await updateProfile(data)
      updateUser(response.data.data)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (data) => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await changePassword(data)
      setSuccess('Password changed successfully!')
      resetPassword()
      setShowPasswordModal(false)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
        My Profile
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Profile Information
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmitProfile(handleProfileUpdate)} className="space-y-5">
              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
                hint="Email cannot be changed"
              />

              <Input
                label="Full Name"
                placeholder="John Doe"
                required
                error={profileErrors.name?.message}
                {...registerProfile('name')}
              />

              <Input
                label="Phone Number"
                placeholder="9876543210"
                required
                error={profileErrors.phone?.message}
                {...registerProfile('phone')}
              />

              <div className="pt-4">
                <Button type="submit" loading={loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Password & Account Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Security</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Password</p>
                <p className="text-sm text-gray-900">••••••••</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordModal(true)}
                className="w-full"
              >
                Change Password
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Account Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Member since</p>
                <p className="text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Account Type</p>
                <p className="text-gray-900 capitalize">{user?.role || 'customer'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false)
          resetPassword()
          setError('')
        }}
        title="Change Password"
        size="md"
      >
        <form onSubmit={handleSubmitPassword(handlePasswordChange)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            required
            error={passwordErrors.currentPassword?.message}
            {...registerPassword('currentPassword')}
          />
          <Input
            label="New Password"
            type="password"
            required
            error={passwordErrors.newPassword?.message}
            {...registerPassword('newPassword')}
          />
          <Input
            label="Confirm New Password"
            type="password"
            required
            error={passwordErrors.confirmNewPassword?.message}
            {...registerPassword('confirmNewPassword')}
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowPasswordModal(false)
                resetPassword()
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              Change Password
            </Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  )
}

export default Profile
