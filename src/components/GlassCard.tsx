import React from 'react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'tertiary'
  rounded?: boolean
  shadow?: boolean
  animateHover?: 'lift' | 'scale' | 'both' | 'none'
  enablePressFeedback?: boolean
  style?: React.CSSProperties
}

export function GlassCard({ 
  children, 
  className = '', 
  variant = 'primary',
  rounded = true,
  shadow = true,
  animateHover = 'lift',
  enablePressFeedback = false,
  style = {}
}: GlassCardProps) {
  const variantClasses = {
    primary: 'glass-card-primary',
    secondary: 'glass-card-secondary',
    tertiary: 'glass-card-tertiary',
  }

  const roundedClasses = rounded ? 'rounded-3xl' : ''
  const shadowClasses = shadow ? 'shadow-xl' : ''
  
  // Determine hover animation classes based on variant and prop
  const getHoverClasses = () => {
    if (animateHover === 'none') return ''

    // If an explicit scale animation is requested, prefer it regardless of variant
    if (animateHover === 'scale') return 'scale-on-hover'

    // If both animations requested, combine classes
    if (animateHover === 'both') return 'lift-on-hover scale-on-hover'

    // Default lift behavior varies slightly by variant
    switch (variant) {
      case 'primary':
        return 'lift-on-hover'
      case 'secondary':
        return 'lift-sm-on-hover'
      case 'tertiary':
      default:
        return 'lift-sm-on-hover'
    }
  }

  const pressFeedbackClass = enablePressFeedback ? 'press-feedback' : ''

  return (
    <div 
      className={`
        glass-card
        ${variantClasses[variant]}
        ${roundedClasses}
        ${shadowClasses}
        ${getHoverClasses()}
        ${pressFeedbackClass}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      style={style}
    >
      {children}
    </div>
  )
}