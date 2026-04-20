import multer from 'multer';
import path from 'path';
import { errorResponse } from '../utils/apiResponse.js';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Create multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  }
});

/**
 * Middleware to handle multer errors
 */
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 'File too large. Maximum size is 5MB', 400);
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return errorResponse(res, 'Too many files. Maximum 10 files allowed', 400);
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return errorResponse(res, 'Unexpected file field', 400);
    }
  }

  if (err.message === 'Only image files are allowed') {
    return errorResponse(res, err.message, 400);
  }

  next(err);
};

/**
 * Single file upload middleware
 */
export const uploadSingle = (fieldName) => [
  upload.single(fieldName),
  handleMulterError
];

/**
 * Multiple files upload middleware
 */
export const uploadMultiple = (fieldName, maxCount = 10) => [
  upload.array(fieldName, maxCount),
  handleMulterError
];

/**
 * Mixed file upload middleware (for product images)
 */
export const uploadProductImages = [
  upload.fields([
    { name: 'images', maxCount: 10 }
  ]),
  handleMulterError
];