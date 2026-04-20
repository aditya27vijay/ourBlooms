import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { useCart as useCartQuery, useAddToCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '../hooks/useCart'

const CartContext = createContext(null)

export const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const { data: cartData, isLoading, error } = useCartQuery({
    enabled: isAuthenticated
  })
  const addToCartMutation = useAddToCart()
  const updateCartItemMutation = useUpdateCartItem()
  const removeCartItemMutation = useRemoveCartItem()
  const clearCartMutation = useClearCart()

  const cart = cartData?.data || null

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), [])

  const addItem = useCallback(
    async (productId, quantity = 1, size = 'medium') => {
      await addToCartMutation.mutateAsync({ productId, quantity, size })
      openCart()
    },
    [addToCartMutation, openCart]
  )

  const updateItem = useCallback(
    async (itemId, quantity) => {
      await updateCartItemMutation.mutateAsync({ itemId, quantity })
    },
    [updateCartItemMutation]
  )

  const removeItem = useCallback(
    async (itemId) => {
      await removeCartItemMutation.mutateAsync(itemId)
    },
    [removeCartItemMutation]
  )

  const clearCart = useCallback(async () => {
    await clearCartMutation.mutateAsync()
  }, [clearCartMutation])

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const cartTotal = cart?.totalPaise || 0
  const isEmpty = !cart?.items || cart.items.length === 0

  const value = {
    cart,
    items: cart?.items || [],
    isLoading,
    error,
    isOpen,
    cartCount,
    cartTotal,
    isEmpty,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
