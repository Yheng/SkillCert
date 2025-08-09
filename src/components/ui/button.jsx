import * as React from "react"

const Button = React.forwardRef(({ 
  className = "", 
  variant = "default", 
  size = "default", 
  style,
  ...props 
}, ref) => {
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'neumorphic':
        return {
          background: '#1e293b',
          color: 'var(--blue)',
          border: 'none',
          boxShadow: '8px 8px 16px #0f172a, -8px -8px 16px #334155',
        }
      case 'glass':
        return {
          background: 'rgba(31, 42, 68, 0.2)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(8px)',
        }
      case 'primary':
        return {
          background: 'linear-gradient(45deg, var(--teal), var(--blue))',
          color: 'white',
          border: 'none',
        }
      default:
        return {
          background: 'var(--blue)',
          color: 'white',
          border: 'none',
        }
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          height: '2.25rem',
        }
      case 'lg':
        return {
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          height: '2.75rem',
        }
      default:
        return {
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          height: '2.5rem',
        }
    }
  }

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
  }

  const hoverStyles = {
    '&:hover': variant === 'neumorphic' 
      ? { 
          background: 'linear-gradient(45deg, var(--teal), var(--blue))', 
          color: 'white',
          boxShadow: '4px 4px 8px #0f172a, -4px -4px 8px #334155',
        }
      : variant === 'glass'
      ? { background: 'rgba(255, 255, 255, 0.2)' }
      : { transform: 'translateY(-1px)', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }
  }

  const combinedStyles = {
    ...baseStyles,
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style
  }

  return (
    <button
      ref={ref}
      className={className}
      style={combinedStyles}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }