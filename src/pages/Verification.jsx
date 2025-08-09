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
  FaDownload
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
    <div className="tasks-container">
      <div className="tasks-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <div style={{ 
            display: 'inline-block',
            padding: '1rem',
            background: 'rgba(45, 212, 191, 0.1)',
            borderRadius: '50%',
            marginBottom: '1.5rem'
          }}>
            <FaShieldAlt style={{ fontSize: '3rem', color: 'var(--teal)' }} />
          </div>
          <h1 className="heading-h1" style={{ marginBottom: '1rem' }}>
            Credential Verification
          </h1>
          <p className="subheading" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Instantly verify blockchain-secured credentials and view tamper-proof evidence
          </p>
        </motion.div>

        {/* Wallet Connection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card"
          style={{ padding: '1.5rem', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem auto' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: walletConnected ? 'var(--green)' : 'var(--orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                {walletConnected ? '✓' : '!'}
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: '600', marginBottom: '0.25rem' }}>
                  Blockchain Connection
                </div>
                <div style={{ color: 'var(--light-gray)', fontSize: '0.875rem' }}>
                  {walletConnected 
                    ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
                    : 'Connect wallet for full blockchain verification'
                  }
                </div>
              </div>
            </div>
            
            {!walletConnected && (
              <button
                className="btn-primary"
                onClick={connectWallet}
                disabled={connectingWallet}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
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

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card"
          style={{ padding: '2rem', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem auto' }}
        >
          {/* Search Type Selector */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '2rem',
            gap: '1rem'
          }}>
            <button
              className={`neumorphic-btn ${searchType === 'credential' ? 'primary' : ''}`}
              onClick={() => setSearchType('credential')}
              style={{ 
                padding: '0.75rem 1.5rem',
                background: searchType === 'credential' ? 'linear-gradient(45deg, var(--teal), var(--blue))' : '#1e293b',
                color: searchType === 'credential' ? 'white' : 'var(--blue)'
              }}
            >
              <FaCertificate style={{ marginRight: '0.5rem' }} />
              Verify Credential
            </button>
            <button
              className={`neumorphic-btn ${searchType === 'user' ? 'primary' : ''}`}
              onClick={() => setSearchType('user')}
              style={{ 
                padding: '0.75rem 1.5rem',
                background: searchType === 'user' ? 'linear-gradient(45deg, var(--teal), var(--blue))' : '#1e293b',
                color: searchType === 'user' ? 'white' : 'var(--blue)'
              }}
            >
              <FaUser style={{ marginRight: '0.5rem' }} />
              Find Professional
            </button>
          </div>

          <form onSubmit={handleSearch}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">
                  {searchType === 'credential' ? (
                    <>
                      <FaHashtag style={{ marginRight: '0.5rem' }} />
                      Credential ID or Blockchain Hash
                    </>
                  ) : (
                    <>
                      <FaUser style={{ marginRight: '0.5rem' }} />
                      Email Address or Wallet
                    </>
                  )}
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    searchType === 'credential' 
                      ? 'Enter credential ID (e.g., 0x1234...abcd)' 
                      : 'Enter professional\'s email or wallet address'
                  }
                  className="form-input"
                  style={{ fontSize: '1rem' }}
                  disabled={loading}
                />
              </div>
              <motion.button
                type="submit"
                className="btn-primary"
                disabled={loading || !searchQuery.trim()}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                style={{ 
                  padding: '0.875rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <div className="spinner" style={{ 
                    width: '1.25rem', 
                    height: '1.25rem',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%'
                  }} />
                ) : (
                  <>
                    <FaSearch />
                    Verify
                  </>
                )}
              </motion.button>
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
              <div className="glass-card" style={{ padding: '2rem' }}>
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

                {/* Credential Details */}
                {searchResult.isValid && searchResult.data && (
                  <div style={{ 
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    padding: '2rem'
                  }}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                      gap: '1.5rem' 
                    }}>
                      <div>
                        <div className="form-label" style={{ marginBottom: '0.5rem' }}>
                          <FaCertificate style={{ marginRight: '0.5rem' }} />
                          Skill Verified
                        </div>
                        <div className="stat-title">{searchResult.data.skill}</div>
                      </div>
                      <div>
                        <div className="form-label" style={{ marginBottom: '0.5rem' }}>
                          <FaUser style={{ marginRight: '0.5rem' }} />
                          Credential Holder
                        </div>
                        <div className="stat-title">{searchResult.data.user_name || 'Verified Professional'}</div>
                      </div>
                      <div>
                        <div className="form-label" style={{ marginBottom: '0.5rem' }}>
                          <FaClock style={{ marginRight: '0.5rem' }} />
                          Issue Date
                        </div>
                        <div className="stat-title">
                          {new Date(searchResult.data.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="form-label" style={{ marginBottom: '0.5rem' }}>
                          <FaHashtag style={{ marginRight: '0.5rem' }} />
                          Blockchain ID
                        </div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: 'var(--teal)', 
                          fontFamily: 'monospace',
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
              /* User Credentials Display */
              <div>
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
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

                {/* Credentials Grid */}
                {searchResult.isValid && searchResult.data && (
                  <div className="credentials-grid">
                    {searchResult.data.map((credential, index) => (
                      <motion.div
                        key={credential.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="credential-card"
                      >
                        <div className="credential-header">
                          <div className="credential-info">
                            <h3 className="credential-skill">{credential.skill}</h3>
                            <p className="credential-meta">
                              Verified: {new Date(credential.created_at).toLocaleDateString()}
                            </p>
                            <p className="credential-meta">
                              ID: #{credential.id}
                            </p>
                          </div>
                          <div style={{ marginLeft: '1rem' }}>
                            <FaCheckCircle style={{ 
                              fontSize: '2rem', 
                              color: 'var(--green)' 
                            }} />
                          </div>
                        </div>
                        
                        <div className="credential-actions">
                          <button
                            className="btn-primary"
                            onClick={() => setSearchQuery(credential.blockchain_id)}
                            style={{ 
                              flex: 1, 
                              fontSize: '0.875rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            <FaSearch /> View Details
                          </button>
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
      </div>
    </div>
  )
}

export default Verification