import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'

const Sidebar = ({ items = [], className }) => {
  const location = useLocation()

  return (
    <nav className={clsx('space-y-1', className)}>
      {items.map((item) => {
        const isActive = location.pathname === item.href
        return (
          <Link
            key={item.href}
            to={item.href}
            className={clsx(
              'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
              isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            {item.icon && <span className="mr-3">{item.icon}</span>}
            {item.label}
            {item.badge && (
              <span className="ml-auto bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

export default Sidebar
