import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
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

// Clean card component
const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`} {...props}>
    {children}
  </div>
)

// Modern button component
const Button = ({ children, variant = "primary", size = "default", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-500"
  }
  
  const sizes = {
    small: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg"
  }
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
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
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <FaShieldAlt className="text-white text-lg" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">SkillCert</span>
                <div className="text-xs text-gray-500">Verified Skills Platform</div>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/verification" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                <FaEye className="text-sm" />
                Verify
              </Link>
              <Link to="/auth">
                <Button>Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
                <FaShieldAlt className="text-blue-600 text-sm" />
                <span className="text-sm font-semibold text-blue-900">
                  Trusted by 850,000+ professionals
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Turn Your Skills Into
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Verified Credentials
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Join the world's largest network of blockchain-verified professionals. 
                <span className="font-semibold text-gray-900"> Increase your earning potential by 47%</span> with 
                tamper-proof credentials that employers trust instantly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="large" className="flex items-center gap-2">
                    <FaRocket />
                    Get Verified - Free
                  </Button>
                </Link>
                
                <Button variant="outline" size="large" className="flex items-center gap-2">
                  <FaPlay />
                  Watch Demo
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-emerald-500" />
                  <span className="text-gray-600">Instant verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaShieldAlt className="text-blue-500" />
                  <span className="text-gray-600">Blockchain secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaTrophy className="text-purple-500" />
                  <span className="text-gray-600">90-day guarantee</span>
                </div>
              </div>
            </motion.div>

            {/* Right Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Card className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaRocket className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Career Growth</h3>
                  <p className="text-gray-600">What verified professionals achieve</p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 mb-1">+47%</div>
                    <div className="text-sm text-gray-600">Salary Increase</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">2sec</div>
                    <div className="text-sm text-gray-600">Verification</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold mb-4">🏆 Top Earning Skills</h4>
                  {skills.map((skill, index) => (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <skill.icon className="text-blue-600" />
                        <span className="font-medium text-sm">{skill.name}</span>
                      </div>
                      <div className="font-bold text-sm">{skill.rate}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Leading Companies
            </h2>
            <p className="text-gray-600 text-lg">
              Fortune 500 companies use SkillCert to hire verified talent
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="text-white text-lg" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="text-blue-600">SkillCert</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionary blockchain technology meets intuitive design
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="p-8 h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real professionals sharing how verification transformed their careers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        "{testimonial.quote}"
                      </p>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                        <div className="flex items-center mt-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className="text-yellow-400 text-sm" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Career?
              </h2>
              
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                Stop competing on price. Start commanding premium rates with 
                blockchain-verified credentials that Fortune 500 companies trust.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Link to="/auth">
                  <Button size="large" className="flex items-center gap-2">
                    <FaRocket />
                    Get Verified - Start Free
                  </Button>
                </Link>
                
                <Link to="/verification">
                  <Button variant="outline" size="large" className="flex items-center gap-2">
                    <FaEye />
                    See Live Demo
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-gray-500">
                Join 850,000+ verified professionals • Free to start • No contracts
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FaShieldAlt className="text-white text-lg" />
                </div>
                <div>
                  <span className="text-xl font-bold">SkillCert</span>
                  <div className="text-xs text-gray-400">Verified Skills Platform</div>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The world's most trusted skill verification platform. Join 850,000+ professionals who've transformed their careers.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors">
                  <FaTwitter />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors">
                  <FaLinkedin />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors">
                  <FaGithub />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors">
                  <FaDiscord />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <div className="space-y-3">
                <Link to="/auth" className="block text-gray-400 hover:text-white transition-colors">Get Verified</Link>
                <Link to="/verification" className="block text-gray-400 hover:text-white transition-colors">Verify Credential</Link>
                <Link to="/dashboard" className="block text-gray-400 hover:text-white transition-colors">Dashboard</Link>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Documentation</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Security</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 SkillCert. All rights reserved.
              </div>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ProfessionalLanding