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
import { FaHome, FaTachometerAlt, FaTasks, FaCheckCircle, FaCog, FaSignOutAlt, FaGraduationCap, FaUsers, FaChartBar, FaBars, FaTimes, FaShieldAlt, FaChevronRight, FaEye, FaPlay } from 'react-icons/fa'
import backendService from './api/backend'
import 'react-toastify/dist/ReactToastify.css'
import './professional-landing.css'

// Public Layout Component (for non-authenticated verification)
const PublicVerificationLayout = ({ children }) => {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Landing Page Header */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: 'linear-gradient(135deg, #2DD4BF, #3B82F6)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaShieldAlt style={{ color: 'white', fontSize: '1.25rem' }} />
              </div>
              <div>
                <span style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 700, 
                  color: 'white'
                }}>SkillCert</span>
                <div style={{ fontSize: '0.75rem', color: 'rgba(248, 250, 252, 0.7)' }}>
                  Verified Skills Platform
                </div>
              </div>
            </Link>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <Link to="/#features" style={{ 
                  color: 'rgba(248, 250, 252, 0.8)', 
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}>Features</Link>
                <Link to="/#testimonials" style={{ 
                  color: 'rgba(248, 250, 252, 0.8)', 
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}>Testimonials</Link>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/verification" style={{ 
                  color: '#2DD4BF', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 600
                }}>
                  <FaEye />
                  Verify
                </Link>
                <button
                  onClick={async () => {
                    try {
                      const result = await backendService.login({
                        email: 'demo@skillcert.com',
                        password: 'demo123'
                      })
                      if (result.success) {
                        const userRole = result.user?.role || 'freelancer'
                        switch (userRole) {
                          case 'educator':
                            window.location.href = '/educator-dashboard'
                            break
                          case 'employer':
                            window.location.href = '/verification'
                            break
                          default:
                            window.location.href = '/dashboard'
                        }
                      } else {
                        alert('Demo login failed: ' + (result.error || 'Unknown error'))
                      }
                    } catch (error) {
                      console.error('Demo login error:', error)
                      alert('Demo login failed: ' + error.message)
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #2DD4BF, #3B82F6)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <FaPlay />
                  Try Demo
                </button>
                <Link to="/auth">
                  <button style={{
                    background: 'transparent',
                    border: '2px solid #2DD4BF',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    color: '#2DD4BF',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    Get Started Free
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with top padding for fixed header */}
      <main style={{ 
        paddingTop: '80px', 
        minHeight: '100vh',
        background: 'var(--bg-primary)'
      }}>
        <div className="page-container" style={{ padding: 'var(--space-2xl)' }}>
          {children}
        </div>
      </main>
    </div>
  )
}

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
          {/* Public verification route for non-authenticated users */}
          <Route 
            path="/verification" 
            element={
              !backendService.isAuthenticated() ? (
                <PublicVerificationLayout>
                  <Verification />
                </PublicVerificationLayout>
              ) : (
                <AppLayout>
                  <Verification />
                </AppLayout>
              )
            } 
          />
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