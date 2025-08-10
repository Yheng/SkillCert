import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import backendService from '../api/backend'
import { 
  FaEthereum, 
  FaShieldAlt, 
  FaRocket, 
  FaCheckCircle, 
  FaStar,
  FaUsers,
  FaTrophy,
  FaArrowRight,
  FaPlay,
  FaChartLine,
  FaCertificate,
  FaGlobe,
  FaBolt,
  FaCode,
  FaPalette,
  FaRobot,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaDiscord,
  FaChevronDown,
  FaHandshake,
  FaEye
} from 'react-icons/fa'

// Simple animated counter
const Counter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [end, duration])

  return <span>{Math.floor(count)}{suffix}</span>
}

const ProfessionalLanding = () => {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const stats = [
    { value: <Counter end={850} suffix="K+" />, label: "Verified Professionals", icon: FaUsers },
    { value: <Counter end={3.2} suffix="M+" />, label: "Skills Verified", icon: FaCertificate },
    { value: <Counter end={47} suffix="%" />, label: "Average Raise", icon: FaChartLine },
    { value: <Counter end={156} />, label: "Countries", icon: FaGlobe }
  ]

  const features = [
    {
      icon: FaShieldAlt,
      title: "Blockchain Security",
      description: "Military-grade encryption with immutable smart contracts. Every credential is cryptographically secured and impossible to forge."
    },
    {
      icon: FaBolt,
      title: "Instant Verification",
      description: "Verify credentials in under 2 seconds globally. No more waiting weeks for background checks or skill validation."
    },
    {
      icon: FaTrophy,
      title: "Career Boost",
      description: "Join 850K+ professionals who increased their rates by 47% with blockchain-verified micro-credentials."
    }
  ]

  const skills = [
    { name: "React Development", icon: FaCode, rate: "$95/hr" },
    { name: "UI/UX Design", icon: FaPalette, rate: "$85/hr" },
    { name: "Blockchain Dev", icon: FaEthereum, rate: "$130/hr" },
    { name: "AI/ML Engineering", icon: FaRobot, rate: "$145/hr" }
  ]

  const testimonials = [
    {
      quote: "SkillCert helped me increase my freelance rates by 73%. Clients now trust my verified credentials instantly.",
      author: "Sarah Chen",
      role: "Senior React Developer",
      avatar: "👩‍💻"
    },
    {
      quote: "We reduced our hiring time by 90% using SkillCert's verification. Game-changer for our team.",
      author: "Marcus Rodriguez", 
      role: "VP Engineering, Microsoft",
      avatar: "👨‍💼"
    }
  ]

  return (
    <div className="professional-landing">
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: 'linear-gradient(135deg, #2DD4BF, #3B82F6)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaShieldAlt style={{ color: 'white', fontSize: '1.25rem' }} />
              </div>
              <div>
                <span style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 700, 
                  color: 'white'
                }}>SkillCert</span>
                <div style={{ fontSize: '0.75rem', color: 'rgba(248, 250, 252, 0.7)' }}>
                  Verified Skills Platform
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <a href="#features" style={{ 
                  color: 'rgba(248, 250, 252, 0.8)', 
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}>Features</a>
                <a href="#testimonials" style={{ 
                  color: 'rgba(248, 250, 252, 0.8)', 
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}>Testimonials</a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/verification" style={{ 
                  color: 'rgba(248, 250, 252, 0.8)', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'color 0.3s ease'
                }}>
                  <FaEye />
                  Verify
                </Link>
                <button
                  onClick={async () => {
                    try {
                      const result = await backendService.login({
                        email: 'demo@skillcert.com',
                        password: 'demo123'
                      })
                      if (result.success) {
                        const userRole = result.user?.role || 'freelancer'
                        switch (userRole) {
                          case 'educator':
                            window.location.href = '/educator-dashboard'
                            break
                          case 'employer':
                            window.location.href = '/verification'
                            break
                          default:
                            window.location.href = '/dashboard'
                        }
                      } else {
                        alert('Demo login failed: ' + (result.error || 'Unknown error'))
                      }
                    } catch (error) {
                      console.error('Demo login error:', error)
                      alert('Demo login failed: ' + error.message)
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #2DD4BF, #3B82F6)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <FaPlay />
                  Try Demo
                </button>
                <Link to="/auth">
                  <button style={{
                    background: 'transparent',
                    border: '2px solid #2DD4BF',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    color: '#2DD4BF',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    Get Started Free
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '80px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        overflow: 'hidden'
      }}>
        {/* Blockchain-Themed Background Effects */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none'
        }}>
          {/* Blockchain Network Pattern */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1 }} viewBox="0 0 1200 800">
            <defs>
              <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4"/>
              </radialGradient>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.3"/>
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3"/>
              </linearGradient>
              <pattern id="blockchainPattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="60" cy="60" r="8" fill="url(#nodeGradient)" opacity="0.6">
                  <animate attributeName="r" values="6;10;6" dur="4s" repeatCount="indefinite"/>
                </circle>
                <line x1="60" y1="60" x2="120" y2="60" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.4"/>
                <line x1="60" y1="60" x2="60" y2="120" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.4"/>
                <line x1="60" y1="60" x2="105" y2="105" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blockchainPattern)"/>
          </svg>

          {/* Blockchain Network Nodes */}
          <div style={{ position: 'absolute', top: '10%', left: '5%', width: '60px', height: '60px' }}>
            <svg viewBox="0 0 60 60" style={{ width: '100%', height: '100%' }}>
              {/* Central node */}
              <circle cx="30" cy="30" r="8" fill="#2DD4BF" opacity="0.7">
                <animate attributeName="r" values="6;12;6" dur="4s" repeatCount="indefinite"/>
              </circle>
              {/* Connected nodes */}
              <circle cx="15" cy="15" r="4" fill="#3B82F6" opacity="0.6"/>
              <circle cx="45" cy="15" r="4" fill="#8B5CF6" opacity="0.6"/>
              <circle cx="15" cy="45" r="4" fill="#10B981" opacity="0.6"/>
              <circle cx="45" cy="45" r="4" fill="#F59E0B" opacity="0.6"/>
              {/* Connection lines */}
              <line x1="30" y1="30" x2="15" y2="15" stroke="#2DD4BF" strokeWidth="2" opacity="0.4"/>
              <line x1="30" y1="30" x2="45" y2="15" stroke="#2DD4BF" strokeWidth="2" opacity="0.4"/>
              <line x1="30" y1="30" x2="15" y2="45" stroke="#2DD4BF" strokeWidth="2" opacity="0.4"/>
              <line x1="30" y1="30" x2="45" y2="45" stroke="#2DD4BF" strokeWidth="2" opacity="0.4"/>
            </svg>
          </div>
          
          {/* Professional Blockchain Network */}
          <div style={{ position: 'absolute', top: '20%', right: '8%', width: '70px', height: '70px' }}>
            <svg viewBox="0 0 109.06 122.88" style={{ width: '100%', height: '100%', opacity: 0.7 }}>
              <path d="M34.43 47.86L52.8 37.6V18.31a9.233 9.233 0 01-5.46-3.16L17.91 32.18c.35.98.54 2.03.54 3.13 0 .92-.13 1.8-.38 2.64l16.36 9.91zm11.35-35.38a9.231 9.231 0 01-.59-3.25c0-2.55 1.03-4.86 2.7-6.53S51.87 0 54.42 0c2.55 0 4.86 1.03 6.53 2.7a9.205 9.205 0 012.7 6.53c0 1.12-.2 2.19-.56 3.18l29.57 17.1c.21-.25.42-.5.65-.73a9.205 9.205 0 016.53-2.7c2.55 0 4.86 1.03 6.53 2.7a9.205 9.205 0 012.7 6.53c0 2.55-1.03 4.85-2.7 6.52a9.194 9.194 0 01-5.32 2.62v33.91c2.07.27 3.92 1.22 5.32 2.62 1.67 1.67 2.7 3.98 2.7 6.52a9.222 9.222 0 01-9.23 9.23 9.205 9.205 0 01-7.15-3.39l-29.61 17.12c.36.99.56 2.06.56 3.18 0 2.55-1.03 4.86-2.7 6.53a9.222 9.222 0 01-9.23 0 9.205 9.205 0 01-2.7-6.53c0-1.12.2-2.19.56-3.18L17.47 93.84a9.205 9.205 0 01-7.15 3.39 9.222 9.222 0 01-9.23-9.23c0-2.54 1.03-4.85 2.7-6.52a9.194 9.194 0 015.32-2.62V45.95a9.194 9.194 0 01-5.32-2.62A9.205 9.205 0 010 36.81c0-2.55 1.03-4.86 2.7-6.53a9.205 9.205 0 016.53-2.7c.23 0 .44.05.65.07l29.95-17.27z" 
                    fill="#2DD4BF">
                <animateTransform attributeName="transform" type="rotate" values="0 54.5 61.4;360 54.5 61.4" dur="20s" repeatCount="indefinite"/>
              </path>
            </svg>
          </div>

          {/* Cryptocurrency Symbol */}
          <div style={{ position: 'absolute', bottom: '15%', left: '10%', width: '50px', height: '50px' }}>
            <svg viewBox="0 0 50 50" style={{ width: '100%', height: '100%' }}>
              {/* Bitcoin-like symbol */}
              <circle cx="25" cy="25" r="20" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.6">
                <animate attributeName="stroke-dasharray" values="0 126;63 63;126 0" dur="5s" repeatCount="indefinite"/>
              </circle>
              <path d="M18 15v20M32 15v20M20 20h10c2 0 4 1 4 3s-2 3-4 3h-2c2 0 4 1 4 3s-2 3-4 3H20" 
                    fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.8"/>
            </svg>
          </div>

          {/* Professional Digital Certificate */}
          <div style={{ position: 'absolute', top: '60%', right: '15%', width: '60px', height: '60px' }}>
            <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%', opacity: 0.6 }}>
              <path d="M14,2A8,8 0 0,0 6,10A8,8 0 0,0 14,18A8,8 0 0,0 22,10H20C20,13.32 17.32,16 14,16A6,6 0 0,1 8,10A6,6 0 0,1 14,4A6,6 0 0,1 20,10H22A8,8 0 0,0 14,2Z" 
                    fill="#10B981">
                <animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="3s" repeatCount="indefinite"/>
              </path>
              <path d="M15.5,12L14,10.5L15.5,9L17,10.5L15.5,12M9.5,12L8,10.5L9.5,9L11,10.5L9.5,12Z" fill="#10B981"/>
              <circle cx="12" cy="12" r="10" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.3">
                <animate attributeName="stroke-dasharray" values="0 63;31.5 31.5;63 0" dur="4s" repeatCount="indefinite"/>
              </circle>
              <rect x="6" y="14" width="12" height="8" rx="1" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.7"/>
              <path d="M9 18l2 2 4-4" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.8"/>
            </svg>
          </div>

          {/* Animated Connection Lines */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.2 }} viewBox="0 0 1200 800">
            <path d="M100,100 Q400,200 700,150 T1100,200" fill="none" stroke="url(#connectionGradient)" strokeWidth="2">
              <animate attributeName="stroke-dasharray" values="0 1000;500 500;1000 0" dur="8s" repeatCount="indefinite"/>
            </path>
            <path d="M200,300 Q500,400 800,350 T1000,400" fill="none" stroke="url(#connectionGradient)" strokeWidth="2">
              <animate attributeName="stroke-dasharray" values="1000 0;500 500;0 1000" dur="10s" repeatCount="indefinite"/>
            </path>
            <path d="M150,500 Q450,600 750,550 T1050,600" fill="none" stroke="url(#connectionGradient)" strokeWidth="2">
              <animate attributeName="stroke-dasharray" values="0 1000;500 500;1000 0" dur="12s" repeatCount="indefinite"/>
            </path>
          </svg>

          {/* Blockchain Data Blocks */}
          <div style={{ position: 'absolute', top: '30%', right: '15%', width: '80px', height: '20px' }}>
            <div style={{ 
              display: 'flex', 
              gap: '4px',
              animation: 'slideIn 2s ease-in-out infinite alternate'
            }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  width: '12px',
                  height: '20px',
                  background: `linear-gradient(135deg, #2DD4BF, #3B82F6)`,
                  opacity: 0.4 + (i * 0.1),
                  borderRadius: '2px',
                  animationDelay: `${i * 0.2}s`
                }} />
              ))}
            </div>
          </div>
        </div>
        
        <div style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '3rem',
          position: 'relative',
          zIndex: 10,
          textAlign: 'center'
        }}>
          <div style={{ 
            maxWidth: '900px', 
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'rgba(31, 42, 68, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(45, 212, 191, 0.4)',
              borderRadius: '50px',
              padding: '1rem 2rem',
              marginBottom: '2rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <FaShieldAlt style={{ color: '#2DD4BF' }} />
              <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 500 }}>
                Trusted by 850,000+ professionals
              </span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                paddingLeft: '1rem',
                borderLeft: '1px solid rgba(45, 212, 191, 0.3)',
                marginLeft: '1rem'
              }}>
                <div className="pulse-dot"></div>
                <span style={{ color: '#2DD4BF', fontSize: '0.8rem', fontWeight: 600 }}>Live</span>
              </div>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.8rem, 6vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: 'white',
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em'
            }}>
              Turn Your Skills Into
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #2DD4BF 0%, #3B82F6 50%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Verified Credentials
              </span>
            </h1>
            
            <p style={{
              fontSize: '1.375rem',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '2.5rem',
              fontWeight: 400,
              maxWidth: '700px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Join the world's largest network of blockchain-verified professionals. 
              <span style={{ color: '#2DD4BF', fontWeight: 600 }}> Increase your earning potential by 47%</span> with 
              tamper-proof credentials that employers trust instantly.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem',
              maxWidth: '700px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              <div style={{
                background: 'rgba(31, 42, 68, 0.4)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  margin: '0 auto 1rem auto',
                  background: 'linear-gradient(135deg, #2DD4BF, #10B981)',
                  color: 'white'
                }}>
                  <FaBolt />
                </div>
                <h3 style={{ color: 'white', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Instant verification
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', lineHeight: 1.4 }}>
                  2-second global verification
                </p>
              </div>
              
              <div style={{
                background: 'rgba(31, 42, 68, 0.4)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  margin: '0 auto 1rem auto',
                  background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                  color: 'white'
                }}>
                  <FaShieldAlt />
                </div>
                <h3 style={{ color: 'white', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Blockchain secured
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', lineHeight: 1.4 }}>
                  Tamper-proof credentials
                </p>
              </div>
              
              <div style={{
                background: 'rgba(31, 42, 68, 0.4)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  margin: '0 auto 1rem auto',
                  background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                  color: 'white'
                }}>
                  <FaTrophy />
                </div>
                <h3 style={{ color: 'white', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  90-day guarantee
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', lineHeight: 1.4 }}>
                  Increase earnings or refund
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <Link to="/auth">
                <button style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '1rem',
                  background: 'linear-gradient(135deg, #2DD4BF 0%, #3B82F6 50%, #8B5CF6 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '1.5rem 3rem',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 40px rgba(45, 212, 191, 0.3)',
                  marginBottom: '1.5rem'
                }}>
                  <FaRocket />
                  Get Verified - Free
                </button>
              </Link>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2rem',
                flexWrap: 'wrap'
              }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'rgba(31, 42, 68, 0.6)',
                  backdropFilter: 'blur(15px)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <FaPlay />
                  Watch Demo
                </button>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}>
                  <FaCheckCircle style={{ color: '#10B981' }} />
                  90-day guarantee
                </div>
              </div>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2rem',
                background: 'rgba(31, 42, 68, 0.4)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                flexWrap: 'wrap',
                marginBottom: '2rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 800, 
                    color: '#2DD4BF', 
                    marginBottom: '0.25rem' 
                  }}>850K+</div>
                  <div style={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    fontSize: '0.875rem' 
                  }}>Professionals</div>
                </div>
                <div style={{
                  width: '1px',
                  height: '40px',
                  background: 'rgba(255, 255, 255, 0.2)'
                }}></div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 800, 
                    color: '#2DD4BF', 
                    marginBottom: '0.25rem' 
                  }}>3.2M+</div>
                  <div style={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    fontSize: '0.875rem' 
                  }}>Skills Verified</div>
                </div>
                <div style={{
                  width: '1px',
                  height: '40px',
                  background: 'rgba(255, 255, 255, 0.2)'
                }}></div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 800, 
                    color: '#2DD4BF', 
                    marginBottom: '0.25rem' 
                  }}>+47%</div>
                  <div style={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    fontSize: '0.875rem' 
                  }}>Avg. Increase</div>
                </div>
              </div>

              <div style={{
                background: 'rgba(31, 42, 68, 0.3)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2DD4BF, #3B82F6)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    marginRight: '-10px',
                    border: '3px solid rgba(15, 23, 42, 1)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}>SC</div>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    marginRight: '-10px',
                    border: '3px solid rgba(15, 23, 42, 1)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}>MR</div>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    border: '3px solid rgba(15, 23, 42, 1)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}>JD</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', minWidth: '200px' }}>
                  <p style={{
                    color: 'white',
                    fontStyle: 'italic',
                    marginBottom: '0.5rem',
                    lineHeight: 1.4
                  }}>"Increased my rates by 73% in 3 months"</p>
                  <span style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.875rem'
                  }}>Sarah C., React Developer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section style={{
        padding: '8rem 0',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(31, 42, 68, 0.6) 50%, rgba(15, 23, 42, 0.8) 100%)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: 'left' }}
            >
              <h2 style={{
                fontSize: '3rem',
                fontWeight: 700,
                color: 'white',
                marginBottom: '1.5rem',
                lineHeight: 1.2
              }}>
                Track Your <span style={{ color: '#2DD4BF' }}>Career Growth</span>
              </h2>
              <p style={{
                fontSize: '1.25rem',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.6,
                marginBottom: '2rem'
              }}>
                Monitor your earning potential in real-time. Our dashboard shows you exactly how your verified skills translate to higher income.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <FaCheckCircle style={{ color: '#10B981', fontSize: '1.25rem' }} />
                  <span style={{ color: 'white', fontSize: '1rem' }}>Real-time market rates for your skills</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <FaCheckCircle style={{ color: '#10B981', fontSize: '1.25rem' }} />
                  <span style={{ color: 'white', fontSize: '1rem' }}>Personalized career growth insights</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <FaCheckCircle style={{ color: '#10B981', fontSize: '1.25rem' }} />
                  <span style={{ color: 'white', fontSize: '1rem' }}>Track your earning progress over time</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ position: 'relative', maxWidth: '450px', margin: '0 auto' }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                right: '-20px',
                bottom: '-20px',
                background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.2), rgba(59, 130, 246, 0.2))',
                borderRadius: '32px',
                filter: 'blur(20px)',
                opacity: 0.6
              }}></div>
              
              <div style={{
                background: 'rgba(31, 42, 68, 0.8)',
                backdropFilter: 'blur(25px)',
                border: '1px solid rgba(45, 212, 191, 0.3)',
                borderRadius: '24px',
                padding: '2rem',
                position: 'relative',
                zIndex: 2,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700 }}>
                    Career Growth
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#10B981',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}>
                    <div className="pulse-dot"></div>
                    Live
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.1), rgba(59, 130, 246, 0.1))',
                  border: '1px solid rgba(45, 212, 191, 0.3)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #2DD4BF, #3B82F6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: 'white'
                  }}>
                    <FaRocket />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 800,
                      color: '#2DD4BF',
                      marginBottom: '0.25rem'
                    }}>+47%</div>
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem'
                    }}>Salary Increase</div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      color: '#10B981',
                      fontSize: '0.875rem',
                      fontWeight: 600
                    }}>
                      <FaArrowRight />
                      2sec Verification
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'white',
                      marginBottom: '0.25rem'
                    }}>850K+</div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>Users</div>
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'white',
                      marginBottom: '0.25rem'
                    }}>3.2M+</div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>Skills</div>
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'white',
                      marginBottom: '0.25rem'
                    }}>156</div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>Countries</div>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <h4 style={{
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    marginBottom: '1rem'
                  }}>🏆 Top Earning Skills</h4>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'white',
                      background: 'linear-gradient(135deg, #61DAFB, #21A1B8)'
                    }}>React</div>
                    <div style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'white',
                      background: 'linear-gradient(135deg, #3776AB, #FFD43B)'
                    }}>Python</div>
                    <div style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'white',
                      background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)'
                    }}>AI/ML</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="skills-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2 className="section-title">
              Why Choose <span style={{ color: '#2DD4BF' }}>SkillCert</span>
            </h2>
            <p className="section-subtitle">
              Revolutionary blockchain technology meets intuitive design
            </p>
          </motion.div>

          <div className="skills-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="skill-category-card"
              >
                <div className="skill-category-header">
                  <div className="skill-category-icon" style={{ 
                    background: 'linear-gradient(135deg, #2DD4BF, #3B82F6)',
                    color: 'white'
                  }}>
                    <feature.icon />
                  </div>
                  <h3 className="skill-category-name">{feature.title}</h3>
                </div>
                <p className="skill-category-description">{feature.description}</p>
                <button className="skill-category-btn">
                  Learn More
                  <FaArrowRight />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2 className="section-title">
              Success Stories
            </h2>
            <p className="section-subtitle">
              Real professionals sharing how verification transformed their careers
            </p>
          </motion.div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="testimonial-card"
              >
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="testimonial-meta">
                    <h4>{testimonial.author}</h4>
                    <p>{testimonial.role}</p>
                    <div className="testimonial-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>
                  <div className="testimonial-earnings">+73% earnings</div>
                </div>
                <p className="testimonial-text">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="cta-content"
          >
            <h2 className="cta-title">
              Ready to Transform Your Career?
            </h2>
            
            <p className="cta-subtitle">
              Stop competing on price. Start commanding premium rates with 
              blockchain-verified credentials that Fortune 500 companies trust.
            </p>
            
            <div className="cta-benefits">
              <div className="cta-benefit">
                <FaCheckCircle />
                <span>Instant verification</span>
              </div>
              <div className="cta-benefit">
                <FaShieldAlt />
                <span>Blockchain secured</span>
              </div>
              <div className="cta-benefit">
                <FaTrophy />
                <span>90-day guarantee</span>
              </div>
            </div>
            
            <div className="cta-actions">
              <Link to="/auth">
                <button className="cta-primary-large">
                  <FaRocket />
                  Get Verified - Start Free
                </button>
              </Link>
            </div>

            <div className="cta-secondary-text">
              <FaUsers />
              Join 850,000+ verified professionals • Free to start • No contracts
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="section-container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>SkillCert</h3>
              <p>
                The world's most trusted skill verification platform. Join 850,000+ professionals who've transformed their careers.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link">
                  <FaTwitter />
                </a>
                <a href="#" className="social-link">
                  <FaLinkedin />
                </a>
                <a href="#" className="social-link">
                  <FaGithub />
                </a>
                <a href="#" className="social-link">
                  <FaDiscord />
                </a>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Platform</h4>
                <Link to="/auth">Get Verified</Link>
                <Link to="/verification">Verify Credential</Link>
                <Link to="/dashboard">Dashboard</Link>
              </div>

              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Careers</a>
                <a href="#">Press</a>
              </div>

              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#">Documentation</a>
                <a href="#">Help Center</a>
                <a href="#">Security</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-legal">
              <div>
                © 2025 SkillCert. All rights reserved.
              </div>
              <div className="legal-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ProfessionalLanding