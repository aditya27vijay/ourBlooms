import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Generate access token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );
};

/**
 * Set refresh token as httpOnly cookie
 */
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

/**
 * Register new user
 */
export const register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 'User with this email already exists', 400);
    }

    // Hash password
    const passwordHash = await User.hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password_hash: passwordHash,
      name,
      phone
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token cookie
    setRefreshTokenCookie(res, refreshToken);

    logger.info(`New user registered: ${email}`);

    successResponse(res, 'User registered successfully', {
      user,
      accessToken
    });
  } catch (error) {
    logger.error('Registration error:', error);
    errorResponse(res, 'Registration failed', 500);
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Check password
    const isValidPassword = await user.checkPassword(password);
    if (!isValidPassword) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token cookie
    setRefreshTokenCookie(res, refreshToken);

    logger.info(`User logged in: ${email}`);

    successResponse(res, 'Login successful', {
      user,
      accessToken
    });
  } catch (error) {
    logger.error('Login error:', error);
    errorResponse(res, 'Login failed', 500);
  }
};

/**
 * Refresh access token
 */
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return errorResponse(res, 'Refresh token not provided', 401);
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    // Generate new access token
    const accessToken = generateAccessToken(user);

    successResponse(res, 'Token refreshed successfully', {
      accessToken
    });
  } catch (error) {
    logger.error('Token refresh error:', error);
    errorResponse(res, 'Invalid refresh token', 401);
  }
};

/**
 * Logout user
 */
export const logout = async (req, res) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    successResponse(res, 'Logged out successfully');
  } catch (error) {
    logger.error('Logout error:', error);
    errorResponse(res, 'Logout failed', 500);
  }
};

/**
 * Get current user profile
 */
export const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, 'User profile retrieved successfully', { user });
  } catch (error) {
    logger.error('Get profile error:', error);
    errorResponse(res, 'Failed to get user profile', 500);
  }
};