import { z } from 'zod'

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
})

// Register validation schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name must be less than 120 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Please enter a valid phone number'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Profile update schema
export const profileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name must be less than 120 characters'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Please enter a valid phone number'),
})

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(1, 'New password is required')
    .min(8, 'New password must be at least 8 characters')
    .max(128, 'New password must be less than 128 characters')
    .regex(/[A-Z]/, 'New password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'New password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'New password must contain at least one number'),
  confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ['confirmNewPassword'],
})

// Address schema
export const addressSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Please enter a valid phone number'),
  addressLine1: z.string().min(1, 'Address line 1 is required').min(5, 'Address is too short'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required').min(2, 'City is too short'),
  state: z.string().min(1, 'State is required').min(2, 'State is too short'),
  pincode: z
    .string()
    .min(1, 'Pincode is required')
    .regex(/^[1-9]\d{5}$/, 'Please enter a valid 6-digit pincode'),
  landmark: z.string().optional(),
  isDefault: z.boolean().optional(),
})

// Cart item schema (for form validation)
export const cartItemSchema = z.object({
  productId: z.string().uuid('Invalid product'),
  quantity: z
    .number()
    .min(1, 'Quantity must be at least 1')
    .max(10, 'Maximum quantity is 10'),
  size: z.enum(['small', 'medium', 'large']).optional(),
})

// Checkout schema
export const checkoutSchema = z.object({
  addressId: z.string().uuid('Please select or add a delivery address'),
  deliverySlotId: z.string().uuid('Please select a delivery time slot'),
  giftMessage: z.string().max(500, 'Gift message must be less than 500 characters').optional(),
  paymentMethod: z.enum(['razorpay', 'stripe', 'cod'], {
    required_error: 'Please select a payment method',
  }),
})

// Coupon schema
export const couponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').regex(/^[A-Z0-9-]+$/, 'Invalid coupon code format'),
})

// Review schema
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  comment: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(500, 'Review must be less than 500 characters'),
})

// Product form schema (admin)
export const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required').min(3, 'Name must be at least 3 characters'),
  description: z.string().min(1, 'Description is required').min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price cannot be negative'),
  categoryId: z.string().uuid('Please select a category'),
  stockQty: z.number().min(0, 'Stock cannot be negative'),
  isSeasonal: z.boolean().optional(),
  availableFrom: z.string().optional(),
  availableUntil: z.string().optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
})
