import { forwardRef } from 'react'
import clsx from 'clsx'

const Select = forwardRef(({
  label,
  error,
  hint,
  options = [],
  placeholder = 'Select an option',
  className,
  ...props
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {props.required ? (
            <>
              {label}
              <span className="text-primary-600 ml-0.5">*</span>
            </>
          ) : (
            label
          )}
        </label>
      )}
      <select
        ref={ref}
        className={clsx(
          'w-full px-4 py-2.5 border border-gray-300 rounded-lg',
          'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'outline-none transition-all duration-200',
          'bg-white',
          error && 'border-red-500 focus:ring-red-500',
          'appearance-none cursor-pointer'
        )}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
