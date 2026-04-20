import { Op } from 'sequelize';
import { Product, Category } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import cloudinary from '../config/cloudinary.js';

/**
 * Get all products with filtering and pagination
 */
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      inStock = 'false'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Category filter
    if (category) {
      const categoryRecord = await Category.findOne({ where: { slug: category } });
      if (categoryRecord) {
        where.category_id = categoryRecord.id;
      }
    }

    // Price filters
    if (minPrice || maxPrice) {
      where.price_paise = {};
      if (minPrice) where.price_paise[Op.gte] = parseInt(minPrice) * 100;
      if (maxPrice) where.price_paise[Op.lte] = parseInt(maxPrice) * 100;
    }

    // Search filter
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Stock filter
    if (inStock === 'true') {
      where.stock_qty = { [Op.gt]: 0 };
    }

    // Seasonal availability filter
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    where[Op.or] = [
      { is_seasonal: false },
      {
        is_seasonal: true,
        available_from: { [Op.lte]: currentDate },
        available_until: { [Op.gte]: currentDate }
      }
    ];

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [{
        model: Category,
        attributes: ['name', 'slug']
      }],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    successResponse(res, 'Products retrieved successfully', {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    logger.error('Get products error:', error);
    errorResponse(res, 'Failed to retrieve products', 500);
  }
};

/**
 * Get single product by slug
 */
export const getProduct = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({
      where: { slug },
      include: [{
        model: Category,
        attributes: ['name', 'slug']
      }]
    });

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    // Check if product is available (seasonal check)
    if (!product.isAvailable()) {
      return errorResponse(res, 'Product is currently not available', 404);
    }

    successResponse(res, 'Product retrieved successfully', { product });
  } catch (error) {
    logger.error('Get product error:', error);
    errorResponse(res, 'Failed to retrieve product', 500);
  }
};

/**
 * Create new product (admin only)
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price_paise,
      category_id,
      stock_qty,
      is_seasonal,
      available_from,
      available_until
    } = req.body;

    // Handle image uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.buffer.toString('base64'), {
          folder: 'ourblooms/products',
          resource_type: 'image'
        });
        imageUrls.push(result.secure_url);
      }
    }

    const product = await Product.create({
      name,
      description,
      price_paise,
      category_id,
      images: imageUrls,
      stock_qty: stock_qty || 0,
      is_seasonal: is_seasonal || false,
      available_from,
      available_until
    });

    logger.info(`Product created: ${product.name} by admin ${req.user.email}`);

    successResponse(res, 'Product created successfully', { product }, 201);
  } catch (error) {
    logger.error('Create product error:', error);
    errorResponse(res, 'Failed to create product', 500);
  }
};

/**
 * Update product (admin only)
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.buffer.toString('base64'), {
          folder: 'ourblooms/products',
          resource_type: 'image'
        });
        updates.images = updates.images || [];
        updates.images.push(result.secure_url);
      }
    }

    await product.update(updates);

    logger.info(`Product updated: ${product.name} by admin ${req.user.email}`);

    successResponse(res, 'Product updated successfully', { product });
  } catch (error) {
    logger.error('Update product error:', error);
    errorResponse(res, 'Failed to update product', 500);
  }
};

/**
 * Delete product (admin only)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    await product.destroy();

    logger.info(`Product deleted: ${product.name} by admin ${req.user.email}`);

    successResponse(res, 'Product deleted successfully');
  } catch (error) {
    logger.error('Delete product error:', error);
    errorResponse(res, 'Failed to delete product', 500);
  }
};