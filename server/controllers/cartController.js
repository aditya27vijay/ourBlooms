import { Cart, CartItem, Product, Coupon } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import { sequelize } from '../config/db.js';

/**
 * Get or create user cart
 */
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ where: { user_id: userId } });
  if (!cart) {
    cart = await Cart.create({ user_id: userId });
  }
  return cart;
};

/**
 * Calculate cart total
 */
const calculateCartTotal = async (cartId) => {
  const items = await CartItem.findAll({
    where: { cart_id: cartId },
    include: [{ model: Product, attributes: ['price_paise'] }]
  });

  let total = 0;
  for (const item of items) {
    total += item.quantity * item.price_paise;
  }

  return total;
};

/**
 * Get user's cart
 */
export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);

    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'slug', 'price_paise', 'images', 'stock_qty']
      }],
      order: [['created_at', 'ASC']]
    });

    // Check stock availability and update prices
    const updatedItems = [];
    for (const item of cartItems) {
      if (item.Product.stock_qty < item.quantity) {
        // Update quantity to available stock
        item.quantity = item.Product.stock_qty;
        await item.save();
      }

      // Update price if product price changed
      if (item.price_paise !== item.Product.price_paise) {
        item.price_paise = item.Product.price_paise;
        await item.save();
      }

      updatedItems.push({
        id: item.id,
        product: item.Product,
        quantity: item.quantity,
        price_paise: item.price_paise,
        total_paise: item.quantity * item.price_paise
      });
    }

    // Recalculate total
    const total_paise = await calculateCartTotal(cart.id);
    await cart.update({ total_paise });

    successResponse(res, 'Cart retrieved successfully', {
      cart: {
        id: cart.id,
        items: updatedItems,
        total_paise,
        item_count: updatedItems.length
      }
    });
  } catch (error) {
    logger.error('Get cart error:', error);
    errorResponse(res, 'Failed to retrieve cart', 500);
  }
};

/**
 * Add item to cart
 */
export const addToCart = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { productId, quantity } = req.body;

    // Validate product exists and is available
    const product = await Product.findByPk(productId);
    if (!product) {
      await transaction.rollback();
      return errorResponse(res, 'Product not found', 404);
    }

    if (!product.isAvailable()) {
      await transaction.rollback();
      return errorResponse(res, 'Product is not available', 400);
    }

    if (product.stock_qty < quantity) {
      await transaction.rollback();
      return errorResponse(res, 'Insufficient stock', 400);
    }

    // Get or create cart
    const cart = await getOrCreateCart(req.user.id);

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id: productId }
    });

    if (cartItem) {
      // Update quantity
      cartItem.quantity += quantity;
      if (cartItem.quantity > product.stock_qty) {
        await transaction.rollback();
        return errorResponse(res, 'Insufficient stock', 400);
      }
      await cartItem.save({ transaction });
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        cart_id: cart.id,
        product_id: productId,
        quantity,
        price_paise: product.price_paise
      }, { transaction });
    }

    // Update cart total
    const total_paise = await calculateCartTotal(cart.id);
    await cart.update({ total_paise }, { transaction });

    await transaction.commit();

    logger.info(`Item added to cart: ${product.name} (qty: ${quantity}) by user ${req.user.email}`);

    successResponse(res, 'Item added to cart successfully', {
      cart_item: cartItem,
      cart_total_paise: total_paise
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('Add to cart error:', error);
    errorResponse(res, 'Failed to add item to cart', 500);
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cartItem = await CartItem.findOne({
      where: { id: itemId, cart_id: req.user.cart?.id },
      include: [{ model: Product }]
    });

    if (!cartItem) {
      await transaction.rollback();
      return errorResponse(res, 'Cart item not found', 404);
    }

    if (quantity === 0) {
      // Remove item
      await cartItem.destroy({ transaction });
    } else {
      // Validate stock
      if (cartItem.Product.stock_qty < quantity) {
        await transaction.rollback();
        return errorResponse(res, 'Insufficient stock', 400);
      }

      // Update quantity and price
      cartItem.quantity = quantity;
      cartItem.price_paise = cartItem.Product.price_paise;
      await cartItem.save({ transaction });
    }

    // Update cart total
    const cart = await Cart.findByPk(cartItem.cart_id);
    const total_paise = await calculateCartTotal(cart.id);
    await cart.update({ total_paise }, { transaction });

    await transaction.commit();

    successResponse(res, 'Cart item updated successfully', {
      cart_item: cartItem,
      cart_total_paise: total_paise
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('Update cart item error:', error);
    errorResponse(res, 'Failed to update cart item', 500);
  }
};

/**
 * Clear cart
 */
export const clearCart = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const cart = await getOrCreateCart(req.user.id);

    await CartItem.destroy({
      where: { cart_id: cart.id },
      transaction
    });

    await cart.update({ total_paise: 0 }, { transaction });

    await transaction.commit();

    logger.info(`Cart cleared by user ${req.user.email}`);

    successResponse(res, 'Cart cleared successfully');
  } catch (error) {
    await transaction.rollback();
    logger.error('Clear cart error:', error);
    errorResponse(res, 'Failed to clear cart', 500);
  }
};

/**
 * Apply coupon to cart
 */
export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({ where: { code: code.toUpperCase() } });
    if (!coupon || !coupon.isValid()) {
      return errorResponse(res, 'Invalid or expired coupon', 400);
    }

    const cart = await getOrCreateCart(req.user.id);

    // Calculate discount
    const discount = coupon.calculateDiscount(cart.total_paise);

    successResponse(res, 'Coupon applied successfully', {
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        value: coupon.value,
        discount_amount: discount
      },
      cart_total_paise: cart.total_paise,
      discounted_total_paise: cart.total_paise - discount
    });
  } catch (error) {
    logger.error('Apply coupon error:', error);
    errorResponse(res, 'Failed to apply coupon', 500);
  }
};

/**
 * Remove coupon from cart
 */
export const removeCoupon = async (req, res) => {
  try {
    // Since coupon is not stored in cart, just return success
    // Frontend will handle removing discount from display
    successResponse(res, 'Coupon removed successfully');
  } catch (error) {
    logger.error('Remove coupon error:', error);
    errorResponse(res, 'Failed to remove coupon', 500);
  }
};