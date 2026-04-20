import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Middleware to verify JWT token
 */
export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'Not authorized to access this route', 401);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return errorResponse(res, 'No user found with this token', 401);
      }

      req.user = user;
      next();
    } catch (err) {
      return errorResponse(res, 'Not authorized to access this route', 401);
    }
  } catch (err) {
    return errorResponse(res, 'Server error during authentication', 500);
  }
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return errorResponse(res, 'Admin access required', 403);
  }
};

/**
 * Middleware to check if user is admin or driver
 */
export const requireAdminOrDriver = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'driver')) {
    next();
  } else {
    return errorResponse(res, 'Admin or driver access required', 403);
  }
};

/**
 * Middleware to check if user owns the resource or is admin
 */
export const requireOwnershipOrAdmin = (resourceUserId) => {
  return (req, res, next) => {
    if (req.user.role === 'admin' || req.user.id === resourceUserId) {
      next();
    } else {
      return errorResponse(res, 'Access denied', 403);
    }
  };
};