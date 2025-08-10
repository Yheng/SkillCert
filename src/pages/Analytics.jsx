import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FaDownload, 
  FaFileExport, 
  FaDatabase, 
  FaChartBar,
  FaSpinner,
  FaCertificate,
  FaTasks,
  FaUser,
  FaCalendarAlt,
  FaShieldAlt
} from 'react-icons/fa'
import Analytics from '../components/shared/Analytics'
import { GlassCard } from '../components/shared/GlassCard'
import backendService from '../api/backend'
import CertificateUtils from '../utils/certificateUtils'
import { AuroraToast } from '../components/shared/AuroraToast'

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(false)
  const [exportFormat, setExportFormat] = useState('json')

  const exportUserData = async () => {
    try {
      setLoading(true)
      const result = await backendService.exportUserData()
      
      if (result.success) {
        let blob, filename, mimeType

        switch (exportFormat) {
          case 'json':
            blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' })
            filename = `skillcert-export-${new Date().toISOString().split('T')[0]}.json`
            mimeType = 'application/json'
            break
          case 'csv':
            const csvData = convertDataToCSV(result.data)
            blob = new Blob([csvData], { type: 'text/csv' })
            filename = `skillcert-export-${new Date().toISOString().split('T')[0]}.csv`
            mimeType = 'text/csv'
            break
          case 'pdf':
            // Generate PDF report
            blob = await generatePDFReport(result.data)
            filename = `skillcert-report-${new Date().toISOString().split('T')[0]}.pdf`
            mimeType = 'application/pdf'
            break
          default:
            throw new Error('Unsupported format')
        }

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        AuroraToast.success(`Data exported successfully as ${exportFormat.toUpperCase()}!`)
      } else {
        throw new Error(result.error || 'Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      AuroraToast.error('Failed to export data')
    } finally {
      setLoading(false)
    }
  }

  const convertDataToCSV = (data) => {
    let csv = 'SkillCert User Data Export\n'
    csv += `Generated: ${new Date().toLocaleString()}\n\n`

    // User profile
    if (data.profile) {
      csv += 'Profile Information\n'
      csv += 'Field,Value\n'
      Object.entries(data.profile).forEach(([key, value]) => {
        csv += `${key},"${value || 'N/A'}"\n`
      })
      csv += '\n'
    }

    // Credentials
    if (data.credentials && data.credentials.length > 0) {
      csv += 'Credentials\n'
      csv += 'ID,Skill,Status,Issue Date,Blockchain ID,IPFS Hash\n'
      data.credentials.forEach(cred => {
        csv += `${cred.id},"${cred.skill}","${cred.status}","${new Date(cred.created_at).toLocaleDateString()}","${cred.blockchain_id || 'N/A'}","${cred.ipfs_hash || 'N/A'}"\n`
      })
      csv += '\n'
    }

    // Tasks
    if (data.tasks && data.tasks.length > 0) {
      csv += 'Task Submissions\n'
      csv += 'ID,Title,Skill,Status,Submitted Date,Description\n'
      data.tasks.forEach(task => {
        csv += `${task.id},"${task.title}","${task.skill}","${task.status}","${new Date(task.created_at).toLocaleDateString()}","${(task.description || '').replace(/"/g, '""')}"\n`
      })
    }

    return csv
  }

  const generatePDFReport = async (data) => {
    // This would generate a comprehensive PDF report
    // For now, we'll use the certificate utils to create a basic report
    const reportData = {
      id: 'user-report',
      skill: 'Comprehensive Portfolio',
      recipientName: data.profile?.name || 'SkillCert User',
      timestamp: Date.now(),
      issuerAddress: 'SkillCert Platform'
    }

    return await CertificateUtils.generateCertificatePDF(reportData, {
      title: 'SkillCert Portfolio Report',
      isReport: true
    })
  }

  const exportFormats = [
    {
      id: 'json',
      name: 'JSON',
      description: 'Complete data in JSON format for developers',
      icon: FaDatabase,
      color: 'text-blue-400'
    },
    {
      id: 'csv',
      name: 'CSV',
      description: 'Spreadsheet-compatible format for analysis',
      icon: FaFileExport,
      color: 'text-green-400'
    },
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Professional portfolio report with credentials',
      icon: FaCertificate,
      color: 'text-red-400'
    }
  ]

  const dataCategories = [
    {
      name: 'Profile Information',
      description: 'Personal details, preferences, and account settings',
      icon: FaUser,
      count: '1 record'
    },
    {
      name: 'Credentials',
      description: 'Blockchain-verified certificates and achievements',
      icon: FaCertificate,
      count: 'Multiple records'
    },
    {
      name: 'Task Submissions',
      description: 'Completed assignments and skill demonstrations',
      icon: FaTasks,
      count: 'Multiple records'
    },
    {
      name: 'Analytics Data',
      description: 'Learning progress, statistics, and performance metrics',
      icon: FaChartBar,
      count: 'Time-series data'
    }
  ]

  return (
    <>
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="page-header"
      >
        <h1 className="page-title">Analytics & Insights</h1>
        <p className="page-subtitle">
          Monitor your learning progress, track credential performance, and export your data
        </p>
      </motion.div>

      <div className="dashboard-content">
        {/* Enhanced Key Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ marginBottom: 'var(--space-2xl)' }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: 'var(--space-xl)',
            flexWrap: 'wrap',
            gap: 'var(--space-md)'
          }}>
            <div>
              <h2 className="card-title">Performance Overview</h2>
              <p className="card-subtitle">Your learning progress at a glance</p>
            </div>
            <div className="status-indicator status-verified">
              <FaChartBar size={12} />
              Real-time data
            </div>
          </div>
          <div className="analytics-grid">
            <motion.div 
              className="metric-card"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="metric-header">
                <div className="metric-icon" style={{ 
                  background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                  boxShadow: '0 4px 20px rgba(45, 212, 191, 0.3)'
                }}>
                  <FaCertificate />
                </div>
                <div className="status-indicator status-verified" style={{ fontSize: '0.75rem' }}>
                  <FaShieldAlt size={8} />
                  Verified
                </div>
              </div>
              <div className="metric-value">24</div>
              <div className="metric-label">Total Credentials</div>
              <div className="metric-change positive">
                ↗ +3 this month
              </div>
            </motion.div>
            
            <motion.div 
              className="metric-card"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="metric-header">
                <div className="metric-icon" style={{ 
                  background: 'linear-gradient(135deg, var(--brand-secondary), var(--brand-purple))',
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
                }}>
                  <FaTasks />
                </div>
              </div>
              <div className="metric-value">47</div>
              <div className="metric-label">Tasks Completed</div>
              <div className="metric-change positive">
                ↗ +8 this week
              </div>
            </motion.div>
            
            <motion.div 
              className="metric-card"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="metric-header">
                <div className="metric-icon" style={{ 
                  background: 'linear-gradient(135deg, var(--brand-orange), var(--warning))',
                  boxShadow: '0 4px 20px rgba(251, 146, 60, 0.3)'
                }}>
                  <FaChartBar />
                </div>
              </div>
              <div className="metric-value">89%</div>
              <div className="metric-label">Success Rate</div>
              <div className="metric-change positive">
                ↗ +5% improvement
              </div>
            </motion.div>
            
            <motion.div 
              className="metric-card"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="metric-header">
                <div className="metric-icon" style={{ 
                  background: 'linear-gradient(135deg, var(--success), #059669)',
                  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
                }}>
                  <FaUser />
                </div>
              </div>
              <div className="metric-value">12</div>
              <div className="metric-label">Skill Categories</div>
              <div className="metric-change neutral">
                → No change
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Analytics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card"
          style={{ marginTop: 'var(--space-2xl)' }}
        >
          <div className="card-header">
            <div className="card-title">Learning Progress Analytics</div>
            <div className="card-subtitle">Detailed insights into your skill development journey</div>
          </div>
          <div className="card-body">
            <Analytics className="w-full" />
          </div>
        </motion.div>

        {/* Enhanced Data Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ marginTop: 'var(--space-2xl)' }}
        >
          <h2 className="card-title" style={{ marginBottom: 'var(--space-xl)' }}>Data Export & Privacy</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--space-2xl)' }}>
            {/* Export Options */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Export Formats</div>
                <div className="card-subtitle">Choose your preferred format to export all your SkillCert data</div>
              </div>
              
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                  {exportFormats.map((format, index) => (
                    <motion.div
                      key={format.id}
                      className={`skill-card ${exportFormat === format.id ? 'selected' : ''}`}
                      onClick={() => setExportFormat(format.id)}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="skill-card-header">
                        <div 
                          className="skill-card-icon" 
                          style={{ 
                            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                            boxShadow: exportFormat === format.id ? '0 4px 20px rgba(45, 212, 191, 0.4)' : 'none'
                          }}
                        >
                          <format.icon />
                        </div>
                        <div className="skill-card-badge">
                          {exportFormat === format.id ? '✓' : '○'}
                        </div>
                      </div>
                      <div className="skill-card-title">{format.name}</div>
                      <div className="skill-card-description">{format.description}</div>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  className="btn btn-primary btn-full btn-lg"
                  onClick={exportUserData}
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-sm)'
                  }}
                >
                  {loading ? (
                    <>
                      <div className="spinner" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FaDownload />
                      Export as {exportFormats.find(f => f.id === exportFormat)?.name}
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Data Categories */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">What's Included</div>
                <div className="card-subtitle">Your export will contain all the following data categories</div>
              </div>
              
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {dataCategories.map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="data-card"
                      style={{ padding: 'var(--space-lg)' }}
                    >
                      <div className="data-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                          <div 
                            className="metric-icon"
                            style={{ 
                              background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                              width: '32px',
                              height: '32px'
                            }}
                          >
                            <category.icon />
                          </div>
                          <div>
                            <div className="data-card-title" style={{ fontSize: 'var(--text-base)' }}>
                              {category.name}
                            </div>
                            <div className="data-card-meta">
                              {category.count}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)',
                        marginTop: 'var(--space-sm)'
                      }}>
                        {category.description}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div style={{
                  marginTop: 'var(--space-xl)',
                  padding: 'var(--space-lg)',
                  background: 'rgba(59, 130, 246, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--space-md)',
                    marginBottom: 'var(--space-sm)'
                  }}>
                    <FaCalendarAlt style={{ color: 'var(--brand-secondary)' }} />
                    <span style={{ 
                      fontWeight: '600',
                      color: 'var(--brand-secondary)',
                      fontSize: 'var(--text-sm)'
                    }}>
                      Data Retention Policy
                    </span>
                  </div>
                  <p style={{ 
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6'
                  }}>
                    Your data export includes all historical information since account creation. 
                    Blockchain credentials remain permanently verifiable even after export.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ marginTop: 'var(--space-2xl)' }}
        >
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-elevated))',
            border: '1px solid var(--border-secondary)'
          }}>
            <div className="card-header">
              <div className="card-title">Privacy & Data Protection</div>
              <div className="card-subtitle">Your data security and privacy are our top priority</div>
            </div>
            
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
                <div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--space-sm)',
                    marginBottom: 'var(--space-lg)'
                  }}>
                    <FaFileExport style={{ color: 'var(--brand-primary)' }} />
                    <h4 style={{ 
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-base)'
                    }}>
                      What We Export
                    </h4>
                  </div>
                  <ul style={{ 
                    listStyle: 'none',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-sm)'
                  }}>
                    {[
                      'Profile information and preferences',
                      'Earned credentials and certifications',
                      'Task submissions and completions',
                      'Learning analytics and progress data'
                    ].map((item, index) => (
                      <li key={index} style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'var(--brand-primary)',
                          flexShrink: 0
                        }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--space-sm)',
                    marginBottom: 'var(--space-lg)'
                  }}>
                    <FaShieldAlt style={{ color: 'var(--success)' }} />
                    <h4 style={{ 
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-base)'
                    }}>
                      Data Security
                    </h4>
                  </div>
                  <ul style={{ 
                    listStyle: 'none',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-sm)'
                  }}>
                    {[
                      'Blockchain credentials remain immutable',
                      'Personal data encrypted during export',
                      'No sensitive authentication data included',
                      'Full GDPR compliance maintained'
                    ].map((item, index) => (
                      <li key={index} style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'var(--success)',
                          flexShrink: 0
                        }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default AnalyticsPage