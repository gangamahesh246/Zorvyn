import { useState } from 'react'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
]

export default function Sidebar({ activePage, onNavigate, collapsed, onToggle }) {
  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          bg-sidebar flex flex-col
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-white font-bold text-lg tracking-tight animate-fade-in">
              FinDash
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="animate-fade-in">{item.label}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 hidden lg:block">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm transition-all duration-200"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="animate-fade-in">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
