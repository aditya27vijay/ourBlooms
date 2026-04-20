import axiosInstance from './axios'

/**
 * Register a new user
 * @param {Object} credentials - User credentials
 * @returns {Promise} Registration response (returns data.data for consistency)
 */
export const register = async (credentials) => {
  const response = await axiosInstance.post('/auth/register', credentials)
  return response.data
}

/**
 * Login user
 * @param {Object} credentials - Email and password
 * @returns {Promise} Login response with tokens (returns data.data for consistency)
 */
export const login = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials)
  return response.data
}

/**
 * Logout user
 * @returns {Promise} Logout response
 */
export const logout = async () => {
  const response = await axiosInstance.post('/auth/logout')
  return response.data
}

/**
 * Get current user profile
 * @returns {Promise} User profile
 */
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me')
  return response.data
}

/**
 * Update user profile
 * @param {Object} profileData - Profile fields to update
 * @returns {Promise} Updated user profile
 */
export const updateProfile = async (profileData) => {
  const response = await axiosInstance.put('/auth/profile', profileData)
  return response.data
}

/**
 * Change password
 * @param {Object} passwordData - Current and new password
 * @returns {Promise} Success response
 */
export const changePassword = async (passwordData) => {
  const response = await axiosInstance.post('/auth/change-password', passwordData)
  return response.data
}

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise} Success response
 */
export const requestPasswordReset = async (email) => {
  const response = await axiosInstance.post('/auth/forgot-password', { email })
  return response.data
}

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} password - New password
 * @returns {Promise} Success response
 */
export const resetPassword = async (token, password) => {
  const response = await axiosInstance.post('/auth/reset-password', { token, password })
  return response.data
}
