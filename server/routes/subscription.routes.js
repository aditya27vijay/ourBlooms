import express from 'express';
import {
  createSubscription,
  getSubscriptions,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription
} from '../controllers/subscriptionController.js';
import { authenticate } from '../middleware/auth.js';
import { createSubscriptionValidation, handleValidationErrors } from '../utils/validators.js';

const router = express.Router();

// All subscription routes require authentication
router.use(authenticate);

router.post('/', createSubscriptionValidation, handleValidationErrors, createSubscription);
router.get('/', getSubscriptions);
router.put('/:id/pause', pauseSubscription);
router.put('/:id/resume', resumeSubscription);
router.delete('/:id', cancelSubscription);

export default router;