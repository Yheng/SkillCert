import * as React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import ProfessionalLanding from './pages/ProfessionalLanding'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Auth from './pages/Auth'
import Verification from './pages/Verification'
import Settings from './pages/Settings'
import EducatorDashboard from './pages/EducatorDashboard'
import Analytics from './pages/Analytics'
import { NeumorphicButton } from './components/shared/NeumorphicButton'
import { FaHome, FaTachometerAlt, FaTasks, FaCheckCircle, FaCog, FaSignOutAlt, FaGraduationCap, FaUsers, FaChartBar, FaBars, FaTimes, FaShieldAlt, FaChevronRight } from 'react-icons/fa'
import backendService from './api/backend'
import 'react-toastify/dist/ReactToastify.css'
import './professional-landing.css'

// Modern Sidebar Navigation Component
const AppLayout = ({ children }) => {
  const location = useLocation()
  const [user, setUser] = React.useState(null)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const isAuthenticated = backendService.isAuthenticated()

  React.useEffect(() => {
    if (isAuthenticated) {
      const currentUser = backendService.getCurrentUser()
      setUser(currentUser)
    }
  }, [isAuthenticated])

  React.useEffect(() => {
    // Close sidebar on route change on mobile
    setSidebarOpen(false)
  }, [location.pathname])

  React.useEffect(() => {
    // Close sidebar when clicking outside on mobile
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.mobile-menu-button')) {
        setSidebarOpen(false)
      }
    }
    
    if (sidebarOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [sidebarOpen])

  const handleLogout = () => {
    backendService.logout()
    window.location.href = '/'
  }

  // Don't show navigation on landing page or when not authenticated
  if (location.pathname === '/' || !isAuthenticated) {
    return children
  }

  // Role-based navigation items
  const getNavItems = (userRole) => {
    const coreItems = {
      educator: [
        { path: '/educator-dashboard', icon: FaGraduationCap, label: 'Dashboard', description: 'Manage students and courses' },
        { path: '/verification', icon: FaShieldAlt, label: 'Verification', description: 'Verify credentials' },
      ],
      employer: [
        { path: '/verification', icon: FaShieldAlt, label: 'Verification', description: 'Verify candidate credentials' },
        { path: '/dashboard', icon: FaUsers, label: 'Candidates', description: 'View candidate profiles' },
      ],
      admin: [
        { path: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard', description: 'System overview' },
        { path: '/verification', icon: FaShieldAlt, label: 'Verification', description: 'Manage verifications' },
        { path: '/educator-dashboard', icon: FaGraduationCap, label: 'Educators', description: 'Manage educators' },
      ],
      freelancer: [
        { path: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard', description: 'Your credential portfolio' },
        { path: '/tasks', icon: FaTasks, label: 'Tasks', description: 'Complete skill assessments' },
        { path: '/verification', icon: FaShieldAlt, label: 'Verification', description: 'Verify your credentials' },
      ]
    }
    
    const secondaryItems = [
      { path: '/analytics', icon: FaChartBar, label: 'Analytics', description: 'View insights and reports' },
      { path: '/settings', icon: FaCog, label: 'Settings', description: 'Account preferences' }
    ]
    
    return {
      primary: coreItems[userRole] || coreItems.freelancer,
      secondary: secondaryItems
    }
  }

  const navItems = getNavItems(user?.role)
  const defaultDashboard = user?.role === 'educator' ? '/educator-dashboard' : '/dashboard'

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={{ x: 0 }}
        className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}
      >
        <div className="sidebar-header">
          <Link to={defaultDashboard} className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <FaShieldAlt />
            </div>
            <span className="sidebar-logo-text">SkillCert</span>
          </Link>
        </div>
        
        <div className="sidebar-nav">
          {/* User Info */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'} Dashboard
            </div>
          </div>

          {/* Primary Navigation */}
          <div className="sidebar-section">
            {navItems.primary.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  title={item.description}
                >
                  <div className="sidebar-item-icon">
                    <item.icon size={20} />
                  </div>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Secondary Navigation */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">General</div>
            {navItems.secondary.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  title={item.description}
                >
                  <div className="sidebar-item-icon">
                    <item.icon size={20} />
                  </div>
                  <span>{item.label}</span>
                </Link>
              )
            })}
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="sidebar-item"
              style={{ 
                background: 'none', 
                border: 'none', 
                width: '100%', 
                textAlign: 'left',
                cursor: 'pointer'
              }}
              title="Sign out of your account"
            >
              <div className="sidebar-item-icon">
                <FaSignOutAlt size={20} />
              </div>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Top Bar */}
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="topbar"
      >
        <div className="topbar-left">
          {/* Mobile menu toggle - only show on mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="topbar-menu-toggle"
            aria-label="Toggle navigation menu"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          
          {/* Breadcrumb */}
          <div className="topbar-breadcrumb">
            <span>SkillCert</span>
            <FaChevronRight className="topbar-breadcrumb-separator" />
            <span>{navItems.primary.find(item => item.path === location.pathname)?.label || 'Dashboard'}</span>
          </div>
        </div>
        
        <div className="topbar-right">
          <div className="topbar-user">
            <span className="topbar-user-text">
              {user?.email?.split('@')[0] || 'User'}
            </span>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay active"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className='main-content'>
        <div className='page-container'>
          {children}
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Routes>
          <Route path="/" element={<ProfessionalLanding />} />
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/*" 
            element={
              <AppLayout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/verification" element={<Verification />} />
                  <Route path="/educator-dashboard" element={<EducatorDashboard />} />
                </Routes>
              </AppLayout>
            } 
          />
        </Routes>
        
        {/* Modern Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-secondary)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--text-primary)',
            fontSize: '14px'
          }}
        />
      </div>
    </Router>
  )
}

export default App