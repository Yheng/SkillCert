import * as React from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { GlassCard } from "../components/shared/GlassCard"
import { NeumorphicButton } from "../components/shared/NeumorphicButton"
import { AuroraToast } from "../components/shared/AuroraToast"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"
import { 
  FaUpload, 
  FaFile,
  FaCode,
  FaPalette,
  FaBrain,
  FaRocket,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaShieldAlt,
  FaExclamationTriangle,
  FaEthereum,
  FaCalendarAlt,
  FaPlus,
  FaTasks
} from "react-icons/fa"
import backendService from "../api/backend"
import blockchainService from "../api/blockchain"

const FileUpload = ({ onFileChange, file, error }) => {
  const fileInputRef = React.useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      onFileChange(files[0])
    }
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      onFileChange(files[0])
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="form-field">
      <div className="form-field-label">
        <FaFile />
        Project Files (Optional)
      </div>
      <motion.div
        className={`file-upload-area ${file ? 'has-file' : ''} ${error ? 'error' : ''}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.txt,.md,.js,.jsx,.ts,.tsx,.py,.html,.css,.json,.zip,.jpg,.jpeg,.png,.gif"
          className="hidden"
        />
        
        {file ? (
          <div className="file-upload-content">
            <FaFile className="file-upload-icon uploaded" />
            <div className="file-upload-info">
              <div className="file-name">{file.name}</div>
              <div className="file-size">{formatFileSize(file.size)}</div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={(e) => {
                e.stopPropagation()
                onFileChange(null)
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="file-upload-content">
            <FaUpload className="file-upload-icon" />
            <div className="file-upload-info">
              <div className="file-upload-title">Drop files here or click to browse</div>
              <div className="file-upload-description">
                Supports: PDF, DOC, images, code files, archives (max 10MB)
              </div>
            </div>
          </div>
        )}
      </motion.div>
      {error && <div className="form-validation error">{error}</div>}
    </div>
  )
}

const SkillSuggestion = ({ icon: Icon, skill, description, color, onClick, isSelected }) => (
  <motion.button
    type="button"
    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left w-full ${
      isSelected 
        ? 'border-skill-teal bg-skill-teal/20' 
        : 'border-white/20 hover:border-skill-teal hover:bg-white/5'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onClick(skill)}
  >
    <div className="flex items-start space-x-3">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="text-white text-lg" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-white">{skill}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  </motion.button>
)

const TaskCard = ({ task, onStatusUpdate, walletConnected }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FaCheckCircle className="text-skill-green" />
      case 'pending': return <FaClock className="text-skill-blue" />
      case 'rejected': return <FaTimes className="text-red-500" />
      default: return <FaClock className="text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-skill-green'
      case 'pending': return 'text-skill-blue'
      case 'rejected': return 'text-red-500'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="card" style={{ transition: 'transform 0.3s ease' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{task.title}</h3>
          <p className="text-gray-300 mb-2">{task.description}</p>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Skill: {task.skill}</span>
            <span>•</span>
            <span>{new Date(task.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(task.status)}
          <span className={`font-medium capitalize ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>
      </div>
      
      <div style={{ marginTop: 'var(--space-lg)', display: 'flex', gap: 'var(--space-sm)' }}>
        {task.ipfs_hash && (
          <button 
            className="btn btn-sm btn-secondary"
            onClick={() => {
              window.open(`https://gateway.pinata.cloud/ipfs/${task.ipfs_hash}`, '_blank')
            }}
          >
            <FaFile /> View on IPFS
          </button>
        )}
        
        {task.blockchain_id && walletConnected && (
          <button 
            className="btn btn-sm btn-secondary"
            onClick={() => {
              AuroraToast.success(`Credential issued on blockchain: ${task.blockchain_id}`)
            }}
          >
            <FaEthereum /> View on Blockchain
          </button>
        )}
      </div>
    </div>
  )
}

