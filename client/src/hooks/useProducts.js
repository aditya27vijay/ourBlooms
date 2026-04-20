import { useQuery } from '@tanstack/react-query'
import * as productApi from '../api/products'

/**
 * Hook to fetch products with filters
 * @param {Object} filters - Filter parameters
 * @returns {Object} Query result
 */
export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productApi.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry on 401/429
  })
}

/**
 * Hook to fetch single product by slug
 * @param {string} slug - Product slug
 * @returns {Object} Query result
 */
export const useProduct = (slug) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productApi.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Hook to fetch categories
 * @returns {Object} Query result
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: productApi.getCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}

/**
 * Hook to fetch related products
 * @param {string} productId - Product ID
 * @param {number} limit - Number of products
 * @returns {Object} Query result
 */
export const useRelatedProducts = (productId, limit = 4) => {
  return useQuery({
    queryKey: ['relatedProducts', productId, limit],
    queryFn: () => productApi.getRelatedProducts(productId, limit),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  })
}
