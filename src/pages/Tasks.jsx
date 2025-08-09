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
  FaEthereum
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
    <div className="space-y-4">
      <Label>Project Files (Optional)</Label>
      <motion.div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
          file ? 'border-skill-teal bg-skill-teal/10' : 'border-white/30 hover:border-skill-teal hover:bg-white/5'
        } ${error ? 'border-red-500' : ''}`}
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
          <div className="space-y-2">
            <FaFile className="text-4xl text-skill-teal mx-auto" />
            <div>
              <p className="text-white font-medium">{file.name}</p>
              <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onFileChange(null)
              }}
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <FaUpload className="text-4xl text-gray-400 mx-auto" />
            <div>
              <p className="text-white">Drop files here or click to browse</p>
              <p className="text-gray-400 text-sm">
                Supports: PDF, DOC, images, code files, archives (max 10MB)
              </p>
            </div>
          </div>
        )}
      </motion.div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
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
    <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
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
      
      <div className="mt-4 flex gap-2">
        {task.ipfs_hash && (
          <Button 
            size="sm" 
            variant="glass"
            onClick={() => {
              window.open(`https://gateway.pinata.cloud/ipfs/${task.ipfs_hash}`, '_blank')
            }}
          >
            <FaFile className="mr-2" /> View on IPFS
          </Button>
        )}
        
        {task.blockchain_id && walletConnected && (
          <Button 
            size="sm" 
            variant="glass"
            onClick={() => {
              AuroraToast.success(`Credential issued on blockchain: ${task.blockchain_id}`)
            }}
          >
            <FaEthereum className="mr-2" /> View on Blockchain
          </Button>
        )}
      </div>
    </GlassCard>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          colors={['#2DD4BF', '#3B82F6', '#8B5CF6', '#10B981']}
        />
      )}
      
      <div className="max-w-6xl mx-auto px-4">
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
          <GlassCard className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                  walletConnected ? 'bg-green-500' : 'bg-orange-500'
                }`}>
                  {walletConnected ? <FaShieldAlt /> : <FaExclamationTriangle />}
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">
                    Blockchain Connection
                  </div>
                  <div className="text-gray-400 text-sm">
                    {walletConnected 
                      ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
                      : 'Connect wallet to enable blockchain credential verification'
                    }
                  </div>
                </div>
              </div>
              
              {!walletConnected && (
                <NeumorphicButton
                  variant="primary"
                  onClick={connectWallet}
                  disabled={connectingWallet}
                >
                  {connectingWallet ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <FaShieldAlt className="mr-2" />
                      Connect MetaMask
                    </>
                  )}
                </NeumorphicButton>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex space-x-4">
            <NeumorphicButton
              variant={activeTab === 'submit' ? 'primary' : 'default'}
              onClick={() => setActiveTab('submit')}
            >
              Submit Task
            </NeumorphicButton>
            <NeumorphicButton
              variant={activeTab === 'history' ? 'primary' : 'default'}
              onClick={() => setActiveTab('history')}
            >
              Task History
            </NeumorphicButton>
          </div>
        </motion.div>

        {/* Submit Task Tab */}
        {activeTab === 'submit' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Task Form */}
            <div className="lg:col-span-2">
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold text-gradient mb-6">Submit New Task</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., React E-commerce Website"
                      {...register("title", { required: "Task title is required" })}
                      className="mt-1"
                    />
                    {errors.title && (
                      <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      rows={4}
                      placeholder="Describe your project, technologies used, and key features..."
                      {...register("description")}
                      className="mt-1 w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-skill-teal focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="skill">Skill Category</Label>
                    <Input
                      id="skill"
                      placeholder="e.g., React Development"
                      value={selectedSkill}
                      {...register("skill", { required: "Skill is required" })}
                      className="mt-1"
                    />
                    {errors.skill && (
                      <p className="text-red-400 text-sm mt-1">{errors.skill.message}</p>
                    )}
                  </div>

                  <FileUpload
                    onFileChange={setFile}
                    file={file}
                    error={null}
                  />

                  <NeumorphicButton
                    type="submit"
                    size="lg"
                    variant="primary"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Submitting...' : 'Submit Task'}
                  </NeumorphicButton>
                </form>
              </GlassCard>
            </div>

            {/* Skill Suggestions */}
            <div>
              <GlassCard className="p-6">
                <h3 className="text-xl font-bold text-gradient mb-4">Popular Skills</h3>
                <div className="space-y-3">
                  {skillSuggestions.map((suggestion, index) => (
                    <SkillSuggestion
                      key={suggestion.skill}
                      {...suggestion}
                      onClick={handleSkillSelect}
                      isSelected={selectedSkill === suggestion.skill}
                    />
                  ))}
                </div>
              </GlassCard>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusUpdate={() => loadTasks()}
                    walletConnected={walletConnected}
                  />
                ))}
              </div>
            ) : (
              <GlassCard className="p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-skill-teal to-skill-blue rounded-full flex items-center justify-center opacity-50">
                  <FaRocket className="text-4xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Tasks Yet</h3>
                <p className="text-gray-400 mb-6">
                  Submit your first task to start earning credentials!
                </p>
                <NeumorphicButton 
                  variant="primary"
                  onClick={() => setActiveTab('submit')}
                >
                  Submit Your First Task
                </NeumorphicButton>
              </GlassCard>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Tasks