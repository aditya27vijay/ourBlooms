import { Subscription, Product, Address } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import { SUBSCRIPTION_STATUSES, SUBSCRIPTION_FREQUENCIES } from '../utils/constants.js';

/**
 * Create new subscription
 */
export const createSubscription = async (req, res) => {
  try {
    const { product_id, frequency, quantity, address_id } = req.body;

    // Validate product exists and is available
    const product = await Product.findByPk(product_id);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    if (!product.isAvailable()) {
      return errorResponse(res, 'Product is not available for subscription', 400);
    }

    // Validate address belongs to user
    const address = await Address.findOne({
      where: { id: address_id, user_id: req.user.id }
    });
    if (!address) {
      return errorResponse(res, 'Invalid address', 400);
    }

    // Calculate next delivery date
    const nextDelivery = new Date();
    nextDelivery.setDate(nextDelivery.getDate() + 7); // First delivery in 7 days
    const nextDeliveryStr = nextDelivery.toISOString().split('T')[0];

    const subscription = await Subscription.create({
      user_id: req.user.id,
      product_id,
      frequency,
      quantity,
      address_id,
      next_delivery: nextDeliveryStr
    });

    logger.info(`Subscription created: ${subscription.id} by user ${req.user.email}`);

    successResponse(res, 'Subscription created successfully', { subscription }, 201);
  } catch (error) {
    logger.error('Create subscription error:', error);
    errorResponse(res, 'Failed to create subscription', 500);
  }
};

/**
 * Get user's subscriptions
 */
export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          attributes: ['name', 'slug', 'price_paise', 'images']
        },
        {
          model: Address,
          attributes: ['street', 'city', 'state', 'pincode']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    successResponse(res, 'Subscriptions retrieved successfully', { subscriptions });
  } catch (error) {
    logger.error('Get subscriptions error:', error);
    errorResponse(res, 'Failed to retrieve subscriptions', 500);
  }
};

/**
 * Pause subscription
 */
export const pauseSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { weeks = 1 } = req.body;

    const subscription = await Subscription.findOne({
      where: { id, user_id: req.user.id }
    });

    if (!subscription) {
      return errorResponse(res, 'Subscription not found', 404);
    }

    subscription.pause(weeks);
    await subscription.save();

    logger.info(`Subscription ${subscription.id} paused for ${weeks} weeks by user ${req.user.email}`);

    successResponse(res, 'Subscription paused successfully', { subscription });
  } catch (error) {
    logger.error('Pause subscription error:', error);
    errorResponse(res, 'Failed to pause subscription', 500);
  }
};

/**
 * Resume subscription
 */
export const resumeSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findOne({
      where: { id, user_id: req.user.id }
    });

    if (!subscription) {
      return errorResponse(res, 'Subscription not found', 404);
    }

    subscription.resume();
    await subscription.save();

    logger.info(`Subscription ${subscription.id} resumed by user ${req.user.email}`);

    successResponse(res, 'Subscription resumed successfully', { subscription });
  } catch (error) {
    logger.error('Resume subscription error:', error);
    errorResponse(res, 'Failed to resume subscription', 500);
  }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findOne({
      where: { id, user_id: req.user.id }
    });

    if (!subscription) {
      return errorResponse(res, 'Subscription not found', 404);
    }

    subscription.cancel();
    await subscription.save();

    logger.info(`Subscription ${subscription.id} cancelled by user ${req.user.email}`);

    successResponse(res, 'Subscription cancelled successfully', { subscription });
  } catch (error) {
    logger.error('Cancel subscription error:', error);
    errorResponse(res, 'Failed to cancel subscription', 500);
  }
};