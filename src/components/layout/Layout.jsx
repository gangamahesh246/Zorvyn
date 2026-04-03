import { useState } from 'react'
import { useSelector } from 'react-redux'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout({ children, activePage, onNavigate }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const theme = useSelector((state) => state.theme.mode)

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed)

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-surface dark:bg-surface-dark transition-colors duration-200">
        <Sidebar
          activePage={activePage}
          onNavigate={(page) => {
            onNavigate(page)
            if (window.innerWidth < 1024) setSidebarCollapsed(true)
          }}
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />

        <div
          className={`transition-all duration-300 ${
            sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
        >
          <Header activePage={activePage} onMenuToggle={toggleSidebar} />
          <main className="p-4 lg:p-6 animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
