import * as React from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, Box, OrbitControls } from "@react-three/drei"
import { animated, useSpring } from "@react-spring/three"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

const AnimatedBox = animated(Box)

function Badge3DModel({ skill = "React", color = "#2DD4BF", isHovered = false }) {
  const meshRef = React.useRef()
  
  // Auto-rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  // Spring animation for hover
  const { scale, position } = useSpring({
    scale: isHovered ? 1.2 : 1,
    position: isHovered ? [0, 0.5, 0] : [0, 0, 0],
    config: { tension: 300, friction: 30 }
  })

  return (
    <AnimatedBox
      ref={meshRef}
      scale={scale}
      position={position}
      args={[2, 2, 0.3]}
      rotation={[0, 0, 0]}
    >
      <meshPhysicalMaterial
        color={color}
        metalness={0.8}
        roughness={0.2}
        clearcoat={1}
        clearcoatRoughness={0.1}
        transmission={0.1}
        thickness={0.1}
      />
      <Text
        position={[0, 0, 0.16]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {skill}
      </Text>
    </AnimatedBox>
  )
}

const ThreeDBadge = ({ 
  skill = "React", 
  color = "#2DD4BF", 
  className,
  size = "default",
  ...props 
}) => {
  const [isHovered, setIsHovered] = React.useState(false)

  const sizeClasses = {
    small: "w-24 h-24",
    default: "w-32 h-32",
    large: "w-40 h-40"
  }

  return (
    <motion.div
      className={cn("relative", sizeClasses[size], className)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3B82F6" />
        <Badge3DModel skill={skill} color={color} isHovered={isHovered} />
      </Canvas>
      
      {/* Glow effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl blur-xl opacity-30 transition-opacity duration-300",
          isHovered && "opacity-60"
        )}
        style={{
          background: `radial-gradient(circle, ${color}40, transparent 70%)`
        }}
      />
    </motion.div>
  )
}

export { ThreeDBadge }