import { Op } from 'sequelize';
import sequelize from '../config/db.js';
import { User, Order, OrderItem, Product, Category, Coupon, DeliverySlot } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
  try {
    // Today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await Order.count({
      where: {
        created_at: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      }
    });

    // Today's revenue
    const todayRevenueResult = await Order.sum('total_paise', {
      where: {
        status: { [Op.in]: ['paid', 'preparing', 'out_for_delivery', 'delivered'] },
        created_at: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      }
    });
    const todayRevenue = todayRevenueResult || 0;

    // Pending orders
    const pendingOrders = await Order.count({
      where: { status: 'pending' }
    });

    // Low stock alerts (products with stock <= 5)
    const lowStockProducts = await Product.count({
      where: { stock_qty: { [Op.lte]: 5 } }
    });

    // Recent orders
    const recentOrders = await Order.findAll({
      limit: 5,
      include: [
        {
          model: User,
          attributes: ['name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    successResponse(res, 'Dashboard stats retrieved successfully', {
      stats: {
        today_orders: todayOrders,
        today_revenue_paise: todayRevenue,
        pending_orders: pendingOrders,
        low_stock_alerts: lowStockProducts
      },
      recent_orders: recentOrders
    });
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    errorResponse(res, 'Failed to retrieve dashboard stats', 500);
  }
};

/**
 * Get revenue analytics for last 30 days
 */
export const getRevenueAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueData = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('SUM', sequelize.col('total_paise')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orders']
      ],
      where: {
        status: { [Op.in]: ['paid', 'preparing', 'out_for_delivery', 'delivered'] },
        created_at: { [Op.gte]: thirtyDaysAgo }
      },
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    successResponse(res, 'Revenue analytics retrieved successfully', {
      analytics: revenueData
    });
  } catch (error) {
    logger.error('Get revenue analytics error:', error);
    errorResponse(res, 'Failed to retrieve revenue analytics', 500);
  }
};

/**
 * Get all orders (admin view)
 */
export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      startDate,
      endDate
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;

    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at[Op.gte] = new Date(startDate);
      if (endDate) where.created_at[Op.lte] = new Date(endDate);
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['name', 'email', 'phone']
        },
        {
          model: DeliverySlot,
          attributes: ['date', 'time_window']
        },
        {
          model: Address,
          attributes: ['street', 'city', 'state', 'pincode']
        },
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['name', 'slug'] }]
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
    logger.error('Get all orders error:', error);
    errorResponse(res, 'Failed to retrieve orders', 500);
  }
};

/**
 * Get products with low stock
 */
export const getLowStockProducts = async (req, res) => {
  try {
    const lowStockProducts = await Product.findAll({
      where: { stock_qty: { [Op.lte]: 5 } },
      include: [{ model: Category, attributes: ['name'] }],
      order: [['stock_qty', 'ASC']]
    });

    successResponse(res, 'Low stock products retrieved successfully', {
      products: lowStockProducts
    });
  } catch (error) {
    logger.error('Get low stock products error:', error);
    errorResponse(res, 'Failed to retrieve low stock products', 500);
  }
};