import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  clearCart,
  applyCoupon,
  removeCoupon
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';
import { addToCartValidation, updateCartItemValidation, applyCouponValidation, handleValidationErrors } from '../utils/validators.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', getCart);
router.post('/items', addToCartValidation, handleValidationErrors, addToCart);
router.put('/items/:itemId', updateCartItemValidation, handleValidationErrors, updateCartItem);
router.delete('/', clearCart);
router.post('/coupon', applyCouponValidation, handleValidationErrors, applyCoupon);
router.delete('/coupon', removeCoupon);

export default router;