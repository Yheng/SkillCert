import * as React from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, Box, Sphere, Ring, useTexture } from "@react-three/drei"
import { animated, useSpring } from "@react-spring/three"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"
import * as THREE from "three"

const AnimatedBox = animated(Box)
const AnimatedSphere = animated(Sphere)
const AnimatedRing = animated(Ring)

function FloatingParticles({ count = 20 }) {
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4
      ],
      speed: Math.random() * 0.02 + 0.01
    }))
  }, [count])

  return (
    <>
      {particles.map((particle) => (
        <FloatingParticle key={particle.id} {...particle} />
      ))}
    </>
  )
}

function FloatingParticle({ position, speed }) {
  const ref = React.useRef()
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.01
      ref.current.rotation.z = state.clock.elapsedTime * speed
    }
  })

  return (
    <Sphere ref={ref} position={position} args={[0.02, 8, 8]}>
      <meshBasicMaterial color="#2DD4BF" transparent opacity={0.6} />
    </Sphere>
  )
}

function Badge3DModel({ skill = "React", color = "#2DD4BF", isHovered = false, verified = false }) {
  const meshRef = React.useRef()
  const ringRef = React.useRef()
  const auraRef = React.useRef()
  
  // Auto-rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
    
    if (ringRef.current && verified) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5
    }
    
    if (auraRef.current) {
      auraRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  // Spring animation for hover
  const { scale, position, ringScale } = useSpring({
    scale: isHovered ? 1.2 : 1,
    position: isHovered ? [0, 0.5, 0] : [0, 0, 0],
    ringScale: isHovered ? 1.3 : 1.1,
    config: { tension: 300, friction: 30 }
  })

  // Skill abbreviation for badge display
  const skillAbbrev = React.useMemo(() => {
    if (skill.length <= 4) return skill
    return skill.split(' ').map(word => word[0]).join('').slice(0, 4).toUpperCase()
  }, [skill])

  return (
    <group>
      {/* Background aura */}
      <AnimatedSphere
        ref={auraRef}
        scale={[3, 3, 3]}
        position={[0, 0, -1]}
      >
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </AnimatedSphere>

      {/* Verification ring */}
      {verified && (
        <AnimatedRing
          ref={ringRef}
          scale={ringScale}
          args={[2.2, 2.5, 64]}
          rotation={[0, 0, 0]}
        >
          <meshBasicMaterial
            color="#10B981"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </AnimatedRing>
      )}

      {/* Main badge */}
      <AnimatedBox
        ref={meshRef}
        scale={scale}
        position={position}
        args={[2, 2, 0.4]}
        rotation={[0, 0, 0]}
      >
        <meshPhysicalMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.05}
          transmission={0.05}
          thickness={0.2}
          envMapIntensity={1}
        />
        
        {/* Badge text */}
        <Text
          position={[0, 0, 0.21]}
          fontSize={0.35}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {skillAbbrev}
        </Text>
        
        {/* Blockchain verification indicator */}
        {verified && (
          <Sphere position={[0.7, 0.7, 0.21]} args={[0.15, 16, 16]}>
            <meshBasicMaterial color="#10B981" />
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.1}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              ✓
            </Text>
          </Sphere>
        )}
      </AnimatedBox>

      {/* Floating particles for premium effect */}
      {verified && <FloatingParticles count={12} />}
    </group>
  )
}

const ThreeDBadge = ({ 
  skill = "React", 
  color = "#2DD4BF", 
  className,
  size = "default",
  verified = false,
  animated = true,
  ...props 
}) => {
  const [isHovered, setIsHovered] = React.useState(false)

  const sizeClasses = {
    small: "w-20 h-20",
    default: "w-32 h-32",
    large: "w-48 h-48"
  }

  return (
    <motion.div
      className={cn("relative", sizeClasses[size], className)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: animated ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        {/* Lighting setup for premium look */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={0.6} 
          color="#ffffff"
          castShadow 
        />
        <pointLight position={[5, 5, 5]} intensity={0.4} color={color} />
        <pointLight position={[-5, -5, 5]} intensity={0.3} color="#3B82F6" />
        <spotLight
          position={[0, 5, 5]}
          intensity={0.5}
          angle={0.3}
          penumbra={1}
          color="#ffffff"
        />
        
        <Badge3DModel 
          skill={skill} 
          color={color} 
          isHovered={isHovered} 
          verified={verified}
        />
      </Canvas>
      
      {/* Multi-layer glow effects */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl transition-all duration-500 ease-out",
          isHovered ? "opacity-80 scale-110" : "opacity-40 scale-100"
        )}
        style={{
          background: `radial-gradient(circle at center, ${color}30 0%, ${color}15 40%, transparent 70%)`,
          filter: 'blur(20px)',
          zIndex: -1
        }}
      />
      
      {/* Outer aurora ring */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl transition-all duration-700 ease-out",
          isHovered ? "opacity-60 scale-125" : "opacity-20 scale-105"
        )}
        style={{
          background: `conic-gradient(from 0deg, ${color}20, #3B82F620, #8B5CF620, ${color}20)`,
          filter: 'blur(30px)',
          zIndex: -2
        }}
      />

      {/* Verification indicator overlay */}
      {verified && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
          style={{ zIndex: 10 }}
        >
          ✓
        </motion.div>
      )}

      {/* Skill name tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          y: isHovered ? -40 : -30
        }}
        transition={{ duration: 0.2 }}
        className="absolute left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
        style={{ zIndex: 20 }}
      >
        {skill}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
      </motion.div>
    </motion.div>
  )
}

export { ThreeDBadge }