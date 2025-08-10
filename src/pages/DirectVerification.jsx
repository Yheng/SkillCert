import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSpring, animated } from '@react-spring/web'
import { 
  FaCheckCircle,
  FaTimes,
  FaFile,
  FaExternalLinkAlt,
  FaCertificate,
  FaShieldAlt,
  FaClock,
  FaUser,
  FaHashtag,
  FaDownload,
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa'
import backendService from '../api/backend'
import CertificateUtils from '../utils/certificateUtils'

const DirectVerification = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [verificationResult, setVerificationResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Animation for verification badge
  const verificationAnimation = useSpring({
    from: { scale: 0, rotate: -180 },
    to: { scale: verificationResult?.isValid ? 1 : 0, rotate: 0 },
    config: { tension: 300, friction: 10 }
  })

  useEffect(() => {
    if (id) {
      verifyCredential(id)
    } else {
      setError('No credential ID provided')
      setLoading(false)
    }
  }, [id])

  const verifyCredential = async (credentialId) => {
    try {
      setLoading(true)
      setError(null)

      const result = await backendService.verifyCredential(credentialId)
      
      if (result.success && result.credential) {
        setVerificationResult({
          isValid: result.isValid,
          data: result.credential,
          verificationTime: new Date().toISOString()
        })
      } else {
        setVerificationResult({
          isValid: false,
          error: result.error || 'Credential not found or invalid'
        })
      }
    } catch (error) {
      console.error('Verification error:', error)
      setError('Failed to verify credential. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateCertificatePDF = async (credential) => {
    try {
      const certificateData = {
        id: credential.blockchain_id || credential.id,
        blockchain_id: credential.blockchain_id || credential.id,
        skill: credential.skill,
        recipientName: credential.user_name || 'Verified Professional',
        timestamp: credential.created_at,
        issuerAddress: credential.issuer || credential.issuer_address,
        metadata: credential.metadata
      }

      const pdfBlob = await CertificateUtils.generateCertificatePDF(certificateData)
      const filename = `skillcert-${credential.skill.replace(/\s+/g, '-').toLowerCase()}-${certificateData.id}.pdf`
      
      CertificateUtils.downloadBlob(pdfBlob, filename)
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Failed to generate certificate PDF')
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <div className="loading-text">Verifying credential...</div>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card"
        style={{ textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}
      >
        <FaExclamationTriangle style={{ 
          fontSize: '4rem', 
          color: '#ef4444',
          marginBottom: '1rem'
        }} />
        <h2 className="heading-h2" style={{ color: '#ef4444', marginBottom: '1rem' }}>
          Verification Error
        </h2>
        <p className="body-text" style={{ marginBottom: '2rem' }}>
          {error}
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/verification')}
        >
          Try Manual Verification
        </button>
      </motion.div>
    )
  }

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="page-header"
      >
        <h1 className="page-title">
          Credential Verification
        </h1>
        <p className="page-subtitle">
          Blockchain-verified credential details
        </p>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="card">
          {/* Verification Status */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <animated.div style={verificationAnimation}>
              {verificationResult?.isValid ? (
                <FaCheckCircle style={{ 
                  fontSize: '4rem', 
                  color: 'var(--green)',
                  filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))'
                }} />
              ) : (
                <FaTimes style={{ 
                  fontSize: '4rem', 
                  color: '#ef4444',
                  filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.5))'
                }} />
              )}
            </animated.div>
            <h2 className="heading-h2" style={{ 
              marginTop: '1rem',
              color: verificationResult?.isValid ? 'var(--green)' : '#ef4444'
            }}>
              {verificationResult?.isValid ? 'Credential Verified ✓' : 'Verification Failed ✗'}
            </h2>
            <p className="body-text">
              {verificationResult?.isValid 
                ? 'This credential is authentic and tamper-proof'
                : verificationResult?.error || 'This credential could not be verified'
              }
            </p>
          </div>

          {/* Enhanced Credential Details */}
          {verificationResult?.isValid && verificationResult.data && (
            <div className="data-card" style={{ 
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <div className="data-card-header">
                <div className="data-card-title" style={{ color: 'var(--success)' }}>
                  Verified Credential Details
                </div>
                <div className="status-indicator status-verified">
                  <FaShieldAlt size={12} />
                  Verified
                </div>
              </div>
              
              <div className="data-card-content">
                <div className="analytics-grid">
                  <div className="metric-card">
                    <div className="metric-header">
                      <div className="metric-icon" style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))' }}>
                        <FaCertificate />
                      </div>
                    </div>
                    <div className="metric-value">{verificationResult.data.skill}</div>
                    <div className="metric-label">Verified Skill</div>
                  </div>
                  
                  <div className="metric-card">
                    <div className="metric-header">
                      <div className="metric-icon" style={{ background: 'linear-gradient(135deg, var(--brand-secondary), var(--brand-purple))' }}>
                        <FaUser />
                      </div>
                    </div>
                    <div className="metric-value" style={{ fontSize: 'var(--text-lg)' }}>
                      {verificationResult.data.user_name || 'Professional'}
                    </div>
                    <div className="metric-label">Credential Holder</div>
                  </div>
                  
                  <div className="metric-card">
                    <div className="metric-header">
                      <div className="metric-icon" style={{ background: 'linear-gradient(135deg, var(--brand-orange), var(--warning))' }}>
                        <FaClock />
                      </div>
                    </div>
                    <div className="metric-value" style={{ fontSize: 'var(--text-lg)' }}>
                      {new Date(verificationResult.data.created_at).toLocaleDateString()}
                    </div>
                    <div className="metric-label">Issue Date</div>
                  </div>
                </div>
                
                <div style={{ 
                  marginTop: 'var(--space-xl)',
                  padding: 'var(--space-lg)',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-secondary)'
                }}>
                  <div className="form-field-label">
                    <FaHashtag />
                    Blockchain Verification Hash
                  </div>
                  <div className="connection-address" style={{ 
                    marginTop: 'var(--space-sm)',
                    fontSize: 'var(--text-sm)',
                    wordBreak: 'break-all'
                  }}>
                    {verificationResult.data.blockchain_id}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {verificationResult.data.ipfs_hash && (
                  <motion.button
                    className="btn btn-secondary"
                    onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${verificationResult.data.ipfs_hash}`, '_blank')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <FaFile /> View Proof Files
                    <FaExternalLinkAlt style={{ fontSize: '0.875rem' }} />
                  </motion.button>
                )}
                
                <motion.button
                  className="btn btn-primary"
                  onClick={() => generateCertificatePDF(verificationResult.data)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaDownload /> Download Certificate
                </motion.button>

                <motion.button
                  className="btn btn-ghost"
                  onClick={() => navigate('/verification')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Verify Another Credential
                </motion.button>
              </div>
            </div>
          )}

          {/* Failed verification message */}
          {!verificationResult?.isValid && verificationResult?.error && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <motion.button
                className="btn btn-primary"
                onClick={() => navigate('/verification')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Try Manual Verification
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}

export default DirectVerification