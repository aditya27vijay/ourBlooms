import { useEffect } from 'react'

/**
 * Scroll to top on mount or dependency change
 * @param {Array} dependencies - Dependencies to trigger scroll
 */
export const useScrollTop = (dependencies = []) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, dependencies)
}
