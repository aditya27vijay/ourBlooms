import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { uploadProductImages } from '../middleware/upload.js';
import { createProductValidation, updateProductValidation, handleValidationErrors } from '../utils/validators.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:slug', getProduct);

// Admin routes
router.post('/', authenticate, requireAdmin, uploadProductImages, createProductValidation, handleValidationErrors, createProduct);
router.put('/:id', authenticate, requireAdmin, uploadProductImages, updateProductValidation, handleValidationErrors, updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);

export default router;