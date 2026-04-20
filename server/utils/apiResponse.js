/**
 * Standardized API response format
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {boolean} success - Success flag
 * @param {string} message - Response message
 * @param {any} data - Response data
 * @returns {Object} Formatted response
 */
export const apiResponse = (res, statusCode = 200, success = true, message = '', data = null) => {
  const response = {
    success,
    message,
    ...(data !== null && { data })
  };

  return res.status(statusCode).json(response);
};

/**
 * Success response helper
 */
export const successResponse = (res, message = 'Success', data = null, statusCode = 200) => {
  return apiResponse(res, statusCode, true, message, data);
};

/**
 * Error response helper
 */
export const errorResponse = (res, message = 'Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    error: message,
    ...(errors && { details: errors })
  };

  return res.status(statusCode).json(response);
};