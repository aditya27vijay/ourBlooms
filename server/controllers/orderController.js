import { sequelize } from '../config/db.js';
import { Order, OrderItem, Cart, CartItem, Product, DeliverySlot, Address, Coupon } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import razorpay from '../config/razorpay.js';
import { FREE_DELIVERY_THRESHOLD, DELIVERY_FEE, ORDER_STATUSES } from '../utils/constants.js';

/**
 * Create Razorpay order
 */
export const checkout = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { address_id, delivery_slot_id, gift_message } = req.body;

    // Validate address
    const address = await Address.findOne({
      where: { id: address_id, user_id: req.user.id }
    });
    if (!address) {
      await transaction.rollback();
      return errorResponse(res, 'Invalid address', 400);
    }

    // Validate delivery slot
    const deliverySlot = await DeliverySlot.findByPk(delivery_slot_id);
    if (!deliverySlot || !deliverySlot.canBook()) {
      await transaction.rollback();
      return errorResponse(res, 'Delivery slot not available', 400);
    }

    // Get user's cart
    const cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: CartItem,
        include: [{ model: Product }]
      }],
      transaction
    });

    if (!cart || cart.CartItems.length === 0) {
      await transaction.rollback();
      return errorResponse(res, 'Cart is empty', 400);
    }

    // Validate stock and calculate total
    let subtotal = 0;
    for (const item of cart.CartItems) {
      if (item.Product.stock_qty < item.quantity) {
        await transaction.rollback();
        return errorResponse(res, `Insufficient stock for ${item.Product.name}`, 400);
      }
      subtotal += item.quantity * item.Product.price_paise;
    }

    // Calculate delivery fee
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const total = subtotal + deliveryFee;

    // Reserve delivery slot
    deliverySlot.booked += 1;
    await deliverySlot.save({ transaction });

    // Create order
    const order = await Order.create({
      user_id: req.user.id,
      total_paise: total,
      delivery_slot_id,
      address_id,
      gift_message
    }, { transaction });

    // Create order items and decrement stock
    for (const cartItem of cart.CartItems) {
      await OrderItem.create({
        order_id: order.id,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        price_paise: cartItem.price_paise
      }, { transaction });

      // Decrement stock
      cartItem.Product.stock_qty -= cartItem.quantity;
      await cartItem.Product.save({ transaction });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: total, // Amount in paise
      currency: 'INR',
      receipt: `order_${order.id}`,
      notes: {
        order_id: order.id
      }
    });

    // Update order with payment reference
    await order.update({
      payment_ref: razorpayOrder.id
    }, { transaction });

    await transaction.commit();

    logger.info(`Order created: ${order.id} by user ${req.user.email}`);

    successResponse(res, 'Order created successfully', {
      order: {
        id: order.id,
        total_paise: total,
        subtotal_paise: subtotal,
        delivery_fee_paise: deliveryFee
      },
      razorpay: {
        key: process.env.RAZORPAY_KEY_ID,
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      }
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('Checkout error:', error);
    errorResponse(res, 'Failed to create order', 500);
  }
};

/**
 * Verify Razorpay payment
 */
export const verifyPayment = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify payment signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = require('crypto')
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      await transaction.rollback();
      return errorResponse(res, 'Payment verification failed', 400);
    }

    // Find order
    const order = await Order.findOne({
      where: { payment_ref: razorpay_order_id },
      transaction
    });

    if (!order) {
      await transaction.rollback();
      return errorResponse(res, 'Order not found', 404);
    }

    // Update order status
    await order.update({
      status: ORDER_STATUSES.PAID,
      payment_ref: razorpay_payment_id
    }, { transaction });

    // Clear user's cart
    const cart = await Cart.findOne({
      where: { user_id: order.user_id },
      transaction
    });

    if (cart) {
      await CartItem.destroy({
        where: { cart_id: cart.id },
        transaction
      });
      await cart.update({ total_paise: 0 }, { transaction });
    }

    await transaction.commit();

    logger.info(`Payment verified for order: ${order.id}`);

    successResponse(res, 'Payment verified successfully', {
      order_id: order.id,
      payment_id: razorpay_payment_id
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('Payment verification error:', error);
    errorResponse(res, 'Payment verification failed', 500);
  }
};

/**
 * Get user's orders
 */
export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: orders } = await Order.findAndCountAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: DeliverySlot,
          attributes: ['date', 'time_window']
        },
        {
          model: Address,
          attributes: ['street', 'city', 'state', 'pincode']
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    successResponse(res, 'Orders retrieved successfully', {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    logger.error('Get orders error:', error);
    errorResponse(res, 'Failed to retrieve orders', 500);
  }
};

/**
 * Get single order
 */
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      where: {
        id,
        user_id: req.user.id // Ensure user owns the order
      },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['name', 'slug', 'images'] }]
        },
        {
          model: DeliverySlot,
          attributes: ['date', 'time_window']
        },
        {
          model: Address
        }
      ]
    });

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    successResponse(res, 'Order retrieved successfully', { order });
  } catch (error) {
    logger.error('Get order error:', error);
    errorResponse(res, 'Failed to retrieve order', 500);
  }
};

/**
 * Update order status (admin/driver only)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    if (!order.canUpdateStatus(status)) {
      return errorResponse(res, 'Invalid status transition', 400);
    }

    await order.update({ status });

    logger.info(`Order ${order.id} status updated to ${status} by ${req.user.role} ${req.user.email}`);

    successResponse(res, 'Order status updated successfully', { order });
  } catch (error) {
    logger.error('Update order status error:', error);
    errorResponse(res, 'Failed to update order status', 500);
  }
};

/**
 * Cancel order (customer only)
 */
export const cancelOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const order = await Order.findOne({
      where: {
        id,
        user_id: req.user.id
      },
      include: [{ model: OrderItem }],
      transaction
    });

    if (!order) {
      await transaction.rollback();
      return errorResponse(res, 'Order not found', 404);
    }

    if (!order.canCancel()) {
      await transaction.rollback();
      return errorResponse(res, 'Order cannot be cancelled', 400);
    }

    // Restore stock
    for (const item of order.OrderItems) {
      const product = await Product.findByPk(item.product_id, { transaction });
      product.stock_qty += item.quantity;
      await product.save({ transaction });
    }

    // Free up delivery slot
    const deliverySlot = await DeliverySlot.findByPk(order.delivery_slot_id, { transaction });
    deliverySlot.booked = Math.max(0, deliverySlot.booked - 1);
    await deliverySlot.save({ transaction });

    // Update order status
    await order.update({ status: ORDER_STATUSES.CANCELLED }, { transaction });

    await transaction.commit();

    logger.info(`Order ${order.id} cancelled by user ${req.user.email}`);

    successResponse(res, 'Order cancelled successfully', { order });
  } catch (error) {
    await transaction.rollback();
    logger.error('Cancel order error:', error);
    errorResponse(res, 'Failed to cancel order', 500);
  }
};