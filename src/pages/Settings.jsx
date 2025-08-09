import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FaUser,
  FaEnvelope,
  FaLock,
  FaBell,
  FaShieldAlt,
  FaPalette,
  FaGlobe,
  FaDownload,
  FaTrash,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaCog
} from 'react-icons/fa'
import backendService from '../api/backend'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    primarySkill: '',
    bio: '',
    location: '',
    website: '',
    linkedin: '',
    github: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    credentialUpdates: true,
    taskReminders: true,
    publicProfile: false,
    showEmail: false,
    theme: 'dark'
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const result = await backendService.getProfile()
      if (result.success && result.user) {
        setUser(result.user)
        setFormData({
          name: result.user.name || '',
          email: result.user.email || '',
          primarySkill: result.user.primary_skill || '',
          bio: result.user.bio || '',
          location: result.user.location || '',
          website: result.user.website || '',
          linkedin: result.user.linkedin || '',
          github: result.user.github || ''
        })
        // Load preferences from user data or defaults
        setPreferences({
          ...preferences,
          ...result.user.preferences
        })
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  }

  const handleInputChange = (e, section = 'profile') => {
    const { name, value, type, checked } = e.target
    const actualValue = type === 'checkbox' ? checked : value

    if (section === 'profile') {
      setFormData(prev => ({ ...prev, [name]: actualValue }))
    } else if (section === 'password') {
      setPasswordData(prev => ({ ...prev, [name]: actualValue }))
    } else if (section === 'preferences') {
      setPreferences(prev => ({ ...prev, [name]: actualValue }))
    }

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateProfileForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = () => {
    const newErrors = {}
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateProfileForm()) return
    
    try {
      setLoading(true)
      setErrors({})
      setSuccessMessage('')
      
      const result = await backendService.updateProfile(formData)
      
      if (result.success) {
        setSuccessMessage('Profile updated successfully!')
        setUser({ ...user, ...formData })
      } else {
        setErrors({ submit: result.error || 'Failed to update profile' })
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (!validatePasswordForm()) return
    
    try {
      setLoading(true)
      setErrors({})
      setSuccessMessage('')
      
      const result = await backendService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      
      if (result.success) {
        setSuccessMessage('Password updated successfully!')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setErrors({ submit: result.error || 'Failed to update password' })
      }
    } catch (error) {
      console.error('Password update error:', error)
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setErrors({})
      setSuccessMessage('')
      
      const result = await backendService.updatePreferences(preferences)
      
      if (result.success) {
        setSuccessMessage('Preferences updated successfully!')
      } else {
        setErrors({ submit: result.error || 'Failed to update preferences' })
      }
    } catch (error) {
      console.error('Preferences update error:', error)
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const exportUserData = async () => {
    try {
      const result = await backendService.exportUserData()
      if (result.success) {
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `skillcert-data-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
        setSuccessMessage('Data exported successfully!')
      }
    } catch (error) {
      console.error('Export error:', error)
      setErrors({ submit: 'Failed to export data' })
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'security', label: 'Security', icon: FaShieldAlt },
    { id: 'preferences', label: 'Preferences', icon: FaCog },
    { id: 'privacy', label: 'Privacy', icon: FaLock }
  ]

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
          <h1 className="heading-h1" style={{ marginBottom: '0.5rem' }}>
            Account Settings
          </h1>
          <p className="subheading">
            Manage your profile, security, and preferences
          </p>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '2rem',
              color: 'var(--green)',
              textAlign: 'center'
            }}
          >
            {successMessage}
          </motion.div>
        )}

        <div className="main-grid">
          {/* Tabs Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card"
            style={{ padding: '1.5rem', height: 'fit-content' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tabs.map(tab => (
                <motion.button
                  key={tab.id}
                  className={`action-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    justifyContent: 'flex-start',
                    background: activeTab === tab.id ? 'linear-gradient(45deg, var(--teal), var(--blue))' : 'rgba(31, 42, 68, 0.8)',
                    color: activeTab === tab.id ? 'white' : 'var(--teal)',
                    border: activeTab === tab.id ? 'none' : '2px solid var(--teal)'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon />
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-card"
            style={{ padding: '2rem' }}
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="heading-h2" style={{ marginBottom: '2rem' }}>Profile Information</h2>
                <form onSubmit={handleProfileSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">
                        <FaUser style={{ marginRight: '0.5rem' }} />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange(e, 'profile')}
                        className="form-input"
                        disabled={loading}
                      />
                      {errors.name && <div className="form-error">{errors.name}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <FaEnvelope style={{ marginRight: '0.5rem' }} />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange(e, 'profile')}
                        className="form-input"
                        disabled={loading}
                      />
                      {errors.email && <div className="form-error">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Primary Skill</label>
                      <select
                        name="primarySkill"
                        value={formData.primarySkill}
                        onChange={(e) => handleInputChange(e, 'profile')}
                        className="form-input"
                        disabled={loading}
                      >
                        <option value="">Select your primary skill</option>
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
                      <label className="form-label">
                        <FaGlobe style={{ marginRight: '0.5rem' }} />
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange(e, 'profile')}
                        className="form-input"
                        placeholder="City, Country"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange(e, 'profile')}
                      className="form-textarea"
                      placeholder="Tell others about yourself and your expertise..."
                      rows="4"
                      disabled={loading}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Website</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange(e, 'profile')}
                        className="form-input"
                        placeholder="https://yourwebsite.com"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">LinkedIn</label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={(e) => handleInputChange(e, 'profile')}
                        className="form-input"
                        placeholder="https://linkedin.com/in/username"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <motion.button
                      type="submit"
                      className="btn-primary"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.02 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      {loading ? (
                        <div className="spinner" style={{ width: '1rem', height: '1rem' }} />
                      ) : (
                        <FaSave />
                      )}
                      Save Changes
                    </motion.button>
                  </div>

                  {errors.submit && <div className="form-error" style={{ marginTop: '1rem' }}>{errors.submit}</div>}
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="heading-h2" style={{ marginBottom: '2rem' }}>Security Settings</h2>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="form-group">
                    <label className="form-label">
                      <FaLock style={{ marginRight: '0.5rem' }} />
                      Current Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={(e) => handleInputChange(e, 'password')}
                        className="form-input"
                        style={{ paddingRight: '3rem' }}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--light-gray)',
                          cursor: 'pointer'
                        }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.currentPassword && <div className="form-error">{errors.currentPassword}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) => handleInputChange(e, 'password')}
                      className="form-input"
                      placeholder="Enter new password (min 6 characters)"
                      disabled={loading}
                    />
                    {errors.newPassword && <div className="form-error">{errors.newPassword}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handleInputChange(e, 'password')}
                      className="form-input"
                      placeholder="Confirm new password"
                      disabled={loading}
                    />
                    {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <motion.button
                      type="submit"
                      className="btn-primary"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.02 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      {loading ? (
                        <div className="spinner" style={{ width: '1rem', height: '1rem' }} />
                      ) : (
                        <FaShieldAlt />
                      )}
                      Update Password
                    </motion.button>
                  </div>

                  {errors.submit && <div className="form-error" style={{ marginTop: '1rem' }}>{errors.submit}</div>}
                </form>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <h2 className="heading-h2" style={{ marginBottom: '2rem' }}>Notification Preferences</h2>
                <form onSubmit={handlePreferencesSubmit}>
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', icon: FaEnvelope, desc: 'Receive important updates via email' },
                      { key: 'credentialUpdates', label: 'Credential Updates', icon: FaBell, desc: 'Get notified when credentials are issued or verified' },
                      { key: 'taskReminders', label: 'Task Reminders', icon: FaBell, desc: 'Reminders about pending tasks and deadlines' },
                      { key: 'marketingEmails', label: 'Marketing Emails', icon: FaEnvelope, desc: 'Receive product updates and promotional content' }
                    ].map(pref => (
                      <div key={pref.key} style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                          <pref.icon style={{ color: 'var(--teal)', fontSize: '1.25rem' }} />
                          <div>
                            <div style={{ fontWeight: '500', color: 'white', marginBottom: '0.25rem' }}>
                              {pref.label}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--light-gray)', opacity: 0.8 }}>
                              {pref.desc}
                            </div>
                          </div>
                        </div>
                        <label style={{ 
                          position: 'relative',
                          display: 'inline-block',
                          width: '3rem',
                          height: '1.5rem'
                        }}>
                          <input
                            type="checkbox"
                            name={pref.key}
                            checked={preferences[pref.key]}
                            onChange={(e) => handleInputChange(e, 'preferences')}
                            style={{ opacity: 0, width: 0, height: 0 }}
                            disabled={loading}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: preferences[pref.key] ? 'var(--teal)' : '#374151',
                            transition: '0.4s',
                            borderRadius: '1.5rem',
                            '::before': {
                              position: 'absolute',
                              content: '',
                              height: '1.125rem',
                              width: '1.125rem',
                              left: preferences[pref.key] ? '1.375rem' : '0.1875rem',
                              bottom: '0.1875rem',
                              backgroundColor: 'white',
                              transition: '0.4s',
                              borderRadius: '50%'
                            }
                          }}>
                            <div style={{
                              position: 'absolute',
                              content: '',
                              height: '1.125rem',
                              width: '1.125rem',
                              left: preferences[pref.key] ? '1.375rem' : '0.1875rem',
                              bottom: '0.1875rem',
                              backgroundColor: 'white',
                              transition: '0.4s',
                              borderRadius: '50%'
                            }} />
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <motion.button
                      type="submit"
                      className="btn-primary"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.02 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      {loading ? (
                        <div className="spinner" style={{ width: '1rem', height: '1rem' }} />
                      ) : (
                        <FaSave />
                      )}
                      Save Preferences
                    </motion.button>
                  </div>

                  {errors.submit && <div className="form-error" style={{ marginTop: '1rem' }}>{errors.submit}</div>}
                </form>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div>
                <h2 className="heading-h2" style={{ marginBottom: '2rem' }}>Privacy & Data</h2>
                
                <div style={{ display: 'grid', gap: '2rem' }}>
                  {/* Public Profile Settings */}
                  <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <h3 className="stat-title" style={{ marginBottom: '1rem' }}>Public Profile</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ color: 'white', fontWeight: '500' }}>Make profile public</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--light-gray)', opacity: 0.8 }}>
                          Allow others to find and view your credentials
                        </div>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '3rem', height: '1.5rem' }}>
                        <input
                          type="checkbox"
                          name="publicProfile"
                          checked={preferences.publicProfile}
                          onChange={(e) => handleInputChange(e, 'preferences')}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: preferences.publicProfile ? 'var(--teal)' : '#374151',
                          transition: '0.4s',
                          borderRadius: '1.5rem'
                        }}>
                          <div style={{
                            position: 'absolute',
                            content: '',
                            height: '1.125rem',
                            width: '1.125rem',
                            left: preferences.publicProfile ? '1.375rem' : '0.1875rem',
                            bottom: '0.1875rem',
                            backgroundColor: 'white',
                            transition: '0.4s',
                            borderRadius: '50%'
                          }} />
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Data Export */}
                  <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <h3 className="stat-title" style={{ marginBottom: '1rem' }}>Data Export</h3>
                    <p className="body-text" style={{ marginBottom: '1.5rem' }}>
                      Download a copy of all your data including credentials, tasks, and profile information.
                    </p>
                    <motion.button
                      className="btn-secondary"
                      onClick={exportUserData}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <FaDownload />
                      Export My Data
                    </motion.button>
                  </div>

                  {/* Danger Zone */}
                  <div style={{
                    border: '1px solid #ef4444',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    background: 'rgba(239, 68, 68, 0.05)'
                  }}>
                    <h3 style={{ color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaTrash />
                      Danger Zone
                    </h3>
                    <p style={{ color: 'var(--light-gray)', marginBottom: '1.5rem' }}>
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <motion.button
                      style={{
                        background: '#ef4444',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      whileHover={{ backgroundColor: '#dc2626', scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (window.confirm('Are you absolutely sure? This action cannot be undone.')) {
                          console.log('Account deletion requested')
                          // Implement account deletion
                        }
                      }}
                    >
                      <FaTrash />
                      Delete Account
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Settings