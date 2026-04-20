import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as orderApi from '../api/orders'

/**
 * Hook to fetch user's orders
 * @param {Object} params - Pagination/filter params
 * @returns {Object} Query result
 */
export const useOrders = (params = {}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderApi.getOrders(params),
    staleTime: 1000 * 30, // 30 seconds
    retry: false, // Don't retry on 401/429
  })
}

/**
 * Hook to fetch single order
 * @param {string} id - Order ID
 * @returns {Object} Query result
 */
export const useOrder = (id) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.getOrder(id),
    enabled: !!id,
    staleTime: 1000 * 30,
  })
}

/**
 * Hook to create order
 * @returns {Object} Mutation object
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['cart'])
      queryClient.invalidateQueries(['orders'])
    },
  })
}

/**
 * Hook to verify payment
 * @returns {Object} Mutation object
 */
export const useVerifyPayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: orderApi.verifyPayment,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
      queryClient.invalidateQueries(['cart'])
    },
  })
}

/**
 * Hook to cancel order
 * @returns {Object} Mutation object
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }) => orderApi.cancelOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
    },
  })
}

/**
 * Hook to update order status (admin)
 * @returns {Object} Mutation object
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }) => orderApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
      queryClient.invalidateQueries(['adminOrders'])
    },
  })
}
