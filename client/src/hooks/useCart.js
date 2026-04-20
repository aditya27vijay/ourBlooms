import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as cartApi from '../api/cart'

/**
 * Hook to fetch current cart
 * @param {Object} options - Query options
 * @returns {Object} Query result
 */
export const useCart = (options = {}) => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    staleTime: 1000 * 30, // 30 seconds - cart should be fresh
    retry: false, // Don't retry on 401/429 - let auth handle it
    ...options,
  })
}

/**
 * Hook to add item to cart
 * @returns {Object} Mutation object
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart'])
    },
  })
}

/**
 * Hook to update cart item
 * @returns {Object} Mutation object
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, quantity }) => cartApi.updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart'])
    },
  })
}

/**
 * Hook to remove cart item
 * @returns {Object} Mutation object
 */
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cartApi.removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart'])
    },
  })
}

/**
 * Hook to clear cart
 * @returns {Object} Mutation object
 */
export const useClearCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart'])
    },
  })
}

/**
 * Hook to apply coupon
 * @returns {Object} Mutation object
 */
export const useApplyCoupon = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cartApi.applyCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart'])
    },
  })
}

/**
 * Hook to remove coupon
 * @returns {Object} Mutation object
 */
export const useRemoveCoupon = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cartApi.removeCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart'])
    },
  })
}
