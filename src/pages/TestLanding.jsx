import React from "react"

const TestLanding = () => {
  return (
    <div className="hero" style={{ marginTop: '-64px' }}>
      <div className="container">
        <h1 className="gradient-text">SkillCert</h1>
        <p>Blockchain-verified skill credentials for the future of work</p>
        <div className="glass-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Get Started</h2>
          <button className="gradient-button" style={{ width: '100%' }}>
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestLanding