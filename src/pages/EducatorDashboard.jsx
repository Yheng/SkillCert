import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSpring, animated } from '@react-spring/web'
import { 
  FaPlus,
  FaTasks,
  FaUsers,
  FaUser,
  FaCertificate,
  FaEye,
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrash,
  FaUpload,
  FaDownload,
  FaClock,
  FaChartLine,
  FaGraduationCap,
  FaBookOpen,
  FaStar,
  FaFilter,
  FaSearch,
  FaFile,
  FaExternalLinkAlt,
  FaSpinner
} from 'react-icons/fa'
import backendService from '../api/backend'
import blockchainService from '../api/blockchain'

const EducatorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [tasks, setTasks] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [students, setStudents] = useState([])
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingSubmissions: 0,
    completedCredentials: 0,
    totalStudents: 0
  })
  const [loading, setLoading] = useState(true)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    skill: '',
    difficulty: 'beginner',
    deadline: '',
    requirements: '',
    resources: []
  })
  const [processingCredentials, setProcessingCredentials] = useState(new Set())

  // Animation for floating elements
  const floatAnimation = useSpring({
    from: { transform: 'translateY(0px)' },
    to: { transform: 'translateY(-5px)' },
    config: { duration: 3000 },
    loop: { reverse: true }
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [tasksResult, submissionsResult, studentsResult] = await Promise.all([
        backendService.getEducatorTasks(),
        backendService.getPendingSubmissions(),
        backendService.getEducatorStudents()
      ])

      if (tasksResult.success) setTasks(tasksResult.tasks || [])
      if (submissionsResult.success) setSubmissions(submissionsResult.submissions || [])
      if (studentsResult.success) setStudents(studentsResult.students || [])

      // Calculate stats
      setStats({
        totalTasks: tasksResult.tasks?.length || 0,
        pendingSubmissions: submissionsResult.submissions?.filter(s => s.status === 'pending').length || 0,
        completedCredentials: submissionsResult.submissions?.filter(s => s.status === 'approved').length || 0,
        totalStudents: studentsResult.students?.length || 0
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    try {
      const result = await backendService.createTask(newTask)
      if (result.success) {
        setTasks([result.task, ...tasks])
        setShowTaskModal(false)
        setNewTask({
          title: '',
          description: '',
          skill: '',
          difficulty: 'beginner',
          deadline: '',
          requirements: '',
          resources: []
        })
        setStats(prev => ({ ...prev, totalTasks: prev.totalTasks + 1 }))
      }
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleApproveSubmission = async (submission) => {
    try {
      setProcessingCredentials(prev => new Set([...prev, submission.id]))
      
      // First approve the submission in the backend
      const approvalResult = await backendService.approveSubmission(submission.id)
      if (!approvalResult.success) {
        throw new Error('Failed to approve submission')
      }

      // Issue blockchain credential
      const credentialResult = await blockchainService.issueCredential(
        submission.student_wallet || submission.student_email, // Use wallet or email as fallback
        submission.skill,
        submission.ipfs_hash || 'default-hash', // IPFS hash of proof files
        JSON.stringify({
          taskTitle: submission.task_title,
          studentName: submission.student_name,
          completionDate: new Date().toISOString(),
          educatorAddress: await blockchainService.getCurrentAddress()
        })
      )

      if (credentialResult.success) {
        // Update submission status
        setSubmissions(prev => 
          prev.map(s => 
            s.id === submission.id 
              ? { ...s, status: 'approved', blockchain_id: credentialResult.transactionHash }
              : s
          )
        )
        setStats(prev => ({
          ...prev,
          pendingSubmissions: prev.pendingSubmissions - 1,
          completedCredentials: prev.completedCredentials + 1
        }))
      } else {
        throw new Error(credentialResult.error || 'Failed to issue blockchain credential')
      }
    } catch (error) {
      console.error('Failed to approve submission:', error)
      alert(`Failed to approve submission: ${error.message}`)
    } finally {
      setProcessingCredentials(prev => {
        const newSet = new Set(prev)
        newSet.delete(submission.id)
        return newSet
      })
    }
  }

  const handleRejectSubmission = async (submission, feedback) => {
    try {
      const result = await backendService.rejectSubmission(submission.id, feedback)
      if (result.success) {
        setSubmissions(prev => 
          prev.map(s => 
            s.id === submission.id 
              ? { ...s, status: 'rejected', feedback }
              : s
          )
        )
        setStats(prev => ({ ...prev, pendingSubmissions: prev.pendingSubmissions - 1 }))
      }
    } catch (error) {
      console.error('Failed to reject submission:', error)
    }
  }

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <animated.div style={floatAnimation}>
        <div className="stat-icon" style={{ background: `linear-gradient(45deg, ${color || 'var(--teal)'}, ${color || 'var(--blue)'})` }}>
          <Icon />
        </div>
      </animated.div>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
      {trend && (
        <div className="stat-description" style={{ color: 'var(--green)' }}>
          ↗ {trend}% this month
        </div>
      )}
    </motion.div>
  )

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
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
        >
          <h1 className="heading-h1 gradient-text">
            Educator Dashboard
          </h1>
          <p className="subheading">
            Create tasks, review submissions, and issue blockchain-verified credentials
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { id: 'overview', label: 'Overview', icon: FaChartLine },
            { id: 'tasks', label: 'My Tasks', icon: FaTasks },
            { id: 'submissions', label: 'Submissions', icon: FaEye },
            { id: 'students', label: 'Students', icon: FaUsers }
          ].map(tab => (
            <motion.button
              key={tab.id}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white' 
                  : 'bg-gray-800/50 text-teal-400 border border-teal-500/30 hover:bg-gray-700/50'
              }`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon style={{ marginRight: '0.5rem' }} />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="stats-grid">
              <StatCard
                icon={FaTasks}
                title="Total Tasks"
                value={stats.totalTasks}
                color="var(--blue)"
                trend={12}
              />
              <StatCard
                icon={FaClock}
                title="Pending Reviews"
                value={stats.pendingSubmissions}
                color="var(--orange)"
              />
              <StatCard
                icon={FaCertificate}
                title="Credentials Issued"
                value={stats.completedCredentials}
                color="var(--green)"
                trend={8}
              />
              <StatCard
                icon={FaUsers}
                title="Active Students"
                value={stats.totalStudents}
                color="var(--purple)"
                trend={15}
              />
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl mb-6 sm:mb-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <motion.button
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-lg font-semibold flex items-center gap-3 transition-all duration-300 justify-center text-sm sm:text-base"
                  onClick={() => setShowTaskModal(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPlus /> Create New Task
                </motion.button>
                <motion.button
                  className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-lg font-semibold flex items-center gap-3 transition-all duration-300 border border-gray-600/30 hover:border-teal-500/50 justify-center text-sm sm:text-base"
                  onClick={() => setActiveTab('submissions')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaEye /> Review Submissions
                </motion.button>
                <motion.button
                  className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-lg font-semibold flex items-center gap-3 transition-all duration-300 border border-gray-600/30 hover:border-teal-500/50 justify-center text-sm sm:text-base col-span-1 sm:col-span-2 lg:col-span-1"
                  onClick={() => setActiveTab('students')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaUsers /> Manage Students
                </motion.button>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card"
              style={{ padding: '2rem' }}
            >
              <h2 className="heading-h2" style={{ marginBottom: '1.5rem' }}>Recent Activity</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {submissions.slice(0, 5).map((submission, index) => (
                  <div
                    key={submission.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: submission.status === 'pending' ? 'var(--orange)' : 'var(--green)'
                      }} />
                      <div>
                        <div style={{ fontWeight: '500', color: 'white' }}>
                          {submission.student_name} submitted {submission.skill}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--light-gray)', opacity: 0.8 }}>
                          {new Date(submission.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: submission.status === 'pending' ? 'var(--orange)' : 'var(--green)',
                      border: `1px solid ${submission.status === 'pending' ? 'var(--orange)' : 'var(--green)'}`
                    }}>
                      {submission.status.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="heading-h2">My Tasks</h2>
              <motion.button
                className="btn-primary"
                onClick={() => setShowTaskModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <FaPlus /> Create Task
              </motion.button>
            </div>

            <div className="tasks-grid">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="task-card"
                >
                  <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: task.difficulty === 'beginner' ? 'var(--green)' : 
                             task.difficulty === 'intermediate' ? 'var(--orange)' : 'var(--red)',
                      border: `1px solid ${task.difficulty === 'beginner' ? 'var(--green)' : 
                                            task.difficulty === 'intermediate' ? 'var(--orange)' : 'var(--red)'}`
                    }}>
                      {task.difficulty.toUpperCase()}
                    </div>
                  </div>
                  
                  <p className="task-description">{task.description}</p>
                  
                  <div className="task-meta">
                    <div className="task-skill">
                      <FaCertificate /> {task.skill}
                    </div>
                    <div className="task-deadline">
                      <FaClock /> {new Date(task.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="task-actions">
                    <button className="action-button">
                      <FaEye /> View Details
                    </button>
                    <button className="action-button">
                      <FaEdit /> Edit
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="heading-h2">Submissions to Review</h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <select
                  className="form-input"
                  style={{ width: 'auto' }}
                  onChange={(e) => {
                    // Filter submissions by status
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="submissions-grid">
              {submissions.map((submission, index) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="submission-card"
                >
                  <div className="submission-header">
                    <div className="submission-info">
                      <h3 className="submission-title">{submission.task_title}</h3>
                      <p className="submission-student">
                        <FaUser style={{ marginRight: '0.5rem' }} />
                        {submission.student_name}
                      </p>
                      <p className="submission-skill">
                        <FaCertificate style={{ marginRight: '0.5rem' }} />
                        {submission.skill}
                      </p>
                      <p className="submission-date">
                        <FaClock style={{ marginRight: '0.5rem' }} />
                        Submitted {new Date(submission.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: submission.status === 'pending' ? 'var(--orange)' : 
                             submission.status === 'approved' ? 'var(--green)' : 'var(--red)',
                      border: `1px solid ${submission.status === 'pending' ? 'var(--orange)' : 
                                            submission.status === 'approved' ? 'var(--green)' : 'var(--red)'}`
                    }}>
                      {submission.status.toUpperCase()}
                    </div>
                  </div>

                  {submission.description && (
                    <p className="submission-description">{submission.description}</p>
                  )}

                  {submission.status === 'pending' ? (
                    <div className="submission-actions">
                      <button
                        className="btn-secondary"
                        onClick={() => {
                          setSelectedSubmission(submission)
                          setShowSubmissionModal(true)
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <FaEye /> Review
                      </button>
                      <button
                        className="btn-primary"
                        onClick={() => handleApproveSubmission(submission)}
                        disabled={processingCredentials.has(submission.id)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          opacity: processingCredentials.has(submission.id) ? 0.7 : 1
                        }}
                      >
                        {processingCredentials.has(submission.id) ? (
                          <>
                            <FaSpinner className="spinner" /> Processing...
                          </>
                        ) : (
                          <>
                            <FaCheck /> Approve & Issue Credential
                          </>
                        )}
                      </button>
                      <button
                        className="action-button"
                        onClick={() => handleRejectSubmission(submission, 'Needs improvement')}
                        style={{ color: 'var(--red)', borderColor: 'var(--red)' }}
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  ) : (
                    <div className="submission-actions">
                      {submission.blockchain_id && (
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--green)', 
                          fontFamily: 'monospace' 
                        }}>
                          Blockchain: {submission.blockchain_id.substring(0, 20)}...
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="heading-h2">My Students</h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Search students..."
                  className="form-input"
                  style={{ width: '200px' }}
                />
                <button className="btn-secondary">
                  <FaSearch />
                </button>
              </div>
            </div>

            <div className="students-grid">
              {students.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass-card"
                  style={{ padding: '1.5rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, var(--teal), var(--blue))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.25rem'
                    }}>
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="stat-title" style={{ marginBottom: '0.25rem' }}>{student.name}</h3>
                      <p className="body-text" style={{ fontSize: '0.875rem' }}>{student.email}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div className="stat-value" style={{ fontSize: '1.5rem' }}>
                        {student.completed_tasks || 0}
                      </div>
                      <div className="body-text" style={{ fontSize: '0.75rem' }}>Tasks</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div className="stat-value" style={{ fontSize: '1.5rem' }}>
                        {student.earned_credentials || 0}
                      </div>
                      <div className="body-text" style={{ fontSize: '0.75rem' }}>Credentials</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div className="stat-value" style={{ fontSize: '1.5rem' }}>
                        {student.average_score || 0}%
                      </div>
                      <div className="body-text" style={{ fontSize: '0.75rem' }}>Avg Score</div>
                    </div>
                  </div>
                  
                  <button className="action-button" style={{ width: '100%' }}>
                    <FaEye /> View Profile
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Task Creation Modal */}
        {showTaskModal && (
          <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="modal-header">
                <h2>Create New Task</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowTaskModal(false)}
                >
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleCreateTask} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Skill</label>
                  <select
                    className="form-input"
                    value={newTask.skill}
                    onChange={(e) => setNewTask(prev => ({ ...prev, skill: e.target.value }))}
                    required
                  >
                    <option value="">Select skill to certify</option>
                    <option value="React Development">React Development</option>
                    <option value="Python Programming">Python Programming</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Blockchain">Blockchain Development</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what students need to accomplish"
                    rows="4"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Difficulty</label>
                    <select
                      className="form-input"
                      value={newTask.difficulty}
                      onChange={(e) => setNewTask(prev => ({ ...prev, difficulty: e.target.value }))}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Deadline</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask(prev => ({ ...prev, deadline: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Requirements</label>
                  <textarea
                    className="form-textarea"
                    value={newTask.requirements}
                    onChange={(e) => setNewTask(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="List specific requirements for completion"
                    rows="3"
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowTaskModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Submission Review Modal */}
        {showSubmissionModal && selectedSubmission && (
          <div className="modal-overlay" onClick={() => setShowSubmissionModal(false)}>
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ maxWidth: '800px' }}
            >
              <div className="modal-header">
                <h2>Review Submission</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowSubmissionModal(false)}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--teal)' }}>Task Details</h3>
                    <div className="form-group">
                      <label className="form-label">Task</label>
                      <div style={{ color: 'white', fontWeight: '500' }}>{selectedSubmission.task_title}</div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Skill</label>
                      <div style={{ color: 'white', fontWeight: '500' }}>{selectedSubmission.skill}</div>
                    </div>
                  </div>
                  <div>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--blue)' }}>Student Info</h3>
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <div style={{ color: 'white', fontWeight: '500' }}>{selectedSubmission.student_name}</div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Submitted</label>
                      <div style={{ color: 'white', fontWeight: '500' }}>
                        {new Date(selectedSubmission.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedSubmission.description && (
                  <div className="form-group">
                    <label className="form-label">Student Description</label>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '1rem',
                      borderRadius: '8px',
                      color: 'white'
                    }}>
                      {selectedSubmission.description}
                    </div>
                  </div>
                )}

                {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                  <div className="form-group">
                    <label className="form-label">Submitted Files</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {selectedSubmission.files.map((file, index) => (
                        <button
                          key={index}
                          className="btn-secondary"
                          style={{ 
                            justifyContent: 'flex-start',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <FaFile /> {file.name}
                          <FaExternalLinkAlt style={{ marginLeft: 'auto', fontSize: '0.875rem' }} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    className="action-button"
                    onClick={() => {
                      handleRejectSubmission(selectedSubmission, 'Needs improvement')
                      setShowSubmissionModal(false)
                    }}
                    style={{ color: 'var(--red)', borderColor: 'var(--red)' }}
                  >
                    <FaTimes /> Reject
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      handleApproveSubmission(selectedSubmission)
                      setShowSubmissionModal(false)
                    }}
                    disabled={processingCredentials.has(selectedSubmission.id)}
                  >
                    {processingCredentials.has(selectedSubmission.id) ? (
                      <>
                        <FaSpinner className="spinner" /> Processing...
                      </>
                    ) : (
                      <>
                        <FaCheck /> Approve & Issue Credential
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EducatorDashboard