import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSpring, animated } from '@react-spring/web'
import Confetti from 'react-confetti'
import { 
  FaShieldAlt, 
  FaGlobeAmericas, 
  FaChartLine, 
  FaEnvelope, 
  FaGithub, 
  FaLinkedin,
  FaCube,
  FaCheckCircle,
  FaArrowRight,
  FaPlay,
  FaStar,
  FaUsers,
  FaDollarSign,
  FaLock,
  FaClock
} from 'react-icons/fa'
import { MdBadge, MdTrendingUp, MdVerified } from 'react-icons/md'

const Landing = () => {
  const [showConfetti, setShowConfetti] = useState(false)
  const [formData, setFormData] = useState({ email: '', name: '' })

  // 3D blockchain node animation
  const nodeAnimation = useSpring({
    from: { rotateZ: 0 },
    to: { rotateZ: 360 },
    config: { duration: 20000 },
    loop: true
  })

  // Hero animations
  const heroFade = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  }

  const cardFade = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.2 }
  }

  const handlePrimaryCTA = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
    // Navigate to sign up
    window.location.href = '/dashboard'
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          colors={['#2DD4BF', '#3B82F6']}
          numberOfPieces={200}
          recycle={false}
        />
      )}

      {/* Navigation */}
      <nav className="nav-bar">
        <div className="nav-content">
          <a href="#" className="nav-logo">
            <div className="nav-logo-icon">
              <MdVerified />
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>SkillCert</span>
          </a>
          <div className="nav-items">
            <a href="#how-it-works" className="nav-item">
              <button className="neumorphic-btn sm">How It Works</button>
            </a>
            <a href="#pricing" className="nav-item">
              <button className="neumorphic-btn sm">Pricing</button>
            </a>
            <button className="neumorphic-btn primary" onClick={handlePrimaryCTA}>
              Start Free Trial
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero" style={{ paddingTop: '6rem' }}>
        {/* Animated 3D blockchain nodes */}
        <animated.div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            ...nodeAnimation
          }}
        >
          <FaCube style={{ fontSize: '3rem', color: 'rgba(45, 212, 191, 0.3)' }} />
        </animated.div>
        <animated.div
          style={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            ...nodeAnimation,
            animationDelay: '10s'
          }}
        >
          <FaCube style={{ fontSize: '2.5rem', color: 'rgba(59, 130, 246, 0.3)' }} />
        </animated.div>

        <div className="landing-content">
          <motion.div {...heroFade}>
            {/* Problem Hook */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: '2rem' }}
            >
              <span className="text-accent" style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                Stop Losing Projects to Trust Issues
              </span>
            </motion.div>
            
            <h1 className="hero-title">
              Turn Your Skills Into <span className="gradient-text">Unquestionable Credentials</span>
            </h1>
            <p className="hero-subtitle">
              Join 10,000+ professionals who've eliminated "trust barriers" and increased their project rates by an average of 40% with blockchain-verified credentials that clients can't question.
            </p>
            
            {/* Trust Indicators */}
            <motion.div 
              className="trust-indicators"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                marginBottom: '3rem',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaUsers style={{ color: 'var(--teal)', fontSize: '1.2rem' }} />
                <span className="body-text" style={{ fontSize: '0.9rem' }}>10,000+ Professionals</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MdTrendingUp style={{ color: 'var(--green)', fontSize: '1.2rem' }} />
                <span className="body-text" style={{ fontSize: '0.9rem' }}>40% Higher Rates</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaLock style={{ color: 'var(--blue)', fontSize: '1.2rem' }} />
                <span className="body-text" style={{ fontSize: '0.9rem' }}>100% Tamper-Proof</span>
              </div>
            </motion.div>
            
            <div style={{ marginBottom: '3rem' }}>
              <motion.button
                className="btn-primary"
                onClick={handlePrimaryCTA}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  marginRight: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1.1rem',
                  padding: '1.25rem 2.5rem'
                }}
              >
                Start Building Your Portfolio
                <FaArrowRight style={{ fontSize: '1rem' }} />
              </motion.button>
              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaPlay style={{ fontSize: '0.9rem' }} />
                Watch 2-Min Demo
              </motion.button>
            </div>
            
            {/* Risk Reversal */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-accent" 
              style={{ 
                fontSize: '0.85rem',
                marginBottom: '2rem'
              }}
            >
              <FaClock style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Free 30-day trial • No credit card required • Setup in under 5 minutes
            </motion.p>
          </motion.div>

        </div>
      </section>

      {/* Problem Statement Section */}
      <section style={{ 
        padding: '6rem 0',
        background: 'rgba(31, 42, 68, 0.3)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(45, 212, 191, 0.3)',
        borderBottom: '1px solid rgba(45, 212, 191, 0.3)'
      }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
          >
            <h2 className="heading-h2" style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>
              The <span className="gradient-text">$127 Billion Trust Problem</span>
            </h2>
            <p className="body-text" style={{ 
              fontSize: '1.2rem',
              lineHeight: '1.8',
              marginBottom: '3rem',
              color: 'var(--light-gray)'
            }}>
              In the gig economy, <strong style={{ color: 'var(--teal)' }}>73% of high-paying projects</strong> go to professionals who can prove their expertise instantly. Without verifiable credentials, you're competing on price, not premium value.
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginTop: '3rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: '#ef4444',
                  marginBottom: '0.5rem'
                }}>
                  47%
                </div>
                <p className="body-text" style={{ fontSize: '0.9rem' }}>
                  Projects lost due to credential verification delays
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: '#ef4444',
                  marginBottom: '0.5rem'
                }}>
                  $15K
                </div>
                <p className="body-text" style={{ fontSize: '0.9rem' }}>
                  Average annual income lost to trust issues
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: '#ef4444',
                  marginBottom: '0.5rem'
                }}>
                  3x
                </div>
                <p className="body-text" style={{ fontSize: '0.9rem' }}>
                  Longer sales cycles without verified credentials
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features as Benefits Section */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 className="heading-h2" style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>
              Stop Competing on Price. Start Commanding Premium Rates.
            </h2>
            <p className="body-text" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Transform how clients perceive your expertise with credentials they can verify in seconds
            </p>
          </motion.div>
          
          <motion.div className="features-grid" {...cardFade}>
            {/* Benefit 1: Instant Trust */}
            <motion.div
              className="feature-card"
              whileHover={{ 
                rotateX: 5,
                rotateY: 5,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <MdBadge style={{ 
                  fontSize: '3rem', 
                  color: 'var(--teal)',
                  filter: 'drop-shadow(0 0 10px rgba(45, 212, 191, 0.5))'
                }} />
              </div>
              <h3 className="heading-h2" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                Never Lose a Client to "Fake Resume" Concerns Again
              </h3>
              <p className="body-text" style={{ marginBottom: '1.5rem' }}>
                Blockchain verification means clients trust your credentials instantly - no more lengthy vetting processes or lost opportunities.
              </p>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: 'var(--green)',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                <FaCheckCircle />
                <span>Verified in under 10 seconds</span>
              </div>
            </motion.div>

            {/* Benefit 2: Global Acceptance */}
            <motion.div
              className="feature-card"
              whileHover={{ 
                rotateX: 5,
                rotateY: 5,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <FaGlobeAmericas style={{ 
                  fontSize: '3rem', 
                  color: 'var(--blue)',
                  filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))'
                }} />
              </div>
              <h3 className="heading-h2" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                Win International Projects Without Question
              </h3>
              <p className="body-text" style={{ marginBottom: '1.5rem' }}>
                Your credentials are accepted worldwide. Skip the "are you qualified?" conversation and jump straight to project terms.
              </p>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: 'var(--green)',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                <FaCheckCircle />
                <span>Accepted in 195+ countries</span>
              </div>
            </motion.div>

            {/* Benefit 3: Increasing Value */}
            <motion.div
              className="feature-card"
              whileHover={{ 
                rotateX: 5,
                rotateY: 5,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <FaDollarSign style={{ 
                  fontSize: '3rem', 
                  color: 'var(--green)',
                  filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))'
                }} />
              </div>
              <h3 className="heading-h2" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                Watch Your Market Value Rise in Real-Time
              </h3>
              <p className="body-text" style={{ marginBottom: '1.5rem' }}>
                Visual proof of your growing expertise helps you justify premium rates and attract higher-value clients.
              </p>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: 'var(--green)',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                <FaCheckCircle />
                <span>Average 40% rate increase</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Company Trust Section */}
      <section style={{ 
        padding: '4rem 0',
        background: 'white',
        borderTop: '1px solid #F3F4F6',
        borderBottom: '1px solid #F3F4F6'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 style={{ 
              fontSize: '2.25rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem',
              lineHeight: '1.1'
            }}>
              Trusted by Leading Companies
            </h2>
            <p style={{ 
              fontSize: '1.1rem',
              color: '#6B7280',
              lineHeight: '1.6'
            }}>
              Fortune 500 companies use SkillCert to hire verified talent
            </p>
          </motion.div>
          
          {/* Company logos grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
            opacity: 0.6
          }}>
            {/* Placeholder company logos */}
            <div style={{
              height: '60px',
              background: '#F3F4F6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}>
              Microsoft
            </div>
            <div style={{
              height: '60px',
              background: '#F3F4F6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}>
              Google
            </div>
            <div style={{
              height: '60px',
              background: '#F3F4F6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}>
              Amazon
            </div>
            <div style={{
              height: '60px',
              background: '#F3F4F6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}>
              IBM
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ 
        padding: '6rem 0',
        background: 'white' 
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 style={{ 
              fontSize: '2.75rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem',
              lineHeight: '1.1'
            }}>
              From Signup to Premium Rates in{' '}
              <span style={{
                background: 'linear-gradient(135deg, #0891B2 0%, #2563EB 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}>
                3 Simple Steps
              </span>
            </h2>
            <p style={{ 
              fontSize: '1.2rem',
              color: '#6B7280',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Start building your verified credential portfolio today
            </p>
          </motion.div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {/* Step 1 */}
            <motion.div 
              style={{ 
                textAlign: 'center',
                background: 'white',
                padding: '3rem 2rem',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #F3F4F6'
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #0891B2 0%, #2563EB 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '2rem',
                color: 'white',
                fontWeight: 'bold'
              }}>
                1
              </div>
              <h3 style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '1rem',
                lineHeight: '1.3'
              }}>
                Complete Skill Tasks
              </h3>
              <p style={{
                color: '#6B7280',
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                Choose from 200+ skill assessments across tech, design, marketing, and business. Complete real-world projects that prove your expertise.
              </p>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div 
              style={{ 
                textAlign: 'center',
                background: 'white',
                padding: '3rem 2rem',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #F3F4F6'
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '2rem',
                color: 'white',
                fontWeight: 'bold'
              }}>
                2
              </div>
              <h3 style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '1rem',
                lineHeight: '1.3'
              }}>
                Get Blockchain Verification
              </h3>
              <p style={{
                color: '#6B7280',
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                Your completed tasks are reviewed by industry experts and permanently recorded on the blockchain. No one can fake or forge your credentials.
              </p>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div 
              style={{ 
                textAlign: 'center',
                background: 'white',
                padding: '3rem 2rem',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #F3F4F6'
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '2rem',
                color: 'white',
                fontWeight: 'bold'
              }}>
                3
              </div>
              <h3 style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '1rem',
                lineHeight: '1.3'
              }}>
                Command Premium Rates
              </h3>
              <p style={{
                color: '#6B7280',
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                Share your verified credential profile with clients. Skip the qualification conversation and focus on project terms and premium pricing.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section style={{ 
        padding: '6rem 0',
        background: 'linear-gradient(135deg, var(--blue), var(--teal), var(--purple))',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(31, 42, 68, 0.8)',
          backdropFilter: 'blur(1px)'
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div 
            className="cta-section"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{
              background: 'rgba(31, 42, 68, 0.4)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(45, 212, 191, 0.6)',
              padding: '4rem',
              maxWidth: '600px'
            }}
          >
            <h2 className="heading-h2" style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>
              Stop Competing on Price. <span className="gradient-text">Start Today.</span>
            </h2>
            <p className="body-text" style={{ 
              marginBottom: '3rem',
              fontSize: '1.2rem',
              lineHeight: '1.7'
            }}>
              Join 10,000+ professionals who've transformed their freelance careers. Build your first verified credential in under 30 minutes.
            </p>
            
            {/* Urgency Element */}
            <motion.div 
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid var(--green)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '2rem',
                textAlign: 'center'
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <span style={{ 
                color: 'var(--green)',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                🔥 LIMITED TIME: Skip the waitlist with code LAUNCH2024
              </span>
            </motion.div>
            
            <form onSubmit={handleFormSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <motion.input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid transparent',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  whileFocus={{
                    borderColor: 'var(--teal)',
                    boxShadow: '0 0 0 2px rgba(45, 212, 191, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)'
                  }}
                />
                <motion.input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid transparent',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  whileFocus={{
                    borderColor: 'var(--teal)',
                    boxShadow: '0 0 0 2px rgba(45, 212, 191, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)'
                  }}
                />
              </div>
              
              <motion.button
                type="submit"
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  width: '100%',
                  padding: '1.25rem 2rem',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  marginBottom: '1rem'
                }}
              >
                Start My Free 30-Day Trial
              </motion.button>
              
              <p className="text-accent" style={{ 
                fontSize: '0.85rem',
                textAlign: 'center'
              }}>
                <FaLock style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                No credit card required • Cancel anytime • Setup in 5 minutes
              </p>
            </form>
            
            {/* Value Reinforcement */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              marginTop: '3rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  color: 'var(--teal)',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  10,000+
                </div>
                <div className="body-text" style={{ fontSize: '0.8rem' }}>Active Users</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  color: 'var(--green)',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  40%
                </div>
                <div className="body-text" style={{ fontSize: '0.8rem' }}>Avg Rate Increase</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  color: 'var(--blue)',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  4.9/5
                </div>
                <div className="body-text" style={{ fontSize: '0.8rem' }}>User Rating</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-links">
          <a href="#about" className="footer-link">About</a>
          <a href="#how-it-works" className="footer-link">How It Works</a>
          <a href="mailto:yhengdesigns@gmail.com" className="footer-link">Contact</a>
        </div>
        
        <div className="social-links">
          <a href="mailto:yhengdesigns@gmail.com" className="social-icon">
            <FaEnvelope />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaGithub />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaLinkedin />
          </a>
        </div>
        
        <p className="text-accent" style={{ marginTop: '2rem' }}>
          © 2024 SkillCert. Empowering the future of work through blockchain verification.
        </p>
      </footer>
    </>
  )
}

export default Landing