const Tasks = () => {
  const [activeTab, setActiveTab] = React.useState('submit')
  const [file, setFile] = React.useState(null)
  const [tasks, setTasks] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [showConfetti, setShowConfetti] = React.useState(false)
  const [selectedSkill, setSelectedSkill] = React.useState('')
  const [walletConnected, setWalletConnected] = React.useState(false)
  const [walletAddress, setWalletAddress] = React.useState('')
  const [connectingWallet, setConnectingWallet] = React.useState(false)
  const { width, height } = useWindowSize()
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const skillSuggestions = [
    { icon: FaCode, skill: 'React Development', description: 'Build modern web applications', color: 'from-blue-500 to-cyan-500' },
    { icon: FaCode, skill: 'Python Programming', description: 'Backend development and data science', color: 'from-green-500 to-blue-500' },
    { icon: FaPalette, skill: 'UI/UX Design', description: 'Create beautiful user experiences', color: 'from-purple-500 to-pink-500' },
    { icon: FaBrain, skill: 'Machine Learning', description: 'AI and data analysis', color: 'from-orange-500 to-red-500' },
    { icon: FaRocket, skill: 'DevOps', description: 'Cloud infrastructure and deployment', color: 'from-teal-500 to-green-500' },
    { icon: FaCode, skill: 'Blockchain', description: 'Smart contracts and DApps', color: 'from-indigo-500 to-purple-500' },
  ]

  React.useEffect(() => {
    if (activeTab === 'history') {
      loadTasks()
    }
    checkWalletConnection()
  }, [activeTab])

  const checkWalletConnection = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setWalletConnected(true)
          setWalletAddress(accounts[0])
          // Try to connect to blockchain service
          await blockchainService.connectWallet()
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

  const loadTasks = async () => {
    try {
      setLoading(true)
      const result = await backendService.getUserTasks()
      if (result.success) {
        setTasks(result.tasks)
      } else {
        AuroraToast.error(result.error || 'Failed to load tasks')
      }
    } catch (error) {
      console.error('Load tasks error:', error)
      AuroraToast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      
      const taskData = {
        title: data.title,
        description: data.description,
        skill: selectedSkill || data.skill
      }

      const result = await backendService.submitTask(taskData, file)
      
      if (result.success) {
        setShowConfetti(true)
        AuroraToast.success('Task submitted successfully!', {
          title: 'Submission Complete'
        })
        
        reset()
        setFile(null)
        setSelectedSkill('')
        
        setTimeout(() => setShowConfetti(false), 3000)
        
        // Refresh tasks if on history tab
        if (activeTab === 'history') {
          loadTasks()
        }
      } else {
        AuroraToast.error(result.error || 'Failed to submit task')
      }
    } catch (error) {
      console.error('Task submission error:', error)
      AuroraToast.error('Failed to submit task')
    } finally {
      setLoading(false)
    }
  }

  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill)
    setValue('skill', skill)
  }

  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          colors={['#2DD4BF', '#3B82F6', '#8B5CF6', '#10B981']}
        />
      )}
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Task Management
          </h1>
          <p className="text-xl text-gray-300">
            Submit your work to earn blockchain-verified credentials
          </p>
        </motion.div>

        {/* Wallet Connection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="connection-card">
            <div className="connection-status">
              <div className={`connection-icon ${walletConnected ? 'connected' : 'disconnected'}`}>
                {walletConnected ? <FaShieldAlt /> : <FaExclamationTriangle />}
              </div>
              <div className="connection-info">
                <div className="connection-title">
                  {walletConnected ? 'Blockchain Connected' : 'Blockchain Connection'}
                </div>
                <div className="connection-description">
                  {walletConnected 
                    ? 'Your wallet is connected and ready for task verification'
                    : 'Connect wallet to enable blockchain credential verification'
                  }
                </div>
                {walletConnected && walletAddress && (
                  <div className="connection-address">
                    {walletAddress.substring(0, 8)}...{walletAddress.substring(34)}
                  </div>
                )}
              </div>
              
              {!walletConnected && (
                <button
                  className="btn btn-primary"
                  onClick={connectWallet}
                  disabled={connectingWallet}
                  style={{ minWidth: '160px' }}
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
          </div>
        </motion.div>

        {/* Enhanced Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="tab-navigation">
            <motion.button
              className={`tab-button ${activeTab === 'submit' ? 'active' : ''}`}
              onClick={() => setActiveTab('submit')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="tab-content">
                <FaPlus />
                Submit Task
              </div>
            </motion.button>
            <motion.button
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="tab-content">
                <FaTasks />
                Task History
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Submit Task Tab */}
        {activeTab === 'submit' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--space-2xl)', alignItems: 'start' }}
            className="max-lg:grid-cols-1"
          >
            {/* Task Form */}
            <div>
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Submit New Task</div>
                  <div className="card-subtitle">Share your project to earn blockchain-verified credentials</div>
                </div>
                
                <div className="card-body">
                  <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                  <div className="form-field">
                    <div className="form-field-label">
                      <FaFile />
                      Task Title *
                    </div>
                    <input
                      type="text"
                      id="title"
                      placeholder="e.g., React E-commerce Website"
                      {...register("title", { required: "Task title is required" })}
                      className={`form-field-input ${errors.title ? 'error' : ''}`}
                    />
                    {errors.title && (
                      <div className="form-validation error">
                        <FaTimes />
                        {errors.title.message}
                      </div>
                    )}
                  </div>

                  <div className="form-field">
                    <div className="form-field-label">
                      <FaCode />
                      Project Description
                    </div>
                    <textarea
                      id="description"
                      rows={4}
                      placeholder="Describe your project, technologies used, key features, and what makes it special..."
                      {...register("description")}
                      className="form-field-input"
                      style={{ 
                        resize: 'vertical', 
                        minHeight: '120px',
                        fontFamily: 'inherit'
                      }}
                    />
                    <div className="form-validation" style={{ color: 'var(--text-muted)' }}>
                      Provide details about your implementation, challenges solved, and technologies used
                    </div>
                  </div>

                  <div className="form-field">
                    <div className="form-field-label">
                      <FaBrain />
                      Skill Category *
                    </div>
                    <input
                      type="text"
                      id="skill"
                      placeholder="e.g., React Development"
                      value={selectedSkill}
                      {...register("skill", { required: "Skill is required" })}
                      className={`form-field-input ${errors.skill ? 'error' : selectedSkill ? 'success' : ''}`}
                      readOnly={!!selectedSkill}
                    />
                    {errors.skill && (
                      <div className="form-validation error">
                        <FaTimes />
                        {errors.skill.message}
                      </div>
                    )}
                    {selectedSkill && (
                      <div className="form-validation success">
                        <FaCheckCircle />
                        Selected: {selectedSkill}
                      </div>
                    )}
                    {!selectedSkill && (
                      <div className="form-validation" style={{ color: 'var(--text-muted)' }}>
                        Select a skill from the suggestions or type your own
                      </div>
                    )}
                  </div>

                  <FileUpload
                    onFileChange={setFile}
                    file={file}
                    error={null}
                  />

                  <motion.button
                    type="submit"
                    className="btn btn-primary btn-lg btn-full"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    style={{
                      marginTop: 'var(--space-xl)',
                      padding: 'var(--space-lg) var(--space-2xl)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-sm)'
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="spinner" />
                        Submitting Task...
                      </>
                    ) : (
                      <>
                        <FaRocket />
                        Submit Task for Review
                      </>
                    )}
                  </motion.button>
                  </form>
                </div>
              </div>
            </div>

            {/* Enhanced Skill Selection */}
            <div>
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Popular Skills</div>
                  <div className="card-subtitle">Select a skill category that matches your project</div>
                </div>
                <div className="card-body">
                  <div className="skill-grid">
                  {skillSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.skill}
                      className={`skill-card ${selectedSkill === suggestion.skill ? 'selected' : ''}`}
                      onClick={() => handleSkillSelect(suggestion.skill)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="skill-card-header">
                        <div 
                          className="skill-card-icon" 
                          style={{ background: `linear-gradient(135deg, ${suggestion.color})` }}
                        >
                          <suggestion.icon />
                        </div>
                        <div className="skill-card-badge">
                          ✓
                        </div>
                      </div>
                      <div className="skill-card-title">{suggestion.skill}</div>
                      <div className="skill-card-description">{suggestion.description}</div>
                    </motion.div>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Task History Tab */}
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gradient mb-6">Your Submitted Tasks</h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-skill-teal"></div>
              </div>
            ) : tasks.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="data-card"
                  >
                    <div className="data-card-header">
                      <div>
                        <div className="data-card-title">{task.title}</div>
                        <div className="data-card-meta">
                          <FaCode />
                          {task.skill}
                          <span>•</span>
                          <FaCalendarAlt />
                          {new Date(task.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`status-indicator ${
                        task.status === 'approved' ? 'status-verified' :
                        task.status === 'pending' ? 'status-pending' : 'status-disconnected'
                      }`}>
                        {task.status === 'approved' ? <FaCheckCircle size={12} /> :
                         task.status === 'pending' ? <FaClock size={12} /> : <FaTimes size={12} />}
                        {task.status}
                      </div>
                    </div>
                    
                    <div className="data-card-content">
                      <p style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: 'var(--text-sm)',
                        lineHeight: '1.6',
                        marginBottom: 'var(--space-lg)'
                      }}>
                        {task.description || 'No description provided'}
                      </p>
                      
                      {(task.ipfs_hash || task.blockchain_id) && (
                        <div style={{ 
                          display: 'flex', 
                          gap: 'var(--space-sm)',
                          flexWrap: 'wrap'
                        }}>
                          {task.ipfs_hash && (
                            <motion.button 
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                window.open(`https://gateway.pinata.cloud/ipfs/${task.ipfs_hash}`, '_blank')
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaFile /> View Files
                            </motion.button>
                          )}
                          
                          {task.blockchain_id && walletConnected && (
                            <motion.button 
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                AuroraToast.success(`Credential issued on blockchain: ${task.blockchain_id}`)
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaEthereum /> Blockchain
                            </motion.button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaRocket />
                </div>
                <h3 className="empty-title">No Tasks Yet</h3>
                <p className="empty-description">
                  Submit your first task to start earning credentials!
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setActiveTab('submit')}
                  style={{ marginTop: 'var(--space-lg)' }}
                >
                  <FaPlus />
                  Submit Your First Task
                </button>
              </div>
            )}
          </motion.div>
        )}
    </>
  )
}

export default Tasks