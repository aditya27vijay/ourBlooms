import axiosInstance from './axios'

/**
 * Create order from cart
 * @param {Object} orderData - Checkout data
 * @returns {Promise} Order with payment config
 */
export const createOrder = async (orderData) => {
  const response = await axiosInstance.post('/orders/checkout', orderData)
  return response.data
}

/**
 * Verify Razorpay payment
 * @param {Object} paymentData - Razorpay response
 * @returns {Promise} Verified order
 */
export const verifyPayment = async (paymentData) => {
  const response = await axiosInstance.post('/orders/verify-payment', paymentData)
  return response.data
}

/**
 * Get user's order history
 * @param {Object} params - Pagination params
 * @returns {Promise} Orders list
 */
export const getOrders = async (params = {}) => {
  const response = await axiosInstance.get('/orders', { params })
  return response.data
}

/**
 * Get single order detail
 * @param {string} id - Order ID
 * @returns {Promise} Order detail
 */
export const getOrder = async (id) => {
  const response = await axiosInstance.get(`/orders/${id}`)
  return response.data
}

/**
 * Cancel order (customer)
 * @param {string} id - Order ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise} Updated order
 */
export const cancelOrder = async (id, reason) => {
  const response = await axiosInstance.post(`/orders/${id}/cancel`, { reason })
  return response.data
}

/**
 * Update order status (admin)
 * @param {string} id - Order ID
 * @param {string} status - New status
 * @returns {Promise} Updated order
 */
export const updateOrderStatus = async (id, status) => {
  const response = await axiosInstance.put(`/orders/${id}/status`, { status })
  return response.data
}

/**
 * Get all orders (admin)
 * @param {Object} params - Filter params
 * @returns {Promise} Orders list
 */
export const getAllOrders = async (params = {}) => {
  const response = await axiosInstance.get('/orders/admin', { params })
  return response.data
}
