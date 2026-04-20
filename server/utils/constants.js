// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  DRIVER: 'driver'
};

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Subscription frequencies
export const SUBSCRIPTION_FREQUENCIES = {
  WEEKLY: 'weekly',
  FORTNIGHTLY: 'fortnightly',
  MONTHLY: 'monthly'
};

// Subscription statuses
export const SUBSCRIPTION_STATUSES = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  CANCELLED: 'cancelled'
};

// Payment providers
export const PAYMENT_PROVIDERS = {
  RAZORPAY: 'razorpay',
  STRIPE: 'stripe',
  COD: 'cod'
};

// Coupon types
export const COUPON_TYPES = {
  PERCENTAGE: 'percentage',
  FLAT: 'flat'
};

// Delivery fee threshold (in paise)
export const FREE_DELIVERY_THRESHOLD = 150000; // ₹1500

// Default delivery fee (in paise)
export const DELIVERY_FEE = 9900; // ₹99

// JWT expiry times
export const JWT_ACCESS_EXPIRY = '15m';
export const JWT_REFRESH_EXPIRY = '7d';

// Slot cutoff hour (IST)
export const SLOT_CUTOFF_HOUR = parseInt(process.env.SLOT_CUTOFF_HOUR) || 11;