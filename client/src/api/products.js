import axiosInstance from './axios'

/**
 * Get products with pagination and filters
 * @param {Object} params - Query parameters
 * @returns {Promise} Products list
 */
export const getProducts = async (params = {}) => {
  const response = await axiosInstance.get('/products', { params })
  return response.data
}

/**
 * Get single product by slug
 * @param {string} slug - Product slug
 * @returns {Promise} Product detail
 */
export const getProductBySlug = async (slug) => {
  const response = await axiosInstance.get(`/products/${slug}`)
  return response.data
}

/**
 * Get related products
 * @param {string} productId - Product ID
 * @param {number} limit - Number of products
 * @returns {Promise} Related products
 */
export const getRelatedProducts = async (productId, limit = 4) => {
  const response = await axiosInstance.get('/products/related', {
    params: { productId, limit },
  })
  return response.data
}

/**
 * Create a new product (admin)
 * @param {FormData} formData - Product data with images
 * @returns {Promise} Created product
 */
export const createProduct = async (formData) => {
  const response = await axiosInstance.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

/**
 * Update product (admin)
 * @param {string} id - Product ID
 * @param {FormData} formData - Product data
 * @returns {Promise} Updated product
 */
export const updateProduct = async (id, formData) => {
  const response = await axiosInstance.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

/**
 * Delete product (admin)
 * @param {string} id - Product ID
 * @returns {Promise} Success response
 */
export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/products/${id}`)
  return response.data
}

/**
 * Get product categories
 * @returns {Promise} Categories list
 */
export const getCategories = async () => {
  const response = await axiosInstance.get('/products/categories')
  return response.data
}

/**
 * Create category (admin)
 * @param {Object} categoryData - Category data
 * @returns {Promise} Created category
 */
export const createCategory = async (categoryData) => {
  const response = await axiosInstance.post('/products/categories', categoryData)
  return response.data
}
