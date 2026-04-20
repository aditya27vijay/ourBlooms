import { Coupon } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Validate coupon code
 */
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({
      where: { code: code.toUpperCase() }
    });

    if (!coupon || !coupon.isValid()) {
      return errorResponse(res, 'Invalid or expired coupon code', 400);
    }

    successResponse(res, 'Coupon is valid', {
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        value: coupon.value,
        expires_at: coupon.expires_at
      }
    });
  } catch (error) {
    logger.error('Validate coupon error:', error);
    errorResponse(res, 'Failed to validate coupon', 500);
  }
};

/**
 * Create coupon (admin only)
 */
export const createCoupon = async (req, res) => {
  try {
    const { code, discount_type, value, expires_at, usage_limit } = req.body;

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount_type,
      value,
      expires_at,
      usage_limit
    });

    logger.info(`Coupon created: ${coupon.code} by admin ${req.user.email}`);

    successResponse(res, 'Coupon created successfully', { coupon }, 201);
  } catch (error) {
    logger.error('Create coupon error:', error);
    errorResponse(res, 'Failed to create coupon', 500);
  }
};

/**
 * Get all coupons (admin only)
 */
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      order: [['created_at', 'DESC']]
    });

    successResponse(res, 'Coupons retrieved successfully', { coupons });
  } catch (error) {
    logger.error('Get coupons error:', error);
    errorResponse(res, 'Failed to retrieve coupons', 500);
  }
};

/**
 * Update coupon (admin only)
 */
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return errorResponse(res, 'Coupon not found', 404);
    }

    if (updates.code) {
      updates.code = updates.code.toUpperCase();
    }

    await coupon.update(updates);

    logger.info(`Coupon updated: ${coupon.code} by admin ${req.user.email}`);

    successResponse(res, 'Coupon updated successfully', { coupon });
  } catch (error) {
    logger.error('Update coupon error:', error);
    errorResponse(res, 'Failed to update coupon', 500);
  }
};

/**
 * Delete coupon (admin only)
 */
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return errorResponse(res, 'Coupon not found', 404);
    }

    await coupon.destroy();

    logger.info(`Coupon deleted: ${coupon.code} by admin ${req.user.email}`);

    successResponse(res, 'Coupon deleted successfully');
  } catch (error) {
    logger.error('Delete coupon error:', error);
    errorResponse(res, 'Failed to delete coupon', 500);
  }
};