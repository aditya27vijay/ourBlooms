import clsx from 'clsx'

const SeasonalBadge = ({ availableFrom, availableUntil, className }) => {
  const now = new Date()
  const fromDate = availableFrom ? new Date(availableFrom) : null
  const untilDate = availableUntil ? new Date(availableUntil) : null

  let status = 'upcoming'
  let label = 'Coming Soon'
  let variant = 'info'

  if (fromDate && now >= fromDate) {
    if (untilDate && now > untilDate) {
      status = 'expired'
      label = 'Season Ended'
      variant = 'default'
    } else {
      status = 'active'
      label = 'In Season'
      variant = 'success'
    }
  }

  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    info: 'bg-blue-100 text-blue-700',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {label}
    </span>
  )
}

export default SeasonalBadge
