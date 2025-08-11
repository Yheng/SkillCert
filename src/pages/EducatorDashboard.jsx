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
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredStudents, setFilteredStudents] = useState([])
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false)
  const [showEditTaskModal, setShowEditTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [editTask, setEditTask] = useState({
    title: '',
    description: '',
    skill: '',
    difficulty: 'beginner',
    deadline: '',
    requirements: '',
    resources: []
  })

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

  // Calculate student statistics from submissions data
  const calculateStudentStats = (student) => {
    const studentSubmissions = submissions.filter(sub => 
      sub.student_email === student.email || sub.student_name === student.name
    )
    
    const completedTasks = studentSubmissions.filter(sub => sub.status === 'approved').length
    const earnedCredentials = studentSubmissions.filter(sub => sub.status === 'approved' && sub.blockchain_id).length
    const totalSubmissions = studentSubmissions.length
    
    // Calculate average score if available
    const scoresWithValues = studentSubmissions
      .filter(sub => sub.score && sub.score > 0)
      .map(sub => sub.score)
    const averageScore = scoresWithValues.length > 0 
      ? Math.round(scoresWithValues.reduce((a, b) => a + b, 0) / scoresWithValues.length)
      : 0
    
    return {
      ...student,
      completed_tasks: completedTasks,
      earned_credentials: earnedCredentials,
      average_score: averageScore,
      total_submissions: totalSubmissions
    }
  }

  // Filter students based on search query
  useEffect(() => {
    const studentsWithStats = students.map(calculateStudentStats)
    
    if (!searchQuery.trim()) {
      setFilteredStudents(studentsWithStats)
    } else {
      const filtered = studentsWithStats.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredStudents(filtered)
    }
  }, [students, searchQuery, submissions])

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
      console.log('Creating task with data:', newTask)
      const result = await backendService.createTask(newTask)
      console.log('Create task result:', result)
      
      if (result.success) {
        // Ensure the new task has all required fields
        const taskToAdd = {
          ...result.task,
          id: result.task.id || Date.now(), // Fallback ID
          title: result.task.title || newTask.title,
          description: result.task.description || newTask.description,
          skill: result.task.skill || newTask.skill,
          difficulty: result.task.difficulty || newTask.difficulty || 'beginner',
          deadline: result.task.deadline || newTask.deadline
        }
        
        console.log('Adding task to state:', taskToAdd)
        setTasks(prevTasks => [taskToAdd, ...prevTasks])
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
        console.log('Task created successfully')
      } else {
        console.error('Task creation failed:', result.error)
        alert(`Failed to create task: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to create task:', error)
      alert(`Failed to create task: ${error.message}`)
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

  const handleViewProfile = (student) => {
    setSelectedStudent(student)
    setShowStudentModal(true)
  }

  const handleViewTaskDetails = (task) => {
    setSelectedTask(task)
    setShowTaskDetailModal(true)
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setEditTask({
      title: task.title || '',
      description: task.description || '',
      skill: task.skill || '',
      difficulty: task.difficulty || 'beginner',
      deadline: task.deadline || '',
      requirements: task.requirements || '',
      resources: task.resources || []
    })
    setShowEditTaskModal(true)
  }

  const handleUpdateTask = async (e) => {
    e.preventDefault()
    try {
      console.log('Updating task:', selectedTask.id, 'with data:', editTask)
      const result = await backendService.updateTask(selectedTask.id, editTask)
      console.log('Update task result:', result)
      
      if (result.success) {
        // Update the task in the tasks array
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === selectedTask.id 
              ? { ...task, ...editTask }
              : task
          )
        )
        setShowEditTaskModal(false)
        setSelectedTask(null)
        console.log('Task updated successfully')
      } else {
        console.error('Task update failed:', result.error)
        alert(`Failed to update task: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to update task:', error)
      alert(`Failed to update task: ${error.message}`)
    }
  }

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="stat-card-content">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
        {trend && (
          <div className="stat-description" style={{ color: 'var(--success)' }}>
            ↗ {trend}% this month
          </div>
        )}
      </div>
      <animated.div className="stat-icon" style={{ 
        ...floatAnimation,
        background: `linear-gradient(45deg, ${color || 'var(--brand-primary)'}, ${color || 'var(--brand-secondary)'})` 
      }}>
        <Icon />
      </animated.div>
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
        <nav className="tab-navigation" role="tablist" aria-label="Dashboard navigation">
          {[
            { id: 'overview', label: 'Overview', icon: FaChartLine },
            { id: 'tasks', label: 'My Tasks', icon: FaTasks },
            { id: 'submissions', label: 'Submissions', icon: FaEye },
            { id: 'students', label: 'Students', icon: FaUsers }
          ].map(tab => (
            <motion.button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              id={`${tab.id}-tab`}
            >
              <tab.icon className="tab-icon" aria-hidden="true" />
              <span className="tab-label">{tab.label}</span>
            </motion.button>
          ))}
        </nav>

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
              className="quick-actions-section"
            >
              <h2 className="heading-h2">Quick Actions</h2>
              <div className="quick-actions-grid">
                <motion.button
                  className="quick-action-button btn-primary"
                  onClick={() => setShowTaskModal(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPlus className="quick-action-icon" /> Create New Task
                </motion.button>
                <motion.button
                  className="quick-action-button"
                  onClick={() => setActiveTab('submissions')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaEye className="quick-action-icon" /> Review Submissions
                </motion.button>
                <motion.button
                  className="quick-action-button"
                  onClick={() => setActiveTab('students')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaUsers className="quick-action-icon" /> Manage Students
                </motion.button>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="recent-activity-section"
            >
              <h2 className="heading-h2">Recent Activity</h2>
              {submissions.length > 0 ? (
                <div>
                  {submissions.slice(0, 5).map((submission, index) => (
                    <div key={submission.id} className="activity-item">
                      <div className="activity-content">
                        <div className={`activity-indicator ${submission.status === 'pending' ? 'pending' : 'completed'}`} />
                        <div className="activity-text">
                          <div className="activity-title">
                            {submission.student_name} submitted {submission.skill}
                          </div>
                          <div className="activity-meta">
                            {new Date(submission.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className={`activity-status ${submission.status}`}>
                        {submission.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-illustration">
                    <FaChartLine />
                  </div>
                  <div className="empty-state-title">No Recent Activity</div>
                  <div className="empty-state-description">
                    Student submissions and completed tasks will appear here
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="heading-h2">My Tasks</h2>
              <motion.button
                className="btn btn-primary"
                onClick={() => setShowTaskModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaPlus /> Create Task
              </motion.button>
            </div>

            <div className="tasks-grid">
              {tasks.length > 0 ? (
                tasks.map((task, index) => {
                  // Safe date formatting
                  const formatDeadline = (deadline) => {
                    if (!deadline) return 'No deadline set'
                    try {
                      const date = new Date(deadline)
                      return date.toString() !== 'Invalid Date' ? date.toLocaleDateString() : 'Invalid date'
                    } catch (error) {
                      console.warn('Invalid deadline format:', deadline)
                      return 'Invalid date'
                    }
                  }

                  return (
                    <motion.div
                      key={task.id || `task-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="task-card"
                    >
                      <div className="task-header">
                        <h3 className="task-title">{task.title || 'Untitled Task'}</h3>
                        <div style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          color: task.difficulty === 'beginner' ? 'var(--success)' : 
                                 task.difficulty === 'intermediate' ? 'var(--warning)' : 'var(--error)',
                          border: `1px solid ${task.difficulty === 'beginner' ? 'var(--success)' : 
                                                task.difficulty === 'intermediate' ? 'var(--warning)' : 'var(--error)'}`
                        }}>
                          {(task.difficulty || 'beginner').toUpperCase()}
                        </div>
                      </div>
                      
                      <p className="task-description">{task.description || 'No description provided'}</p>
                      
                      <div className="task-meta">
                        <div className="task-skill">
                          <FaCertificate /> {task.skill || 'No skill specified'}
                        </div>
                        <div className="task-deadline">
                          <FaClock /> {formatDeadline(task.deadline)}
                        </div>
                      </div>
                      
                      <div className="task-actions">
                        <button 
                          className="action-button"
                          onClick={() => handleViewTaskDetails(task)}
                        >
                          <FaEye /> View Details
                        </button>
                        <button 
                          className="action-button"
                          onClick={() => handleEditTask(task)}
                        >
                          <FaEdit /> Edit
                        </button>
                      </div>
                    </motion.div>
                  )
                })
              ) : (
                <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                  <div className="empty-state-illustration">
                    <FaTasks />
                  </div>
                  <div className="empty-state-title">No Tasks Yet</div>
                  <div className="empty-state-description">
                    Create your first task to get started with skill certification
                  </div>
                  <button 
                    className="empty-state-action"
                    onClick={() => setShowTaskModal(true)}
                  >
                    <FaPlus /> Create Task
                  </button>
                </div>
              )}
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
                        className="btn btn-secondary"
                        onClick={() => {
                          setSelectedSubmission(submission)
                          setShowSubmissionModal(true)
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <FaEye /> Review
                      </button>
                      <button
                        className="btn btn-primary"
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      // Search is already happening via useEffect, just blur input
                      e.target.blur()
                    }
                  }}
                />
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    // Focus on input for better UX
                    const searchInput = document.querySelector('input[placeholder="Search students..."]')
                    if (searchInput) searchInput.focus()
                  }}
                >
                  <FaSearch />
                </button>
              </div>
            </div>

            <div className="students-grid">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
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
                  
                  <button 
                    className="action-button" 
                    style={{ width: '100%' }}
                    onClick={() => handleViewProfile(student)}
                  >
                    <FaEye /> View Profile
                  </button>
                </motion.div>
              ))
              ) : (
                <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                  <div className="empty-state-illustration">
                    <FaUsers />
                  </div>
                  <div className="empty-state-title">
                    {searchQuery ? 'No Students Found' : 'No Students Yet'}
                  </div>
                  <div className="empty-state-description">
                    {searchQuery 
                      ? `No students found matching "${searchQuery}". Try a different search term.`
                      : 'Students who enroll in your tasks will appear here.'
                    }
                  </div>
                  {searchQuery && (
                    <button 
                      className="empty-state-action"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
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
                    className="btn btn-secondary"
                    onClick={() => setShowTaskModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
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
                          className="btn btn-secondary"
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
                    className="btn btn-primary"
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

        {/* Student Profile Modal */}
        {showStudentModal && selectedStudent && (
          <div className="modal-overlay" onClick={() => setShowStudentModal(false)}>
            <motion.div
              className="modal-content student-profile-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="modal-header">
                <div className="student-profile-header">
                  <div className="student-avatar">
                    {selectedStudent.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="student-header-info">
                    <h2 className="student-name">{selectedStudent.name}</h2>
                    <p className="student-email">{selectedStudent.email}</p>
                  </div>
                </div>
                <button 
                  className="modal-close"
                  onClick={() => setShowStudentModal(false)}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="modal-body student-profile-body">
                {/* Statistics Cards */}
                <div className="student-stats-grid">
                  <div className="student-stat-card">
                    <div className="student-stat-icon completed">
                      <FaTasks />
                    </div>
                    <div className="student-stat-content">
                      <div className="student-stat-value">{selectedStudent.completed_tasks || 0}</div>
                      <div className="student-stat-label">Completed Tasks</div>
                    </div>
                  </div>
                  
                  <div className="student-stat-card">
                    <div className="student-stat-icon credentials">
                      <FaCertificate />
                    </div>
                    <div className="student-stat-content">
                      <div className="student-stat-value">{selectedStudent.earned_credentials || 0}</div>
                      <div className="student-stat-label">Earned Credentials</div>
                    </div>
                  </div>
                  
                  <div className="student-stat-card">
                    <div className="student-stat-icon score">
                      <FaStar />
                    </div>
                    <div className="student-stat-content">
                      <div className="student-stat-value">{selectedStudent.average_score || 0}%</div>
                      <div className="student-stat-label">Average Score</div>
                    </div>
                  </div>
                  
                  <div className="student-stat-card">
                    <div className="student-stat-icon submissions">
                      <FaEye />
                    </div>
                    <div className="student-stat-content">
                      <div className="student-stat-value">{selectedStudent.total_submissions || 0}</div>
                      <div className="student-stat-label">Total Submissions</div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="student-activity-section">
                  <h3 className="section-title">Recent Activity</h3>
                  <div className="student-activity-list">
                    {submissions
                      .filter(sub => sub.student_email === selectedStudent.email || sub.student_name === selectedStudent.name)
                      .slice(0, 5)
                      .map((submission, index) => (
                        <div key={submission.id} className="student-activity-item">
                          <div className={`activity-status-dot ${submission.status}`}></div>
                          <div className="activity-details">
                            <div className="activity-title">{submission.task_title}</div>
                            <div className="activity-subtitle">
                              {submission.skill} • {new Date(submission.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className={`activity-badge ${submission.status}`}>
                            {submission.status === 'approved' ? <FaCheck /> : 
                             submission.status === 'rejected' ? <FaTimes /> : <FaClock />}
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </div>
                        </div>
                      ))}
                    {submissions.filter(sub => sub.student_email === selectedStudent.email || sub.student_name === selectedStudent.name).length === 0 && (
                      <div className="no-activity">
                        <FaBookOpen style={{ fontSize: '2rem', color: 'var(--text-tertiary)', marginBottom: '1rem' }} />
                        <p>No activity yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowStudentModal(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    // TODO: Implement send message functionality
                    alert('Message functionality coming soon!')
                  }}
                >
                  <FaUser /> Send Message
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Task Detail Modal */}
        {showTaskDetailModal && selectedTask && (
          <div className="modal-overlay" onClick={() => setShowTaskDetailModal(false)}>
            <motion.div
              className="modal-content task-detail-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="modal-header">
                <div className="task-detail-header">
                  <div className="task-icon">
                    <FaTasks />
                  </div>
                  <div className="task-header-info">
                    <h2 className="task-name">{selectedTask.title}</h2>
                    <p className="task-skill">{selectedTask.skill}</p>
                  </div>
                </div>
                <button 
                  className="modal-close"
                  onClick={() => setShowTaskDetailModal(false)}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="modal-body task-detail-body">
                {/* Task Information */}
                <div className="task-info-grid">
                  <div className="task-info-item">
                    <label className="task-info-label">
                      <FaCertificate /> Skill
                    </label>
                    <div className="task-info-value">{selectedTask.skill || 'Not specified'}</div>
                  </div>
                  
                  <div className="task-info-item">
                    <label className="task-info-label">
                      <FaGraduationCap /> Difficulty
                    </label>
                    <div className={`task-difficulty-badge ${selectedTask.difficulty}`}>
                      {(selectedTask.difficulty || 'beginner').toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="task-info-item">
                    <label className="task-info-label">
                      <FaClock /> Deadline
                    </label>
                    <div className="task-info-value">
                      {selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString() : 'No deadline set'}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="task-section">
                  <h3 className="task-section-title">
                    <FaBookOpen /> Description
                  </h3>
                  <div className="task-section-content">
                    {selectedTask.description || 'No description provided'}
                  </div>
                </div>

                {/* Requirements */}
                {selectedTask.requirements && (
                  <div className="task-section">
                    <h3 className="task-section-title">
                      <FaCheck /> Requirements
                    </h3>
                    <div className="task-section-content">
                      {selectedTask.requirements}
                    </div>
                  </div>
                )}

                {/* Task Statistics */}
                <div className="task-section">
                  <h3 className="task-section-title">
                    <FaChartLine /> Task Statistics
                  </h3>
                  <div className="task-stats-grid">
                    <div className="task-stat-item">
                      <div className="task-stat-value">
                        {submissions.filter(s => s.task_title === selectedTask.title).length}
                      </div>
                      <div className="task-stat-label">Total Submissions</div>
                    </div>
                    <div className="task-stat-item">
                      <div className="task-stat-value">
                        {submissions.filter(s => s.task_title === selectedTask.title && s.status === 'pending').length}
                      </div>
                      <div className="task-stat-label">Pending Review</div>
                    </div>
                    <div className="task-stat-item">
                      <div className="task-stat-value">
                        {submissions.filter(s => s.task_title === selectedTask.title && s.status === 'approved').length}
                      </div>
                      <div className="task-stat-label">Approved</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowTaskDetailModal(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowTaskDetailModal(false)
                    handleEditTask(selectedTask)
                  }}
                >
                  <FaEdit /> Edit Task
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Task Modal */}
        {showEditTaskModal && selectedTask && (
          <div className="modal-overlay" onClick={() => setShowEditTaskModal(false)}>
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="modal-header">
                <h2>Edit Task</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowEditTaskModal(false)}
                >
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleUpdateTask} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editTask.title}
                    onChange={(e) => setEditTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Skill</label>
                  <select
                    className="form-input"
                    value={editTask.skill}
                    onChange={(e) => setEditTask(prev => ({ ...prev, skill: e.target.value }))}
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
                    value={editTask.description}
                    onChange={(e) => setEditTask(prev => ({ ...prev, description: e.target.value }))}
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
                      value={editTask.difficulty}
                      onChange={(e) => setEditTask(prev => ({ ...prev, difficulty: e.target.value }))}
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
                      value={editTask.deadline}
                      onChange={(e) => setEditTask(prev => ({ ...prev, deadline: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Requirements</label>
                  <textarea
                    className="form-textarea"
                    value={editTask.requirements}
                    onChange={(e) => setEditTask(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="List specific requirements for completion"
                    rows="3"
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditTaskModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Update Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EducatorDashboard