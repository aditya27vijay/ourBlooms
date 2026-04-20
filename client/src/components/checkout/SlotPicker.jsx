import { useState } from 'react'
import { formatTimeSlot, formatDateShort, isToday, isPast, addDays } from '../../utils/dateHelpers'
import clsx from 'clsx'

const SlotPicker = ({ slots = [], selectedSlot, onSelect, error }) => {
  const [selectedDate, setSelectedDate] = useState(0)

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    const dateKey = slot.date
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(slot)
    return acc
  }, {})

  // Get next 7 days
  const dates = Object.keys(slotsByDate).slice(0, 7)

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No delivery slots available. Please try a different date.
      </div>
    )
  }

  const handleSlotSelect = (slot) => {
    if (slot.availableOrders > 0) {
      onSelect(slot.id)
    }
  }

  return (
    <div className="space-y-4">
      {/* Date selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {dates.map((date, index) => {
          const dateObj = new Date(date)
          const isPassed = isPast(dateObj) && !isToday(dateObj)

          return (
            <button
              key={date}
              onClick={() => !isPassed && setSelectedDate(index)}
              disabled={isPassed}
              className={clsx(
                'flex-shrink-0 px-4 py-3 rounded-lg border text-center transition-colors',
                selectedDate === index
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300',
                isPassed && 'opacity-50 cursor-not-allowed bg-gray-100'
              )}
            >
              <p className="text-xs text-gray-500 uppercase">
                {isToday(dateObj) ? 'Today' : dateObj.toLocaleDateString('en-IN', { weekday: 'short' })}
              </p>
              <p className={clsx('font-semibold', selectedDate === index ? 'text-primary-600' : 'text-gray-900')}>
                {dateObj.getDate()} {dateObj.toLocaleDateString('en-IN', { month: 'short' })}
              </p>
            </button>
          )
        })}
      </div>

      {/* Time slots */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {slotsByDate[dates[selectedDate]]?.map((slot) => {
          const isAvailable = slot.availableOrders > 0
          const isSelected = selectedSlot === slot.id

          return (
            <button
              key={slot.id}
              onClick={() => handleSlotSelect(slot)}
              disabled={!isAvailable}
              className={clsx(
                'p-3 rounded-lg border text-center transition-colors',
                isSelected
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : isAvailable
                  ? 'border-gray-200 hover:border-primary-600 hover:bg-primary-50'
                  : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
              )}
            >
              <p className={clsx('text-sm font-medium', isSelected ? 'text-white' : 'text-gray-900')}>
                {formatTimeSlot(slot.startTime, slot.endTime)}
              </p>
              <p className={clsx('text-xs mt-1', isSelected ? 'text-white/80' : 'text-gray-500')}>
                {isAvailable ? `${slot.availableOrders} slots left` : 'Full'}
              </p>
            </button>
          )
        })}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default SlotPicker
