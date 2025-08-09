import * as React from "react"

const Card = React.forwardRef(({ className = "", style, ...props }, ref) => (
  <div
    ref={ref}
    className={`glass-card ${className}`}
    style={{ 
      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
      transition: 'all 0.3s ease',
      ...style 
    }}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className = "", style, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '0.375rem', 
      padding: '1.5rem',
      ...style 
    }}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className = "", style, ...props }, ref) => (
  <h3
    ref={ref}
    className={`gradient-text ${className}`}
    style={{ 
      fontSize: '1.5rem', 
      fontWeight: '600', 
      lineHeight: '1', 
      letterSpacing: '-0.025em',
      margin: 0,
      ...style 
    }}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className = "", style, ...props }, ref) => (
  <p
    ref={ref}
    className={className}
    style={{ 
      fontSize: '0.875rem', 
      color: 'var(--light-gray)', 
      opacity: 0.8,
      margin: 0,
      ...style 
    }}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className = "", style, ...props }, ref) => (
  <div 
    ref={ref} 
    className={className} 
    style={{ 
      padding: '1.5rem', 
      paddingTop: 0, 
      ...style 
    }} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className = "", style, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      padding: '1.5rem', 
      paddingTop: 0, 
      ...style 
    }}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }