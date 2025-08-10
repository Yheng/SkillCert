import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { GlassCard } from "../components/shared/GlassCard"
import { ThreeDBadge } from "../components/shared/ThreeDBadge"
import { AuroraToast } from "../components/shared/AuroraToast"
import ProgressChart from "../components/shared/ProgressChart"
import CertificateCard from "../components/shared/CertificateCard"
import { 
  FaCertificate, 
  FaTasks, 
  FaChartLine, 
  FaPlus,
  FaEye,
  FaDownload,
  FaShare,
  FaShieldAlt,
  FaExclamationTriangle
} from "react-icons/fa"
import backendService from "../api/backend"
import blockchainService from "../api/blockchain"

const StatCard = ({ icon: Icon, title, value, description, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="stat-card"
  >
    <div className="stat-icon" style={{ background: `linear-gradient(45deg, ${color || 'var(--teal), var(--blue)'})` }}>
      <Icon />
    </div>
    <div className="stat-value">{value}</div>
    <div className="stat-title">{title}</div>
    <div className="stat-description">{description}</div>
  </motion.div>
)



const Dashboard = () => {
  const [user, setUser] = React.useState(null)
  const [stats, setStats] = React.useState({
    credentials: 0,
    tasks: 0,
    progress: 0
  })
  const [credentials, setCredentials] = React.useState([])
  const [tasks, setTasks] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [chartData, setChartData] = React.useState(null)
  const [walletConnected, setWalletConnected] = React.useState(false)
  const [walletAddress, setWalletAddress] = React.useState('')
  const [connectingWallet, setConnectingWallet] = React.useState(false)
  const [blockchainCredentials, setBlockchainCredentials] = React.useState([])
  const [walletError, setWalletError] = React.useState(null)

  React.useEffect(() => {
    loadDashboardData()
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setWalletConnected(true)
          setWalletAddress(accounts[0])
          // Try to connect to blockchain service
          await blockchainService.connectWallet()
          // Load blockchain credentials
          loadBlockchainCredentials(accounts[0])
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error)
    }
  }

  const connectWallet = async () => {
    try {
      setConnectingWallet(true)
      setWalletError(null)
      
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        setWalletError({
          type: 'not_installed',
          title: 'MetaMask Not Found',
          message: 'Please install MetaMask browser extension to connect your wallet.',
          action: 'Install MetaMask',
          actionUrl: 'https://metamask.io/download/'
        })
        return
      }
      
      const result = await blockchainService.connectWallet()
      
      if (result.success) {
        setWalletConnected(true)
        setWalletAddress(result.address)
        loadBlockchainCredentials(result.address)
        setWalletError(null)
        AuroraToast.success('Wallet connected successfully!')
      } else {
        // Handle specific error types
        let errorDetails = {
          type: 'connection_failed',
          title: 'Connection Failed',
          message: result.error || 'Unable to connect to your wallet.'
        }
        
        if (result.error?.includes('User rejected')) {
          errorDetails = {
            type: 'user_rejected',
            title: 'Connection Rejected',
            message: 'You rejected the connection request. Please try again and approve the connection.'
          }
        } else if (result.error?.includes('network')) {
          errorDetails = {
            type: 'network_error',
            title: 'Network Error',
            message: 'Please check your internet connection and try again.'
          }
        }
        
        setWalletError(errorDetails)
        AuroraToast.error(errorDetails.message)
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      const errorMessage = error.message || 'An unexpected error occurred'
      setWalletError({
        type: 'unexpected_error',
        title: 'Unexpected Error',
        message: errorMessage,
        action: 'Retry Connection'
      })
      AuroraToast.error('Failed to connect wallet. Please try again.')
    } finally {
      setConnectingWallet(false)
    }
  }

  const loadBlockchainCredentials = async (address) => {
    try {
      const result = await blockchainService.getUserCredentials(address)
      if (result.success && result.credentials) {
        setBlockchainCredentials(result.credentials)
      }
    } catch (error) {
      console.error('Error loading blockchain credentials:', error)
    }
  }

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Get user profile
      const profileResult = await backendService.getProfile()
      if (profileResult.success) {
        setUser(profileResult.user)
      }

      // Get user credentials
      const credentialsResult = await backendService.getUserCredentials()
      if (credentialsResult.success) {
        setCredentials(credentialsResult.credentials)
      }

      // Get user tasks
      const tasksResult = await backendService.getUserTasks()
      if (tasksResult.success) {
        setTasks(tasksResult.tasks)
      }

      // Update stats
      setStats({
        credentials: credentialsResult.credentials?.length || 0,
        tasks: tasksResult.tasks?.length || 0,
        progress: Math.min(((credentialsResult.credentials?.length || 0) * 10), 100)
      })

      // Generate chart data based on credentials
      if (credentialsResult.success && credentialsResult.credentials) {
        generateChartData(credentialsResult.credentials)
      }

    } catch (error) {
      console.error('Dashboard loading error:', error)
      AuroraToast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const generateChartData = (credentials) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentYear = new Date().getFullYear()
    
    const monthlyData = months.map((month, index) => {
      const monthCredentials = credentials.filter(cred => {
        const credDate = new Date(cred.created_at)
        return credDate.getFullYear() === currentYear && credDate.getMonth() === index
      })
      return monthCredentials.length
    })

    setChartData({
      categories: months,
      values: monthlyData
    })
  }

  const handleViewCredential = async (credential) => {
    try {
      // Verify credential on blockchain
      const result = await blockchainService.verifyCredential(credential.blockchain_id)
      if (result.success) {
        AuroraToast.credential(`Credential verified! Status: ${result.isValid ? 'Valid' : 'Invalid'}`)
      } else {
        AuroraToast.warning('Could not verify credential on blockchain')
      }
    } catch (error) {
      console.error('Credential verification error:', error)
      AuroraToast.error('Failed to verify credential')
    }
  }

  const handleShareCredential = (credential) => {
    const shareUrl = `${window.location.origin}/verify/${credential.blockchain_id}`
    navigator.clipboard.writeText(shareUrl).then(() => {
      AuroraToast.success('Credential verification link copied to clipboard!')
    }).catch(() => {
      AuroraToast.info(`Share this link: ${shareUrl}`)
    })
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <div className="loading-text">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="page-header"
      >
        <h1 className="page-title">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="page-subtitle">
          Track your progress and manage your blockchain-verified credentials
        </p>
      </motion.div>
      
      <div className="dashboard-content">

        {/* Enhanced Wallet Connection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`connection-card ${walletConnected ? 'success' : connectingWallet ? 'pending' : ''}`}
        >
          <div className="connection-status">
            <div className={`connection-icon ${
              connectingWallet ? 'connecting' : 
              walletConnected ? 'connected' : 'disconnected'
            }`} style={{ animation: 'none' }}>
              {connectingWallet ? (
                <FaClock />
              ) : walletConnected ? (
                <FaShieldAlt />
              ) : (
                <FaExclamationTriangle />
              )}
            </div>
            <div className="connection-info">
              <div className="connection-title">
                {connectingWallet ? 'Connecting to MetaMask...' :
                 walletConnected ? 'Blockchain Connected' : 'Blockchain Connection Required'}
              </div>
              <div className="connection-description">
                {connectingWallet ? 'Please approve the connection in your MetaMask wallet' :
                 walletConnected ? 'Your wallet is connected and ready for blockchain operations' :
                 'Connect your MetaMask wallet to access blockchain-verified credentials'}
              </div>
              {walletConnected && walletAddress && (
                <div className="connection-address">
                  {walletAddress.substring(0, 8)}...{walletAddress.substring(34)}
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)' }}>
              {walletConnected ? (
                <div className="status-indicator status-connected">
                  <FaShieldAlt size={12} />
                  Connected
                </div>
              ) : connectingWallet ? (
                <div className="status-indicator status-pending">
                  <FaClock size={12} />
                  Connecting
                </div>
              ) : (
                <div className="status-indicator status-disconnected">
                  <FaExclamationTriangle size={12} />
                  Disconnected
                </div>
              )}
              
              {!walletConnected && !connectingWallet && (
                <button
                  className="btn btn-primary"
                  onClick={connectWallet}
                  disabled={connectingWallet}
                  style={{ minWidth: '160px' }}
                >
                  <FaShieldAlt />
                  Connect MetaMask
                </button>
              )}
            </div>
          </div>
          
          {walletConnected && blockchainCredentials.length > 0 && (
            <div style={{ 
              marginTop: 'var(--space-lg)',
              padding: 'var(--space-lg)',
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 'var(--radius-lg)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-sm)',
                color: 'var(--success)',
                fontSize: 'var(--text-sm)',
                fontWeight: '500'
              }}>
                <FaCertificate />
                {blockchainCredentials.length} blockchain credential{blockchainCredentials.length !== 1 ? 's' : ''} verified
              </div>
            </div>
          )}
          
          {/* Enhanced Error Display */}
          {walletError && (
            <div className="error-container">
              <div className="error-header">
                <FaExclamationTriangle className="error-icon" />
                <div className="error-title">{walletError.title}</div>
              </div>
              <div className="error-message">{walletError.message}</div>
              <div className="error-actions">
                {walletError.actionUrl ? (
                  <motion.a
                    href={walletError.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {walletError.action}
                  </motion.a>
                ) : (
                  <motion.button
                    className="btn btn-primary"
                    onClick={() => {
                      setWalletError(null)
                      if (walletError.type === 'user_rejected' || walletError.type === 'unexpected_error') {
                        connectWallet()
                      }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {walletError.action || 'Try Again'}
                  </motion.button>
                )}
                <motion.button
                  className="btn btn-ghost"
                  onClick={() => setWalletError(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Dismiss
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3">
          <StatCard
            icon={FaCertificate}
            title="Credentials Earned"
            value={stats.credentials}
            description="Verified blockchain credentials"
            trend={{ direction: 'up', value: '+2 this month' }}
            delay={0.15}
          />
          <StatCard
            icon={FaTasks}
            title="Tasks Completed"
            value={stats.tasks}
            description="Projects submitted for review"
            trend={{ direction: 'up', value: '+5 this week' }}
            delay={0.2}
          />
          <StatCard
            icon={FaChartLine}
            title="Progress Score"
            value={`${stats.progress}%`}
            description="Overall skill development"
            trend={{ direction: 'up', value: '+12% this month' }}
            delay={0.25}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2">
          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="card">
              <ProgressChart data={chartData} title="Your Learning Progress" />
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <div className="card">
              <h2 className="text-lg font-semibold text-primary" style={{ marginBottom: 'var(--space-xl)' }}>Quick Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => window.location.href = '/tasks'}
                  style={{ justifyContent: 'flex-start' }}
                >
                  <FaPlus /> Submit New Task
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => window.location.href = '/verification'}
                  style={{ justifyContent: 'flex-start' }}
                >
                  <FaEye /> Verify Credential
                </button>
                <button 
                  className="btn btn-ghost"
                  onClick={() => {
                    const csvData = credentials.map(c => 
                      `${c.skill},${c.blockchain_id},${new Date(c.created_at || Date.now()).toDateString()}`
                    ).join('\n')
                    const blob = new Blob([`Skill,ID,Date\n${csvData}`], { type: 'text/csv' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'my-credentials.csv'
                    a.click()
                    console.log('Credentials exported successfully!')
                  }}
                  style={{ justifyContent: 'flex-start' }}
                >
                  <FaDownload /> Export Credentials
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="card">
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <h2 className="text-xl font-semibold text-primary" style={{ marginBottom: 'var(--space-sm)' }}>Your Credentials</h2>
              <p className="text-sm text-tertiary">Your latest verified achievements</p>
            </div>
            
            {credentials.length > 0 ? (
              <div className="grid grid-cols-2">
                {credentials.slice(0, 6).map((credential, index) => (
                  <div key={credential.id} className="credential-card">
                    <div className="credential-header">
                      <div className="credential-info">
                        <div className="credential-skill">{credential.skill}</div>
                        <div className="credential-meta">
                          <FaCertificate size={12} />
                          <span>{credential.issuer || 'SkillCert'}</span>
                        </div>
                        <div className="credential-meta">
                          <span>{new Date(credential.created_at || credential.dateIssued).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="credential-actions">
                        <button 
                          className="btn btn-sm btn-ghost" 
                          onClick={() => handleViewCredential(credential)}
                          title="View credential"
                        >
                          <FaEye size={12} />
                        </button>
                        <button 
                          className="btn btn-sm btn-ghost" 
                          onClick={() => handleShareCredential(credential)}
                          title="Share credential"
                        >
                          <FaShare size={12} />
                        </button>
                        <button className="btn btn-sm btn-ghost" title="Download credential">
                          <FaDownload size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaCertificate />
                </div>
                <h3 className="empty-title">No Credentials Yet</h3>
                <p className="empty-description">
                  Start by submitting tasks to earn your first blockchain-verified credential!
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.href = '/tasks'}
                  style={{ marginTop: 'var(--space-lg)' }}
                >
                  <FaPlus />
                  Submit Your First Task
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Dashboard