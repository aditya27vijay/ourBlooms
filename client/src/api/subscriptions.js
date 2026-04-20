import axiosInstance from './axios'

/**
 * Create new subscription
 * @param {Object} subscriptionData - Subscription details
 * @returns {Promise} Created subscription
 */
export const createSubscription = async (subscriptionData) => {
  const response = await axiosInstance.post('/subscriptions', subscriptionData)
  return response.data
}

/**
 * Get user's subscriptions
 * @returns {Promise} Subscriptions list
 */
export const getSubscriptions = async () => {
  const response = await axiosInstance.get('/subscriptions')
  return response.data
}

/**
 * Pause subscription
 * @param {string} id - Subscription ID
 * @param {number} weeks - Number of weeks to pause
 * @returns {Promise} Updated subscription
 */
export const pauseSubscription = async (id, weeks = 1) => {
  const response = await axiosInstance.put(`/subscriptions/${id}/pause`, { weeks })
  return response.data
}

/**
 * Resume paused subscription
 * @param {string} id - Subscription ID
 * @returns {Promise} Updated subscription
 */
export const resumeSubscription = async (id) => {
  const response = await axiosInstance.put(`/subscriptions/${id}/resume`)
  return response.data
}

/**
 * Cancel subscription
 * @param {string} id - Subscription ID
 * @returns {Promise} Updated subscription
 */
export const cancelSubscription = async (id) => {
  const response = await axiosInstance.delete(`/subscriptions/${id}`)
  return response.data
}
