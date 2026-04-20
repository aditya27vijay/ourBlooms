import axiosInstance from './axios'

/**
 * Get current user's cart
 * @returns {Promise} Cart with items
 */
export const getCart = async () => {
  const response = await axiosInstance.get('/cart')
  return response.data
}

/**
 * Add item to cart
 * @param {Object} item - Product ID and quantity
 * @returns {Promise} Updated cart
 */
export const addToCart = async (item) => {
  const response = await axiosInstance.post('/cart/items', item)
  return response.data
}

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise} Updated cart
 */
export const updateCartItem = async (itemId, quantity) => {
  const response = await axiosInstance.put(`/cart/items/${itemId}`, { quantity })
  return response.data
}

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 * @returns {Promise} Updated cart
 */
export const removeCartItem = async (itemId) => {
  const response = await axiosInstance.delete(`/cart/items/${itemId}`)
  return response.data
}

/**
 * Clear entire cart
 * @returns {Promise} Success response
 */
export const clearCart = async () => {
  const response = await axiosInstance.delete('/cart')
  return response.data
}

/**
 * Apply coupon to cart
 * @param {string} code - Coupon code
 * @returns {Promise} Updated cart with discount
 */
export const applyCoupon = async (code) => {
  const response = await axiosInstance.post('/cart/coupon', { code })
  return response.data
}

/**
 * Remove coupon from cart
 * @returns {Promise} Updated cart without discount
 */
export const removeCoupon = async () => {
  const response = await axiosInstance.delete('/cart/coupon')
  return response.data
}
