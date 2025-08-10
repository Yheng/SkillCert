import * as React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import ProfessionalLanding from './pages/ProfessionalLanding'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Auth from './pages/Auth'
import Verification from './pages/Verification'
import Settings from './pages/Settings'
import EducatorDashboard from './pages/EducatorDashboard'
import Analytics from './pages/Analytics'
import { NeumorphicButton } from './components/shared/NeumorphicButton'
import { FaHome, FaTachometerAlt, FaTasks, FaCheckCircle, FaCog, FaSignOutAlt, FaGraduationCap, FaUsers, FaChartBar } from 'react-icons/fa'
import backendService from './api/backend'
import 'react-toastify/dist/ReactToastify.css'
import './professional-landing.css'

const Navigation = () => {
  const location = useLocation()
  const [user, setUser] = React.useState(null)
  const isAuthenticated = backendService.isAuthenticated()

  React.useEffect(() => {
    if (isAuthenticated) {
      const currentUser = backendService.getCurrentUser()
      setUser(currentUser)
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    backendService.logout()
    window.location.href = '/'
  }

  // Don't show navigation on landing page
  if (location.pathname === '/' || !isAuthenticated) {
    return null
  }

  // Role-based navigation items
  const getNavItems = (userRole) => {
    const commonItems = [
      { path: '/analytics', icon: FaChartBar, label: 'Analytics' },
      { path: '/settings', icon: FaCog, label: 'Settings' }
    ]
    
    switch (userRole) {
      case 'educator':
        return [
          { path: '/educator-dashboard', icon: FaGraduationCap, label: 'Dashboard' },
          { path: '/verification', icon: FaCheckCircle, label: 'Verification' },
          ...commonItems
        ]
      case 'employer':
        return [
          { path: '/verification', icon: FaCheckCircle, label: 'Verification' },
          { path: '/dashboard', icon: FaUsers, label: 'Candidates' },
          ...commonItems
        ]
      case 'admin':
        return [
          { path: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
          { path: '/verification', icon: FaCheckCircle, label: 'Verification' },
          { path: '/educator-dashboard', icon: FaGraduationCap, label: 'Educators' },
          ...commonItems
        ]
      default: // freelancer
        return [
          { path: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
          { path: '/tasks', icon: FaTasks, label: 'Tasks' },
          { path: '/verification', icon: FaCheckCircle, label: 'Verification' },
          ...commonItems
        ]
    }
  }

  const navItems = getNavItems(user?.role)

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="nav-bar"
    >
      <div className="nav-content">
        {/* Logo */}
        <Link to={user?.role === 'educator' ? '/educator-dashboard' : '/dashboard'} className="nav-logo">
          <div className="nav-logo-icon">
            <FaHome />
          </div>
          <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>SkillCert</span>
        </Link>

        {/* Navigation Items */}
        <div className="nav-items">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} className="nav-item">
                <NeumorphicButton
                  variant={isActive ? 'primary' : 'default'}
                  size="sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px' }}
                >
                  <item.icon style={{ fontSize: '12px' }} />
                  <span style={{ display: window.innerWidth >= 768 ? 'inline' : 'none' }}>{item.label}</span>
                </NeumorphicButton>
              </Link>
            )
          })}
        </div>

        {/* User Menu */}
        <div className="nav-user">
          <span className="nav-user-text">
            Welcome, {user?.email?.split('@')[0]}
          </span>
          <NeumorphicButton
            variant="default"
            size="sm"
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FaSignOutAlt style={{ fontSize: '12px' }} />
            <span style={{ display: window.innerWidth >= 768 ? 'inline' : 'none' }}>Logout</span>
          </NeumorphicButton>
        </div>
      </div>
    </motion.nav>
  )
}

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        <Navigation />
        
        <Routes>
          <Route path="/" element={<ProfessionalLanding />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/verification" element={<Verification />} />
          <Route 
            path="/*" 
            element={
              <main style={{ paddingTop: '64px' }}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/educator-dashboard" element={<EducatorDashboard />} />
                </Routes>
              </main>
            } 
          />
        </Routes>
        
        {/* Toast Container with custom styling */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{ background: 'transparent' }}
        />
      </div>
    </Router>
  )
}

export default App