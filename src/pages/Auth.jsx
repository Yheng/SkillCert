import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSpring, animated } from '@react-spring/web'
import Confetti from 'react-confetti'
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaGraduationCap,
  FaBriefcase,
  FaCogs,
  FaUserTie,
  FaRocket,
  FaArrowRight
} from 'react-icons/fa'
import backendService from '../api/backend'

const Auth = () => {
  const [isSignup, setIsSignup] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    primarySkill: ''
  })
  const [errors, setErrors] = useState({})

  // 3D floating animation
  const floatAnimation = useSpring({
    from: { transform: 'translateY(0px)' },
    to: { transform: 'translateY(-10px)' },
    config: { duration: 2000 },
    loop: { reverse: true }
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (isSignup && !formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (isSignup && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (isSignup && !formData.role) {
      newErrors.role = 'Please select your role'
    }
    
    if (isSignup && formData.role === 'freelancer' && !formData.primarySkill.trim()) {
      newErrors.primarySkill = 'Primary skill is required for freelancers'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setLoading(true)
      
      let result
      if (isSignup) {
        result = await backendService.register(formData)
      } else {
        result = await backendService.login({
          email: formData.email,
          password: formData.password
        })
      }
      
      if (result.success) {
        setShowConfetti(true)
        setTimeout(() => {
          setShowConfetti(false)
          // Redirect based on user role
          const userRole = result.user?.role || 'freelancer'
          switch (userRole) {
            case 'educator':
              window.location.href = '/educator-dashboard'
              break
            case 'employer':
              window.location.href = '/verification'
              break
            case 'admin':
              window.location.href = '/admin-dashboard'
              break
            default:
              window.location.href = '/dashboard'
          }
        }, 2000)
      } else {
        setErrors({ submit: result.error || 'Authentication failed' })
      }
    } catch (error) {
      console.error('Auth error:', error)
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    {
      value: 'freelancer',
      icon: FaUser,
      title: 'Freelancer',
      description: 'Earn blockchain-verified credentials for your skills',
      color: 'var(--blue)'
    },
    {
      value: 'educator',
      icon: FaGraduationCap,
      title: 'Educator',
      description: 'Create tasks and issue credentials to learners',
      color: 'var(--green)'
    },
    {
      value: 'employer',
      icon: FaBriefcase,
      title: 'Employer',
      description: 'Verify candidate credentials and hire with confidence',
      color: 'var(--purple)'
    },
    {
      value: 'admin',
      icon: FaCogs,
      title: 'Administrator',
      description: 'Manage the platform and oversee operations',
      color: 'var(--teal)'
    }
  ]

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          colors={['#2DD4BF', '#3B82F6', '#8B5CF6']}
          numberOfPieces={200}
          recycle={false}
        />
      )}

      <div className="tasks-container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <animated.div style={floatAnimation}>
              <FaRocket style={{ 
                fontSize: '3rem', 
                color: 'var(--teal)', 
                marginBottom: '1rem' 
              }} />
            </animated.div>
            <h1 className="heading-h1" style={{ marginBottom: '0.5rem' }}>
              {isSignup ? 'Join SkillCert' : 'Welcome Back'}
            </h1>
            <p className="body-text">
              {isSignup 
                ? 'Start earning blockchain-verified credentials today'
                : 'Sign in to manage your credentials'
              }
            </p>
          </motion.div>

          {/* Auth Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="card"
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
              {/* Name Field (Signup only) */}
              {isSignup && (
                <div className="form-field">
                  <div className="form-field-label">
                    <FaUser />
                    Full Name
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="form-field-input"
                    disabled={loading}
                  />
                  {errors.name && <div className="form-validation error">{errors.name}</div>}
                </div>
              )}

              {/* Email Field */}
              <div className="form-field">
                <div className="form-field-label">
                  <FaEnvelope />
                  Email Address
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="form-field-input"
                  disabled={loading}
                />
                {errors.email && <div className="form-validation error">{errors.email}</div>}
              </div>

              {/* Password Field */}
              <div className="form-field">
                <div className="form-field-label">
                  <FaLock />
                  Password
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="form-field-input"
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
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <div className="form-validation error">{errors.password}</div>}
              </div>

              {/* Role Selection (Signup only) */}
              {isSignup && (
                <div className="form-field">
                  <div className="form-field-label">
                    <FaUserTie />
                    I am a...
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '1rem' 
                  }}>
                    {roleOptions.map(role => (
                      <motion.button
                        key={role.value}
                        type="button"
                        className={`skill-suggestion ${formData.role === role.value ? 'selected' : ''}`}
                        style={{
                          padding: '1.5rem 1rem',
                          textAlign: 'center',
                          borderColor: formData.role === role.value ? 'var(--teal)' : 'rgba(255, 255, 255, 0.2)'
                        }}
                        onClick={() => handleInputChange({ target: { name: 'role', value: role.value } })}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <role.icon style={{ 
                          fontSize: '2rem', 
                          color: role.color, 
                          marginBottom: '0.5rem' 
                        }} />
                        <div className="skill-suggestion-title">{role.title}</div>
                        <div className="skill-suggestion-desc" style={{ fontSize: '0.75rem' }}>
                          {role.description}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  {errors.role && <div className="form-validation error">{errors.role}</div>}
                </div>
              )}

              {/* Primary Skill (Freelancer only) */}
              {isSignup && formData.role === 'freelancer' && (
                <div className="form-field">
                  <div className="form-field-label">Primary Skill</div>
                  <select
                    name="primarySkill"
                    value={formData.primarySkill}
                    onChange={handleInputChange}
                    className="form-field-input"
                    disabled={loading}
                  >
                    <option value="">Select your primary skill</option>
                    <option value="React Development">React Development</option>
                    <option value="Python Programming">Python Programming</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Blockchain">Blockchain Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Content Writing">Content Writing</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.primarySkill && <div className="form-validation error">{errors.primarySkill}</div>}
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                style={{ 
                  marginTop: 'var(--space-xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-sm)'
                }}
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <div className="spinner" style={{ 
                    width: '1.5rem', 
                    height: '1.5rem',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                ) : (
                  <>
                    {isSignup ? 'Create Account' : 'Sign In'}
                    <FaArrowRight />
                  </>
                )}
              </motion.button>

              {errors.submit && (
                <div className="form-error" style={{ textAlign: 'center', marginTop: '1rem' }}>
                  {errors.submit}
                </div>
              )}
            </form>

            {/* Toggle Auth Mode */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <p className="body-text" style={{ marginBottom: '1rem' }}>
                {isSignup 
                  ? 'Already have an account?' 
                  : "Don't have an account?"
                }
              </p>
              <motion.button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup)
                  setFormData({ name: '', email: '', password: '', role: '', primarySkill: '' })
                  setErrors({})
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--teal)',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
                whileHover={{ color: 'var(--blue)' }}
              >
                {isSignup ? 'Sign In Instead' : 'Create Account'}
              </motion.button>
            </div>
          </motion.div>

          {/* Trust Signals */}
          {isSignup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ 
                textAlign: 'center', 
                marginTop: '2rem',
                fontSize: '0.875rem',
                color: 'var(--light-gray)',
                opacity: 0.8
              }}
            >
              🔒 Your data is encrypted and secure<br />
              🎯 Join 10,000+ verified professionals<br />
              ⚡ Get verified in 24 hours
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}

export default Auth