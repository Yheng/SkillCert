import * as React from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, Text, Box } from "@react-three/drei"
import { motion } from "framer-motion"
import { animated, useSpring } from "@react-spring/three"
import { NeumorphicButton } from "./shared/NeumorphicButton"
import { AuroraToast } from "./shared/AuroraToast"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"

const AnimatedSphere = animated(Sphere)
const AnimatedBox = animated(Box)

function BlockchainNode({ position, color, size = 0.5, rotationSpeed = 1 }) {
  const meshRef = React.useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * rotationSpeed * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed * 0.5
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * rotationSpeed) * 0.3
    }
  })

  const { scale } = useSpring({
    scale: 1,
    from: { scale: 0 },
    config: { tension: 300, friction: 30 },
    loop: { reverse: true, delay: Math.random() * 2000 }
  })

  return (
    <AnimatedSphere
      ref={meshRef}
      position={position}
      scale={scale.to(s => s * size)}
      args={[size, 16, 16]}
    >
      <meshPhysicalMaterial
        color={color}
        metalness={0.8}
        roughness={0.2}
        clearcoat={1}
        clearcoatRoughness={0.1}
        transmission={0.2}
        thickness={0.5}
      />
    </AnimatedSphere>
  )
}

function BlockchainCube({ position, color, size = 0.8 }) {
  const meshRef = React.useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <AnimatedBox
      ref={meshRef}
      position={position}
      args={[size, size, size]}
    >
      <meshPhysicalMaterial
        color={color}
        metalness={0.9}
        roughness={0.1}
        clearcoat={1}
        clearcoatRoughness={0}
        wireframe={true}
      />
    </AnimatedBox>
  )
}

function BlockchainScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#2DD4BF" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3B82F6" />
      <pointLight position={[0, 0, -10]} intensity={0.4} color="#8B5CF6" />
      
      {/* Blockchain nodes */}
      <BlockchainNode position={[-2, 1, 0]} color="#2DD4BF" size={0.6} rotationSpeed={0.8} />
      <BlockchainNode position={[2, -1, -1]} color="#3B82F6" size={0.5} rotationSpeed={1.2} />
      <BlockchainNode position={[0, 2, 1]} color="#8B5CF6" size={0.7} rotationSpeed={0.6} />
      <BlockchainNode position={[-1.5, -1.5, 1]} color="#10B981" size={0.4} rotationSpeed={1.5} />
      <BlockchainNode position={[3, 1.5, -0.5]} color="#2DD4BF" size={0.5} rotationSpeed={0.9} />
      
      {/* Blockchain cubes for variety */}
      <BlockchainCube position={[1, 0, 2]} color="#3B82F6" size={0.6} />
      <BlockchainCube position={[-3, 0, -2]} color="#8B5CF6" size={0.5} />
    </>
  )
}

const Hero = () => {
  const [showConfetti, setShowConfetti] = React.useState(false)
  const { width, height } = useWindowSize()

  const handleGetStarted = () => {
    setShowConfetti(true)
    AuroraToast.success("Welcome to SkillCert!", {
      title: "Explore the Future of Skills",
    })
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const handleVerifyCredential = () => {
    AuroraToast.info("Navigate to verification to check credentials", {
      title: "Credential Verification",
    })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background with aurora effect */}
      <div className="absolute inset-0 aurora-bg opacity-20" />
      
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-40">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          style={{ background: 'transparent' }}
        >
          <BlockchainScene />
        </Canvas>
      </div>

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" />

      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          colors={['#2DD4BF', '#3B82F6', '#8B5CF6', '#10B981']}
        />
      )}

      {/* Hero Content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-4 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Main Headline */}
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6 text-gradient leading-tight"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Unlock Your Potential with
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-skill-teal via-skill-blue to-skill-purple">
            Blockchain-Verified Skills
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Earn micro-credentials, prove your expertise, and stand out in the $400B gig economy. 
          Join the decentralized future of professional verification.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <NeumorphicButton
            size="lg"
            variant="primary"
            onClick={handleGetStarted}
            className="text-lg px-8 py-4 min-w-[200px]"
          >
            Start Earning Credentials
          </NeumorphicButton>
          
          <NeumorphicButton
            size="lg"
            variant="default"
            onClick={handleVerifyCredential}
            className="text-lg px-8 py-4 min-w-[200px]"
          >
            Verify a Credential
          </NeumorphicButton>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div
            className="glass-card p-6 text-center"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-skill-teal to-skill-blue rounded-full flex items-center justify-center">
              <span className="text-2xl">🔐</span>
            </div>
            <h3 className="text-xl font-semibold text-gradient mb-2">Tamper-Proof</h3>
            <p className="text-gray-300">Blockchain technology ensures your credentials cannot be forged or modified.</p>
          </motion.div>

          <motion.div
            className="glass-card p-6 text-center"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-skill-blue to-skill-purple rounded-full flex items-center justify-center">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-xl font-semibold text-gradient mb-2">Global Verification</h3>
            <p className="text-gray-300">Instantly verifiable worldwide by any employer or organization.</p>
          </motion.div>

          <motion.div
            className="glass-card p-6 text-center"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-skill-purple to-skill-green rounded-full flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-xl font-semibold text-gradient mb-2">Track Progress</h3>
            <p className="text-gray-300">Visualize your skill development journey with beautiful analytics.</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export { Hero }