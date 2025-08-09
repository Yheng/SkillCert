import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { GlassCard } from "../components/shared/GlassCard"
import { ThreeDBadge } from "../components/shared/ThreeDBadge"
import { AuroraToast } from "../components/shared/AuroraToast"
import Chart from "react-apexcharts"
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
  >
    <div className="stat-card">
      <div 
        className="stat-icon"
        style={{ background: `linear-gradient(45deg, ${color.split(' ')[1]}, ${color.split(' ')[3]})` }}
      >
        <Icon />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
      <div className="stat-description">{description}</div>
    </div>
  </motion.div>
)

const CredentialCard = ({ credential, onView, onShare }) => (
  <div className="credential-card">
    <div className="credential-header">
      <div className="credential-info">
        <h3 className="credential-skill">{credential.skill}</h3>
        <p className="credential-meta">
          Issued: {new Date(credential.timestamp || credential.created_at).toLocaleDateString()}
        </p>
        <p className="credential-meta">
          ID: #{credential.id}
        </p>
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          background: 'linear-gradient(45deg, var(--teal), var(--blue))',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.75rem'
        }}>
          {credential.skill.slice(0, 4).toUpperCase()}
        </div>
      </div>
    </div>
    
    <div className="credential-actions">
      <Button 
        size="sm" 
        variant="glass"
        onClick={() => onView(credential)}
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
      >
        <FaEye /> View
      </Button>
      <Button 
        size="sm" 
        variant="neumorphic"
        onClick={() => onShare(credential)}
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
      >
        <FaShare /> Share
      </Button>
    </div>
  </div>
)

const ProgressChart = ({ data }) => {
  const chartOptions = {
    chart: {
      type: 'line',
      background: 'transparent',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#2DD4BF', '#3B82F6'],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: data?.categories || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      labels: { style: { colors: '#9CA3AF' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: '#9CA3AF' } },
      grid: { borderColor: '#374151' },
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 4,
    },
    tooltip: {
      theme: 'dark',
      style: {
        background: 'rgba(31, 42, 68, 0.9)',
      },
    },
    colors: ['#2DD4BF'],
  }

  const series = [{
    name: 'Skills Earned',
    data: data?.values || [2, 4, 3, 6, 8, 12]
  }]

  return (
    <GlassCard className="p-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-gradient">Your Learning Progress</CardTitle>
        <CardDescription>Track your skill development over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Chart
          options={chartOptions}
          series={series}
          type="line"
          height={300}
        />
      </CardContent>
    </GlassCard>
  )
}

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
      const result = await blockchainService.connectWallet()
      
      if (result.success) {
        setWalletConnected(true)
        setWalletAddress(result.address)
        loadBlockchainCredentials(result.address)
        AuroraToast.success('Wallet connected successfully!')
      } else {
        AuroraToast.error(`Failed to connect wallet: ${result.error}`)
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      AuroraToast.error('Failed to connect wallet. Please make sure MetaMask is installed.')
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
      <div className="loading-spinner">
        <div style={{ textAlign: 'center' }}>
          <div className="spinner"></div>
          <p className="body-text" style={{ fontSize: '1.125rem' }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: '2rem' }}
        >
          <h1 className="heading-h1" style={{ marginBottom: '1rem' }}>
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="subheading">
            Track your progress and manage your blockchain-verified credentials
          </p>
        </motion.div>

        {/* Wallet Connection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card"
          style={{ padding: '1.5rem', marginBottom: '2rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: walletConnected ? 'var(--green)' : 'var(--orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                {walletConnected ? <FaShieldAlt /> : <FaExclamationTriangle />}
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: '600', marginBottom: '0.25rem', fontSize: '1.1rem' }}>
                  Blockchain Status
                </div>
                <div style={{ color: 'var(--light-gray)', fontSize: '0.875rem' }}>
                  {walletConnected 
                    ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
                    : 'Connect your wallet to access blockchain features'
                  }
                </div>
                {walletConnected && blockchainCredentials.length > 0 && (
                  <div style={{ color: 'var(--teal)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {blockchainCredentials.length} blockchain credential{blockchainCredentials.length !== 1 ? 's' : ''} found
                  </div>
                )}
              </div>
            </div>
            
            {!walletConnected && (
              <button
                className="btn-primary"
                onClick={connectWallet}
                disabled={connectingWallet}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
              >
                {connectingWallet ? (
                  <>
                    <div className="spinner" style={{ width: '1rem', height: '1rem' }} />
                    Connecting...
                  </>
                ) : (
                  <>
                    <FaShieldAlt />
                    Connect MetaMask
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <StatCard
            icon={FaCertificate}
            title="Credentials Earned"
            value={stats.credentials}
            description="Verified blockchain credentials"
            color="from var(--teal) to var(--blue)"
            delay={0}
          />
          <StatCard
            icon={FaTasks}
            title="Tasks Completed"
            value={stats.tasks}
            description="Projects submitted for review"
            color="from var(--blue) to var(--purple)"
            delay={0.2}
          />
          <StatCard
            icon={FaChartLine}
            title="Progress Score"
            value={`${stats.progress}%`}
            description="Overall skill development"
            color="from var(--purple) to var(--green)"
            delay={0.4}
          />
        </div>

        {/* Main Content Grid */}
        <div className="main-grid">
          {/* Progress Chart */}
          <div>
            <ProgressChart data={chartData} />
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h2 className="heading-h2" style={{ marginBottom: '1.5rem' }}>Quick Actions</h2>
              <div className="quick-actions">
                <button 
                  className="action-button"
                  onClick={() => window.location.href = '/tasks'}
                >
                  <FaPlus /> Submit New Task
                </button>
                <button 
                  className="action-button"
                  onClick={() => window.location.href = '/verification'}
                >
                  <FaEye /> Verify Credential
                </button>
                <button 
                  className="action-button"
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
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ marginTop: '2rem' }}
        >
          <h2 className="heading-h2" style={{ marginBottom: '1.5rem' }}>Your Credentials</h2>
          
          {credentials.length > 0 ? (
            <div className="credentials-grid">
              {credentials.slice(0, 6).map((credential, index) => (
                <CredentialCard
                  key={credential.id}
                  credential={credential}
                  onView={handleViewCredential}
                  onShare={handleShareCredential}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card empty-state">
              <div className="empty-icon">
                <FaCertificate />
              </div>
              <h3 className="heading-h2" style={{ marginBottom: '1rem' }}>No Credentials Yet</h3>
              <p className="body-text" style={{ marginBottom: '1.5rem' }}>
                Start by submitting tasks to earn your first blockchain-verified credential!
              </p>
              <Button 
                variant="neumorphic" 
                size="lg"
                onClick={() => window.location.href = '/tasks'}
              >
                Submit Your First Task
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard