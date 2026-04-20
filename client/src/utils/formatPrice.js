/**
 * Format price from paise to Indian Rupees
 * @param {number} paise - Amount in paise
 * @returns {string} Formatted price string
 */
export const formatPrice = (paise) => {
  if (paise === null || paise === undefined) return '₹0'

  const rupees = paise / 100
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees)
}

/**
 * Format price without currency symbol (for inputs)
 * @param {number} paise - Amount in paise
 * @returns {string} Formatted number string
 */
export const formatPriceNumber = (paise) => {
  if (paise === null || paise === undefined) return '0'

  const rupees = paise / 100
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees)
}

/**
 * Convert rupees to paise
 * @param {number} rupees - Amount in rupees
 * @returns {number} Amount in paise
 */
export const toPaise = (rupees) => {
  return Math.round(rupees * 100)
}
