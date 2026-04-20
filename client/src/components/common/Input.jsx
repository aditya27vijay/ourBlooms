import { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(({
  label,
  error,
  hint,
  type = 'text',
  className,
  leftElement,
  rightElement,
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
      <div className="relative">
        {leftElement && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftElement}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={clsx(
            'w-full px-4 py-2.5 border border-gray-300 rounded-lg',
            'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'outline-none transition-all duration-200',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-500',
            leftElement && 'pl-10',
            rightElement && 'pr-10'
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
