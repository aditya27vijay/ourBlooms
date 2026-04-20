import clsx from 'clsx'

const PageLayout = ({
  children,
  className,
  containerSize = 'xl',
  padding = true,
}) => {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  }

  return (
    <div className={clsx('w-full', containerSize ? sizes[containerSize] : '', 'mx-auto')}>
      {padding ? (
        <div className={clsx('px-4 sm:px-6 lg:px-8 py-8', className)}>
          {children}
        </div>
      ) : (
        <div className={className}>{children}</div>
      )}
    </div>
  )
}

export default PageLayout
