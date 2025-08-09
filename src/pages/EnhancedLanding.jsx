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
  FaStar,
  FaQuoteLeft,
  FaDollarSign,
  FaClock,
  FaUsers,
  FaTrophy,
  FaRocket,
  FaLightbulb,
  FaQuestion,
  FaTimes,
  FaPlus,
  FaArrowRight,
  FaPlay
} from 'react-icons/fa'
import { MdBadge, MdTrendingUp, MdVerified } from 'react-icons/md'

const EnhancedLanding = () => {
  const [showConfetti, setShowConfetti] = useState(false)
  const [formData, setFormData] = useState({ email: '', name: '', role: '' })
  const [openFAQ, setOpenFAQ] = useState(null)

  // 3D blockchain node animation
  const nodeAnimation = useSpring({
    from: { rotateZ: 0 },
    to: { rotateZ: 360 },
    config: { duration: 20000 },
    loop: true
  })

  const handlePrimaryCTA = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
    // Navigate to auth page
    window.location.href = '/auth'
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
    console.log('Form submitted:', formData)
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
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

      {/* Hero Section */}
      <section className="landing-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Animated Background Elements */}
        <animated.div
          style={{
            position: 'absolute',
            top: '15%',
            left: '8%',
            ...nodeAnimation
          }}
        >
          <FaCube style={{ fontSize: '2.5rem', color: 'rgba(45, 212, 191, 0.2)' }} />
        </animated.div>
        <animated.div
          style={{
            position: 'absolute',
            top: '65%',
            right: '12%',
            ...nodeAnimation,
            animationDelay: '10s'
          }}
        >
          <FaCube style={{ fontSize: '2rem', color: 'rgba(59, 130, 246, 0.2)' }} />
        </animated.div>
        <animated.div
          style={{
            position: 'absolute',
            top: '45%',
            left: '85%',
            ...nodeAnimation,
            animationDelay: '5s'
          }}
        >
          <MdVerified style={{ fontSize: '1.8rem', color: 'rgba(139, 92, 246, 0.2)' }} />
        </animated.div>

        <div className="landing-content">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Social Proof Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(45, 212, 191, 0.1)',
                border: '1px solid rgba(45, 212, 191, 0.3)',
                borderRadius: '25px',
                padding: '0.5rem 1rem',
                marginBottom: '2rem',
                fontSize: '0.875rem',
                color: 'var(--teal)'
              }}
            >
              <FaTrophy /> Trusted by 10,000+ professionals • 40% average rate increase
            </motion.div>

            {/* Main Headline */}
            <h1 
              className="hero-title" 
              style={{ 
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                lineHeight: '1.1',
                marginBottom: '1.5rem' 
              }}
            >
              Stop Losing Clients to{' '}
              <span style={{ color: 'var(--teal)' }}>Trust Issues.</span><br />
              Start Proving Your Skills with{' '}
              <span className="gradient-text">Blockchain</span>
            </h1>

            {/* Value Proposition */}
            <p 
              className="hero-subtitle" 
              style={{ 
                fontSize: '1.375rem',
                lineHeight: '1.6',
                marginBottom: '2rem',
                maxWidth: '680px' 
              }}
            >
              Join thousands of freelancers earning <strong>40% higher rates</strong> with 
              tamper-proof credentials that clients trust instantly.
            </p>

            {/* Key Benefits */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem', 
              marginBottom: '3rem',
              maxWidth: '600px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaCheckCircle style={{ color: 'var(--green)', fontSize: '1.125rem' }} />
                <span style={{ color: 'var(--light-gray)' }}>Verify in 24 hours</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaCheckCircle style={{ color: 'var(--green)', fontSize: '1.125rem' }} />
                <span style={{ color: 'var(--light-gray)' }}>Globally recognized</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaCheckCircle style={{ color: 'var(--green)', fontSize: '1.125rem' }} />
                <span style={{ color: 'var(--light-gray)' }}>Unhackable proof</span>
              </div>
            </div>

            {/* Primary CTA Section */}
            <div style={{ marginBottom: '3rem' }}>
              <motion.button
                className="btn-primary"
                onClick={handlePrimaryCTA}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  marginRight: '1rem',
                  fontSize: '1.125rem',
                  padding: '1rem 2.5rem'
                }}
              >
                Start Free Trial <FaArrowRight style={{ marginLeft: '0.5rem' }} />
              </motion.button>
              <motion.button
                style={{
                  background: 'transparent',
                  border: '2px solid var(--teal)',
                  color: 'var(--teal)',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1.125rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ 
                  backgroundColor: 'rgba(45, 212, 191, 0.1)',
                  scale: 1.02 
                }}
                whileTap={{ scale: 0.98 }}
              >
                <FaPlay /> Watch Demo (2 min)
              </motion.button>
            </div>

            {/* Risk-Free Guarantee */}
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'var(--light-gray)', 
              opacity: 0.8 
            }}>
              🛡️ 30-day money-back guarantee • No credit card required
            </p>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section style={{ 
        padding: '4rem 0', 
        background: 'rgba(31, 42, 68, 0.3)',
        borderTop: '1px solid rgba(45, 212, 191, 0.1)'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'var(--light-gray)', 
              marginBottom: '2rem',
              opacity: 0.8 
            }}>
              TRUSTED BY PROFESSIONALS AT
            </p>
            
            {/* Company Logos Placeholder */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '3rem', 
              flexWrap: 'wrap',
              marginBottom: '3rem' 
            }}>
              {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'].map((company, index) => (
                <div
                  key={company}
                  style={{
                    padding: '0.5rem 1.5rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    color: 'var(--light-gray)',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {company}
                </div>
              ))}
            </div>

            {/* Key Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '2rem',
              maxWidth: '800px',
              margin: '0 auto' 
            }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--teal)' }}>10,000+</div>
                <div style={{ color: 'var(--light-gray)' }}>Verified Professionals</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--blue)' }}>40%</div>
                <div style={{ color: 'var(--light-gray)' }}>Average Rate Increase</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--green)' }}>24hr</div>
                <div style={{ color: 'var(--light-gray)' }}>Verification Time</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--purple)' }}>99.9%</div>
                <div style={{ color: 'var(--light-gray)' }}>Uptime Guarantee</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '4rem', 
            alignItems: 'center' 
          }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="heading-h1" style={{ marginBottom: '2rem' }}>
                Tired of Clients Who Don't{' '}
                <span style={{ color: 'var(--teal)' }}>Trust</span> Your Skills?
              </h2>
              
              <div style={{ marginBottom: '2rem' }}>
                {[
                  'Clients choosing cheaper competitors over you',
                  'Hours wasted explaining your qualifications',
                  'Projects lost to "more credible" freelancers',
                  'Constant requests for "proof" of your abilities'
                ].map((problem, index) => (
                  <div 
                    key={index}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '1rem', 
                      marginBottom: '1rem' 
                    }}
                  >
                    <FaTimes style={{ color: '#ef4444', fontSize: '1.125rem', marginTop: '0.25rem' }} />
                    <span className="body-text">{problem}</span>
                  </div>
                ))}
              </div>

              <p className="body-text" style={{ fontSize: '1.125rem', fontStyle: 'italic' }}>
                Sound familiar? You're not alone. 73% of freelancers lose projects due to trust issues.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <FaShieldAlt style={{ 
                  fontSize: '4rem', 
                  color: 'var(--teal)', 
                  marginBottom: '1.5rem' 
                }} />
                <h3 className="heading-h2" style={{ marginBottom: '1rem' }}>
                  SkillCert Changes Everything
                </h3>
                <p className="body-text" style={{ marginBottom: '1.5rem' }}>
                  Blockchain-verified credentials that clients trust instantly. 
                  No more explaining, no more proving – just winning.
                </p>
                <div style={{ 
                  background: 'rgba(45, 212, 191, 0.1)', 
                  border: '1px solid rgba(45, 212, 191, 0.3)',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <strong style={{ color: 'var(--teal)' }}>
                    "I increased my rates by 45% in my first month" - Sarah K., React Developer
                  </strong>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ 
        padding: '6rem 0', 
        background: 'rgba(31, 42, 68, 0.2)' 
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 className="heading-h1" style={{ marginBottom: '1rem' }}>
              Why SkillCert Freelancers Earn More
            </h2>
            <p className="subheading" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Transform your credibility from questionable to unquestionable
            </p>
          </motion.div>

          <div className="features-grid">
            {[
              {
                icon: MdTrendingUp,
                title: 'Instant Credibility',
                description: 'Clients see verified proof of your skills before they even talk to you. No more trust barriers.',
                benefit: '40% higher response rates'
              },
              {
                icon: FaDollarSign,
                title: 'Premium Pricing Power',
                description: 'Charge premium rates with confidence. Verified experts command respect and better compensation.',
                benefit: '40% average rate increase'
              },
              {
                icon: FaRocket,
                title: 'Faster Project Wins',
                description: 'Skip the lengthy qualification process. Clients hire you faster when they trust your credentials.',
                benefit: '60% shorter sales cycles'
              },
              {
                icon: FaShieldAlt,
                title: 'Unhackable Verification',
                description: 'Blockchain technology makes your credentials impossible to fake or tamper with.',
                benefit: '100% tamper-proof'
              },
              {
                icon: FaGlobeAmericas,
                title: 'Global Recognition',
                description: 'Your credentials work worldwide. No geographic limits on your earning potential.',
                benefit: 'Works in 195+ countries'
              },
              {
                icon: FaClock,
                title: 'Lifetime Value',
                description: 'Your verified credentials never expire and grow more valuable as you add new skills.',
                benefit: 'Permanent asset'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  rotateX: 5,
                  rotateY: 5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ marginBottom: '1.5rem' }}>
                  <feature.icon style={{ 
                    fontSize: '3rem', 
                    color: 'var(--teal)',
                    filter: 'drop-shadow(0 0 10px rgba(45, 212, 191, 0.3))'
                  }} />
                </div>
                <h3 className="heading-h2" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                  {feature.title}
                </h3>
                <p className="body-text" style={{ marginBottom: '1rem' }}>
                  {feature.description}
                </p>
                <div style={{
                  background: 'linear-gradient(45deg, var(--teal), var(--blue))',
                  borderRadius: '20px',
                  padding: '0.5rem 1rem',
                  display: 'inline-block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  {feature.benefit}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 className="heading-h1" style={{ marginBottom: '1rem' }}>
              Real Results from Real Freelancers
            </h2>
            <p className="subheading">
              See how SkillCert is transforming careers worldwide
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '2rem' 
          }}>
            {[
              {
                name: "Sarah Chen",
                role: "React Developer",
                company: "Freelancer",
                image: "👩‍💻",
                quote: "My rates went from $45/hr to $75/hr in just 6 weeks. Clients now come to me instead of the other way around.",
                result: "67% rate increase"
              },
              {
                name: "Marcus Rodriguez",
                role: "UX Designer", 
                company: "Design Consultant",
                image: "👨‍🎨",
                quote: "I used to spend hours explaining my background. Now clients see my verified credentials and hire me on the spot.",
                result: "50% faster hiring"
              },
              {
                name: "Emily Watson",
                role: "Python Developer",
                company: "AI Consultant",
                image: "👩‍💼",
                quote: "The blockchain verification gives me instant credibility. I've closed 3 major projects just this month.",
                result: "$15K+ monthly increase"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="glass-card"
                style={{ padding: '2rem', position: 'relative' }}
              >
                <FaQuoteLeft style={{ 
                  fontSize: '1.5rem', 
                  color: 'var(--teal)', 
                  opacity: 0.3, 
                  marginBottom: '1rem' 
                }} />
                <p className="body-text" style={{ 
                  fontSize: '1.125rem', 
                  lineHeight: '1.6', 
                  marginBottom: '1.5rem',
                  fontStyle: 'italic'
                }}>
                  "{testimonial.quote}"
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  marginBottom: '1rem' 
                }}>
                  <div style={{ 
                    fontSize: '3rem',
                    filter: 'grayscale(100%)'
                  }}>
                    {testimonial.image}
                  </div>
                  <div>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: 'white', 
                      marginBottom: '0.25rem' 
                    }}>
                      {testimonial.name}
                    </div>
                    <div style={{ 
                      color: 'var(--light-gray)', 
                      fontSize: '0.875rem' 
                    }}>
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '20px',
                  padding: '0.5rem 1rem',
                  display: 'inline-block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--green)'
                }}>
                  🎯 {testimonial.result}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ 
        padding: '6rem 0', 
        background: 'rgba(31, 42, 68, 0.2)' 
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 className="heading-h1" style={{ marginBottom: '1rem' }}>
              Frequently Asked Questions
            </h2>
            <p className="subheading">
              Everything you need to know about SkillCert
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              {
                question: "How do I know employers will accept blockchain credentials?",
                answer: "95% of Fortune 500 companies already accept blockchain-verified credentials. Major platforms like LinkedIn, Upwork, and Fiverr are integrating blockchain verification. We're ahead of the curve."
              },
              {
                question: "What if I'm not technical enough?",
                answer: "No technical knowledge required. Our platform is designed for all skill levels - if you can use email, you can use SkillCert. The entire process is point-and-click simple."
              },
              {
                question: "How long does verification take?",
                answer: "Most credentials are verified within 24-48 hours. We offer rush verification for premium users (4-8 hours). Our expert reviewers work around the clock."
              },
              {
                question: "Can I really increase my rates by 40%?",
                answer: "Our user data shows an average 40% rate increase within 90 days. Some users see increases up to 67%. Results vary by skill level and industry, but the credibility boost is universal."
              },
              {
                question: "What happens if a client questions my credentials?",
                answer: "They can instantly verify them on the blockchain - no third party needed. The verification is tamper-proof and permanent. Most clients never question blockchain-verified credentials."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card"
                style={{ 
                  padding: 0,
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
                onClick={() => toggleFAQ(index)}
              >
                <div style={{ 
                  padding: '1.5rem 2rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h3 style={{ 
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: 'white',
                    margin: 0
                  }}>
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openFAQ === index ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaPlus style={{ color: 'var(--teal)' }} />
                  </motion.div>
                </div>
                
                <motion.div
                  initial={false}
                  animate={{ 
                    height: openFAQ === index ? 'auto' : 0,
                    opacity: openFAQ === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ 
                    padding: '0 2rem 1.5rem 2rem',
                    borderTop: '1px solid rgba(45, 212, 191, 0.2)'
                  }}>
                    <p className="body-text" style={{ 
                      lineHeight: '1.6',
                      margin: '1rem 0 0 0'
                    }}>
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card"
            style={{ 
              padding: '4rem 2rem', 
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.1), rgba(59, 130, 246, 0.1))',
              border: '1px solid rgba(45, 212, 191, 0.3)'
            }}
          >
            <h2 className="heading-h1" style={{ marginBottom: '1rem' }}>
              Ready to <span className="gradient-text">Transform</span> Your Career?
            </h2>
            <p className="subheading" style={{ 
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: '0 auto 2rem auto'
            }}>
              Join 10,000+ professionals who've already boosted their rates and credibility with SkillCert.
            </p>

            {/* Enhanced Form */}
            <form 
              onSubmit={handleFormSubmit} 
              style={{ 
                maxWidth: '500px', 
                margin: '0 auto 2rem auto',
                background: 'rgba(31, 42, 68, 0.5)',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid rgba(45, 212, 191, 0.2)'
              }}
            >
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem', 
                marginBottom: '1rem' 
              }}>
                <motion.input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  whileFocus={{
                    borderColor: 'var(--teal)',
                    boxShadow: '0 0 0 2px rgba(45, 212, 191, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)'
                  }}
                />
                <motion.input
                  type="email"
                  name="email"
                  placeholder="Work Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  whileFocus={{
                    borderColor: 'var(--teal)',
                    boxShadow: '0 0 0 2px rgba(45, 212, 191, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)'
                  }}
                />
              </div>
              <motion.select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="form-input"
                style={{ marginBottom: '1.5rem' }}
                whileFocus={{
                  borderColor: 'var(--teal)',
                  boxShadow: '0 0 0 2px rgba(45, 212, 191, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)'
                }}
              >
                <option value="">Select Your Primary Skill</option>
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="marketer">Marketer</option>
                <option value="consultant">Consultant</option>
                <option value="other">Other</option>
              </motion.select>
              <motion.button
                type="submit"
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  width: '100%',
                  fontSize: '1.125rem',
                  padding: '1rem 2rem'
                }}
              >
                Start My Free Trial <FaRocket style={{ marginLeft: '0.5rem' }} />
              </motion.button>
            </form>

            {/* Trust Signals */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              color: 'var(--light-gray)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaCheckCircle style={{ color: 'var(--green)' }} />
                30-day money-back guarantee
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaCheckCircle style={{ color: 'var(--green)' }} />
                No credit card required
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaCheckCircle style={{ color: 'var(--green)' }} />
                Cancel anytime
              </div>
            </div>

            <p style={{ 
              fontSize: '0.75rem', 
              color: 'var(--light-gray)', 
              opacity: 0.7 
            }}>
              By starting your trial, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-links">
          <a href="#about" className="footer-link">About</a>
          <a href="#how-it-works" className="footer-link">How It Works</a>
          <a href="#pricing" className="footer-link">Pricing</a>
          <a href="#help" className="footer-link">Help Center</a>
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
          © 2024 SkillCert. Empowering professionals worldwide with blockchain-verified credentials.
        </p>
      </footer>
    </>
  )
}

export default EnhancedLanding