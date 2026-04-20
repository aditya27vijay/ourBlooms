// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

// Razorpay Configuration
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxxx'

// Order Status Configuration
export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.PAID]: 'Paid',
  [ORDER_STATUS.PREPARING]: 'Preparing',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
}

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ORDER_STATUS.PAID]: 'bg-blue-100 text-blue-800',
  [ORDER_STATUS.PREPARING]: 'bg-purple-100 text-purple-800',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'bg-orange-100 text-orange-800',
  [ORDER_STATUS.DELIVERED]: 'bg-green-100 text-green-800',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
}

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  DRIVER: 'driver',
}

// Subscription Frequencies
export const SUBSCRIPTION_FREQUENCIES = {
  WEEKLY: 'weekly',
  FORTNIGHTLY: 'fortnightly',
  MONTHLY: 'monthly',
}

export const SUBSCRIPTION_FREQUENCY_LABELS = {
  [SUBSCRIPTION_FREQUENCIES.WEEKLY]: 'Weekly',
  [SUBSCRIPTION_FREQUENCIES.FORTNIGHTLY]: 'Fortnightly',
  [SUBSCRIPTION_FREQUENCIES.MONTHLY]: 'Monthly',
}

// Subscription Status
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
}

// Product Categories
export const PRODUCT_CATEGORIES = {
  ROSES: 'roses',
  MIXED: 'mixed',
  LILIES: 'lilies',
  ORCHIDS: 'orchids',
  TULIPS: 'tulips',
  SUNFLOWERS: 'sunflowers',
  CARNATIONS: 'carnations',
  SEASONAL: 'seasonal',
}

// Occasions
export const OCCASIONS = {
  BIRTHDAY: 'birthday',
  ANNIVERSARY: 'anniversary',
  LOVE: 'love',
  CONDOLENCES: 'condolences',
  CONGRATULATIONS: 'congratulations',
  GET_WELL: 'get_well',
  THANK_YOU: 'thank_you',
  JUST_BECAUSE: 'just_because',
}

// Bouquet Sizes
export const BOUQUET_SIZES = {
  SMALL: { label: 'Small', priceMultiplier: 1 },
  MEDIUM: { label: 'Medium', priceMultiplier: 1.5 },
  LARGE: { label: 'Large', priceMultiplier: 2 },
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
}

// Form Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  PINCODE_REGEX: /^[1-9]\d{5}$/,
  PASSWORD_MIN_LENGTH: 8,
}
