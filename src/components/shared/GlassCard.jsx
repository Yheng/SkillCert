import * as React from "react"
import { motion } from "framer-motion"

const GlassCard = React.forwardRef(({ 
  className = "", 
  children, 
  animate = true,
  delay = 0,
  style,
  ...props 
}, ref) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: delay,
        ease: "easeOut"
      }
    }
  }

  const CardComponent = animate ? motion.div : "div"
  const motionProps = animate ? {
    initial: "hidden",
    animate: "visible",
    variants: cardVariants,
    whileHover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  } : {}

  return (
    <CardComponent
      ref={ref}
      className={`glass-card ${className}`}
      style={{
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
        transition: 'all 0.3s ease',
        ...style
      }}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  )
})

GlassCard.displayName = "GlassCard"

export { GlassCard }