import { useSelector, useDispatch } from 'react-redux'
import { setRole } from '../../store/slices/roleSlice'
import { toggleTheme } from '../../store/slices/themeSlice'
import {
  Search,
  Sun,
  Moon,
  Bell,
  Menu,
  Shield,
  Eye,
} from 'lucide-react'

const pageTitles = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  insights: 'Insights',
}

export default function Header({ activePage, onMenuToggle }) {
  const dispatch = useDispatch()
  const role = useSelector((state) => state.role.current)
  const theme = useSelector((state) => state.theme.mode)

  return (
    <header className="h-16 bg-surface-card dark:bg-surface-dark-card border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden btn-ghost p-2"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {pageTitles[activePage] || 'Dashboard'}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Role Switcher */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <button
            onClick={() => dispatch(setRole('admin'))}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              role === 'admin'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
          <button
            onClick={() => dispatch(setRole('viewer'))}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              role === 'viewer'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Viewer</span>
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="btn-ghost p-2 rounded-xl"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
        </button>

        {/* Notifications */}
        <button className="btn-ghost p-2 rounded-xl relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center ml-1">
          <span className="text-white text-sm font-semibold">MK</span>
        </div>
      </div>
    </header>
  )
}
