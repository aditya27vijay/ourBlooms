import express from 'express';
import {
  getDashboardStats,
  getRevenueAnalytics,
  getAllOrders,
  getLowStockProducts
} from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/analytics/revenue', getRevenueAnalytics);
router.get('/orders', getAllOrders);
router.get('/products/low-stock', getLowStockProducts);

export default router;