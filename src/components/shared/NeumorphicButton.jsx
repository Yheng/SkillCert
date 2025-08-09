import * as React from "react"
import { motion } from "framer-motion"

const NeumorphicButton = React.forwardRef(({ 
  className = "", 
  children, 
  variant = "default",
  size = "default",
  animate = true,
  onClick,
  ...props 
}, ref) => {
  const [isPressed, setIsPressed] = React.useState(false)

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  }

  const handleClick = (e) => {
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)
    if (onClick) onClick(e)
  }

  const ButtonComponent = animate ? motion.button : "button"
  const motionProps = animate ? {
    variants: buttonVariants,
    whileHover: "hover",
    whileTap: "tap"
  } : {}

  // Combine CSS classes
  const combinedClassName = `neumorphic-btn ${variant} ${size} ${className}`.trim()

  return (
    <ButtonComponent
      ref={ref}
      className={combinedClassName}
      onClick={handleClick}
      {...motionProps}
      {...props}
    >
      {children}
    </ButtonComponent>
  )
})

NeumorphicButton.displayName = "NeumorphicButton"

export { NeumorphicButton }