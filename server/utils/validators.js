import { body, param, query, validationResult } from 'express-validator';

/**
 * Handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Auth validation rules
export const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Name must be between 2 and 120 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number')
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Product validation rules
export const createProductValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('price_paise')
    .isInt({ min: 1 })
    .withMessage('Price must be a positive integer in paise'),
  body('category_id')
    .isUUID()
    .withMessage('Valid category ID is required'),
  body('stock_qty')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('is_seasonal')
    .optional()
    .isBoolean()
    .withMessage('is_seasonal must be a boolean'),
  body('available_from')
    .optional()
    .isISO8601()
    .withMessage('available_from must be a valid date'),
  body('available_until')
    .optional()
    .isISO8601()
    .withMessage('available_until must be a valid date')
];

export const updateProductValidation = [
  ...createProductValidation.map(rule => rule.optional())
];

// Cart validation rules
export const addToCartValidation = [
  body('productId')
    .isUUID()
    .withMessage('Valid product ID is required'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
];

export const updateCartItemValidation = [
  param('itemId')
    .isUUID()
    .withMessage('Valid cart item ID is required'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer')
];

// Order validation rules
export const checkoutValidation = [
  body('address_id')
    .isUUID()
    .withMessage('Valid address ID is required'),
  body('delivery_slot_id')
    .isUUID()
    .withMessage('Valid delivery slot ID is required'),
  body('gift_message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Gift message cannot exceed 500 characters')
];

// Coupon validation rules
export const applyCouponValidation = [
  body('code')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Coupon code must be between 1 and 50 characters')
];

// Subscription validation rules
export const createSubscriptionValidation = [
  body('product_id')
    .isUUID()
    .withMessage('Valid product ID is required'),
  body('frequency')
    .isIn(['weekly', 'fortnightly', 'monthly'])
    .withMessage('Frequency must be weekly, fortnightly, or monthly'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('address_id')
    .isUUID()
    .withMessage('Valid address ID is required')
];

// Address validation rules
export const createAddressValidation = [
  body('street')
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage('Street address must be between 5 and 255 characters'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),
  body('state')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('State must be between 2 and 100 characters'),
  body('pincode')
    .isPostalCode('IN')
    .withMessage('Valid Indian pincode is required'),
  body('is_default')
    .optional()
    .isBoolean()
    .withMessage('is_default must be a boolean')
];

// Admin validation rules
export const updateOrderStatusValidation = [
  param('id')
    .isUUID()
    .withMessage('Valid order ID is required'),
  body('status')
    .isIn(['pending', 'paid', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
];

export const createCouponValidation = [
  body('code')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Coupon code must be between 3 and 20 characters'),
  body('discount_type')
    .isIn(['percentage', 'flat'])
    .withMessage('Discount type must be percentage or flat'),
  body('value')
    .isInt({ min: 1 })
    .withMessage('Discount value must be a positive integer'),
  body('expires_at')
    .isISO8601()
    .withMessage('Valid expiry date is required'),
  body('usage_limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Usage limit must be a positive integer')
];