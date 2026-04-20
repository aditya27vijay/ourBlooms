import express from 'express';
import {
  checkout,
  verifyPayment,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { authenticate, requireAdminOrDriver } from '../middleware/auth.js';
import { checkoutValidation, updateOrderStatusValidation, handleValidationErrors } from '../utils/validators.js';

const router = express.Router();

// Customer routes
router.post('/checkout', authenticate, checkoutValidation, handleValidationErrors, checkout);
router.post('/verify-payment', authenticate, verifyPayment);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrder);
router.post('/:id/cancel', authenticate, cancelOrder);

// Admin/Driver routes
router.put('/:id/status', authenticate, requireAdminOrDriver, updateOrderStatusValidation, handleValidationErrors, updateOrderStatus);

export default router;