import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import PageLayout from '../../components/layout/PageLayout'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { requestPasswordReset } from '../../api/auth'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email').min(1, 'Email is required'),
})

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data) => {
    setError('')
    setLoading(true)

    try {
      await requestPasswordReset(data.email)
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <PageLayout>
        <div className="max-w-md mx-auto py-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-4">
            Check Your Email
          </h1>
          <p className="text-gray-600 mb-8">
            We've sent a password reset link to your email address.
          </p>
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or{' '}
            <button onClick={() => setSubmitted(false)} className="text-primary-600 hover:underline">
              try again
            </button>
          </p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-md mx-auto py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Forgot Password?
          </h1>
          <p className="text-gray-600 mt-2">
            No worries, we'll send you reset instructions
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-card p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              required
              error={errors.email?.message}
              {...register('email')}
            />

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Reset Password
            </Button>
          </form>

          <p className="mt-8 text-center">
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to Login
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  )
}

export default ForgotPassword
