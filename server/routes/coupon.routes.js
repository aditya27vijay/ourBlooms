import express from 'express';
import {
  validateCoupon,
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { createCouponValidation, handleValidationErrors } from '../utils/validators.js';

const router = express.Router();

// Public routes
router.post('/validate', validateCoupon);

// Admin routes
router.use(authenticate);
router.use(requireAdmin);
router.post('/', createCouponValidation, handleValidationErrors, createCoupon);
router.get('/', getCoupons);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;