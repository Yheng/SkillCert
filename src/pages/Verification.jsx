import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSpring, animated } from '@react-spring/web'
import { 
  FaSearch,
  FaCheckCircle,
  FaTimes,
  FaFile,
  FaExternalLinkAlt,
  FaCertificate,
  FaShieldAlt,
  FaClock,
  FaUser,
  FaHashtag,
  FaGlobe,
  FaDownload,
  FaCalendarAlt,
  FaExclamationTriangle
} from 'react-icons/fa'
import { MdVerified } from 'react-icons/md'
import blockchainService from '../api/blockchain'
import backendService from '../api/backend'

const Verification = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchType, setSearchType] = useState('credential') // 'credential' or 'user'
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [connectingWallet, setConnectingWallet] = useState(false)

  // Animation for verification badge
  const verificationAnimation = useSpring({
    from: { scale: 0, rotate: -180 },
    to: { scale: searchResult?.isValid ? 1 : 0, rotate: 0 },
    config: { tension: 300, friction: 10 }
  })

  // Check wallet connection on component mount
  React.useEffect(() => {
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
      } else {
        alert(`Failed to connect wallet: ${result.error}`)
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      alert('Failed to connect wallet. Please make sure MetaMask is installed.')
    } finally {
      setConnectingWallet(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      setSearchResult(null)

      let result
      if (searchType === 'credential') {
        // Search by credential ID or blockchain hash using backend API
        result = await backendService.verifyCredential(searchQuery)
        if (result.success && result.credential) {
          setSearchResult({
            type: 'credential',
            isValid: result.isValid,
            data: result.credential,
            verificationTime: new Date().toISOString()
          })
        } else {
          setSearchResult({
            type: 'credential',
            isValid: false,
            error: result.error || 'Credential not found or invalid'
          })
        }
      } else {
        // Search by user email or wallet address using backend API
        result = await backendService.getUserCredentialsByIdentifier(searchQuery)
        if (result.success && result.credentials) {
          setSearchResult({
            type: 'user',
            isValid: true,
            data: result.credentials,
            userInfo: result.userInfo
          })
        } else {
          setSearchResult({
            type: 'user',
            isValid: false,
            error: result.error || 'User not found or no credentials'
          })
        }
      }
    } catch (error) {
      console.error('Verification error:', error)
      setSearchResult({
        type: searchType,
        isValid: false,
        error: 'Verification failed. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const generateCertificatePDF = (credential) => {
    // Mock PDF generation - in real implementation, would generate actual PDF
    const blob = new Blob([`SkillCert Certificate

Credential ID: ${credential.id}
Skill: ${credential.skill}
Holder: ${credential.user_name || 'Verified Professional'}
Issue Date: ${new Date(credential.created_at).toLocaleDateString()}
Blockchain Hash: ${credential.blockchain_id}

This certificate is blockchain-verified and tamper-proof.
Verify at: ${window.location.origin}/verification`], { type: 'text/plain' })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `skillcert-${credential.skill.toLowerCase().replace(/\s+/g, '-')}-certificate.txt`
    a.click()
    URL.revokeObjectURL(url)
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
            Instantly verify blockchain-secured credentials and view tamper-proof evidence
          </p>
        </motion.div>

        {/* Wallet Connection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="connection-card"
          style={{ marginBottom: '2rem' }}
        >
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
                  ? 'Your wallet is connected and ready for verification'
                  : 'Connect wallet for full blockchain verification'
                }
              </div>
              {walletConnected && walletAddress && (
                <div className="connection-address">
                  {walletAddress.substring(0, 8)}...{walletAddress.substring(34)}
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              {walletConnected ? (
                <div className="status-indicator status-connected">
                  <FaShieldAlt size={12} />
                  Connected
                </div>
              ) : (
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

        {/* Enhanced Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="card"
          style={{ marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem auto' }}
        >
          {/* Enhanced Search Type Selector */}
          <div className="tab-navigation">
            <motion.button
              className={`tab-button ${searchType === 'credential' ? 'active' : ''}`}
              onClick={() => setSearchType('credential')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="tab-content">
                <FaCertificate />
                Verify Credential
              </div>
            </motion.button>
            <motion.button
              className={`tab-button ${searchType === 'user' ? 'active' : ''}`}
              onClick={() => setSearchType('user')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="tab-content">
                <FaUser />
                Find Professional
              </div>
            </motion.button>
          </div>

          <form onSubmit={handleSearch} style={{ marginTop: 'var(--space-xl)' }}>
            <div className="form-field">
              <div className="form-field-label">
                {searchType === 'credential' ? (
                  <>
                    <FaHashtag />
                    Credential ID or Blockchain Hash
                  </>
                ) : (
                  <>
                    <FaUser />
                    Professional Email or Wallet Address
                  </>
                )}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    searchType === 'credential' 
                      ? 'Enter credential ID (e.g., 0x1234...abcd)' 
                      : 'Enter professional\'s email or wallet address'
                  }
                  className="form-field-input"
                  style={{ flex: 1 }}
                  disabled={loading}
                />
                <motion.button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !searchQuery.trim()}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  style={{ 
                    padding: 'var(--space-lg) var(--space-xl)',
                    minWidth: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-sm)'
                  }}
                >
                  {loading ? (
                    <div className="spinner" />
                  ) : (
                    <>
                      <FaSearch />
                      Verify
                    </>
                  )}
                </motion.button>
              </div>
              <div className="form-validation" style={{ color: 'var(--text-muted)' }}>
                {searchType === 'credential' 
                  ? 'Enter the unique credential ID or blockchain hash to verify its authenticity'
                  : 'Search for a professional\'s verified credentials using their email or wallet address'
                }
              </div>
            </div>
          </form>
        </motion.div>

        {/* Results Section */}
        {searchResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: '900px', margin: '0 auto' }}
          >
            {searchResult.type === 'credential' ? (
              <div className="card">
                
                {/* Verification Status */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <animated.div style={verificationAnimation}>
                    {searchResult.isValid ? (
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
                    color: searchResult.isValid ? 'var(--green)' : '#ef4444'
                  }}>
                    {searchResult.isValid ? 'Credential Verified ✓' : 'Verification Failed ✗'}
                  </h2>
                  <p className="body-text">
                    {searchResult.isValid 
                      ? 'This credential is authentic and tamper-proof'
                      : searchResult.error || 'This credential could not be verified'
                    }
                  </p>
                </div>

                {/* Enhanced Credential Details */}
                {searchResult.isValid && searchResult.data && (
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
                          <div className="metric-value">{searchResult.data.skill}</div>
                          <div className="metric-label">Verified Skill</div>
                        </div>
                        
                        <div className="metric-card">
                          <div className="metric-header">
                            <div className="metric-icon" style={{ background: 'linear-gradient(135deg, var(--brand-secondary), var(--brand-purple))' }}>
                              <FaUser />
                            </div>
                          </div>
                          <div className="metric-value" style={{ fontSize: 'var(--text-lg)' }}>
                            {searchResult.data.user_name || 'Professional'}
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
                            {new Date(searchResult.data.created_at).toLocaleDateString()}
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
                          {searchResult.data.blockchain_id}
                        </div>
                      </div>
                    </div>

                    {/* IPFS Proof Link */}
                    {searchResult.data.ipfs_hash && (
                      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <button
                          className="btn-secondary"
                          onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${searchResult.data.ipfs_hash}`, '_blank')}
                          style={{ 
                            marginRight: '1rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <FaFile /> View Proof Files
                          <FaExternalLinkAlt style={{ fontSize: '0.875rem' }} />
                        </button>
                        <button
                          className="btn-secondary"
                          onClick={() => generateCertificatePDF(searchResult.data)}
                          style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <FaDownload /> Download Certificate
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Enhanced User Credentials Display */
              <div>
                <div className="card" style={{ marginBottom: '2rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <animated.div style={verificationAnimation}>
                      {searchResult.isValid ? (
                        <MdVerified style={{ 
                          fontSize: '4rem', 
                          color: 'var(--blue)',
                          filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))'
                        }} />
                      ) : (
                        <FaTimes style={{ 
                          fontSize: '4rem', 
                          color: '#ef4444'
                        }} />
                      )}
                    </animated.div>
                    <h2 className="heading-h2" style={{ 
                      marginTop: '1rem',
                      color: searchResult.isValid ? 'var(--blue)' : '#ef4444'
                    }}>
                      {searchResult.isValid 
                        ? `Professional Profile Found`
                        : 'Professional Not Found'
                      }
                    </h2>
                    {searchResult.userInfo && (
                      <p className="body-text">
                        Verified credentials for {searchResult.userInfo.name || 'this professional'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Enhanced Credentials Grid */}
                {searchResult.isValid && searchResult.data && (
                  <div className="analytics-grid">
                    {searchResult.data.map((credential, index) => (
                      <motion.div
                        key={credential.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="data-card"
                      >
                        <div className="data-card-header">
                          <div>
                            <div className="data-card-title">{credential.skill}</div>
                            <div className="data-card-meta">
                              <FaCalendarAlt />
                              Verified: {new Date(credential.created_at).toLocaleDateString()}
                              <span>•</span>
                              <FaHashtag />
                              ID: #{credential.id}
                            </div>
                          </div>
                          <div className="status-indicator status-verified">
                            <FaCheckCircle size={12} />
                            Verified
                          </div>
                        </div>
                        
                        <div className="data-card-content">
                          <p style={{ 
                            color: 'var(--text-secondary)', 
                            fontSize: 'var(--text-sm)',
                            marginBottom: 'var(--space-lg)'
                          }}>
                            This credential has been verified on the blockchain and is tamper-proof.
                          </p>
                        </div>
                        
                        <div className="data-card-actions">
                          <motion.button
                            className="btn btn-primary btn-full"
                            onClick={() => {
                              setSearchType('credential')
                              setSearchQuery(credential.blockchain_id)
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FaSearch />
                            View Full Details
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* How It Works Section */}
        {!searchResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ marginTop: '4rem' }}
          >
            <h2 className="heading-h2" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              How Verification Works
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '2rem' 
            }}>
              {[
                {
                  icon: FaHashtag,
                  title: 'Enter Credential ID',
                  description: 'Paste the credential ID or blockchain hash from the certificate'
                },
                {
                  icon: FaGlobe,
                  title: 'Blockchain Lookup',
                  description: 'Our system queries the blockchain for tamper-proof verification'
                },
                {
                  icon: FaShieldAlt,
                  title: 'Instant Results',
                  description: 'Get immediate confirmation of authenticity and view proof files'
                }
              ].map((step, index) => (
                <div key={step.title} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ 
                    display: 'inline-block',
                    padding: '1rem',
                    background: 'rgba(45, 212, 191, 0.1)',
                    borderRadius: '50%',
                    marginBottom: '1rem'
                  }}>
                    <step.icon style={{ fontSize: '1.5rem', color: 'var(--teal)' }} />
                  </div>
                  <h3 className="stat-title" style={{ marginBottom: '0.5rem' }}>{step.title}</h3>
                  <p className="body-text" style={{ fontSize: '0.875rem' }}>{step.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
    </>
  )
}

export default Verification