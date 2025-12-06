import React from 'react'

/**
 * Props for the GlassCard component.
 * Defines the styling and behavior options for the glassmorphism container.
 */
interface GlassCardProps {
  /** The content to be rendered inside the card */
  children: React.ReactNode
  /** Additional CSS classes to apply to the container */
  className?: string
  /** Visual variant of the glass effect:
   * - 'primary': High opacity, used for main containers
   * - 'secondary': Medium opacity, used for nested elements
   * - 'tertiary': Low opacity, used for subtle backgrounds
   */
  variant?: 'primary' | 'secondary' | 'tertiary'
  /** Whether to apply rounded corners (rounded-3xl). Defaults to true. */
  rounded?: boolean
  /** Whether to apply a shadow (shadow-xl). Defaults to true. */
  shadow?: boolean
  /** Hover animation behavior:
   * - 'lift': Moves up slightly on hover
   * - 'scale': Increases size slightly on hover
   * - 'both': Applies both lift and scale
   * - 'none': No hover animation
   */
  animateHover?: 'lift' | 'scale' | 'both' | 'none'
  /** Whether to show visual feedback (scale down) on click/press. Defaults to false. */
  enablePressFeedback?: boolean
  /** Inline styles for dynamic overrides */
  style?: React.CSSProperties
}

/**
 * A reusable container component implementing the "Glassmorphism" design aesthetic.
 * It uses semi-transparent backgrounds, blur effects, and subtle borders to create a glass-like look.
 * 
 * @param props - The configuration props for the card
 * @returns A styled div element wrapping the children
 */
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
  // Map variant names to their corresponding CSS classes defined in globals.css
  const variantClasses = {
    primary: 'glass-card-primary',
    secondary: 'glass-card-secondary',
    tertiary: 'glass-card-tertiary',
  }

  // Conditionally apply utility classes based on props
  const roundedClasses = rounded ? 'rounded-3xl' : ''
  const shadowClasses = shadow ? 'shadow-xl' : ''
  
  /**
   * Helper function to determine the appropriate hover animation classes.
   * Logic is based on the `animateHover` prop and the card's `variant`.
   */
  const getHoverClasses = () => {
    if (animateHover === 'none') return ''

    // If an explicit scale animation is requested, prefer it regardless of variant
    if (animateHover === 'scale') return 'scale-on-hover'

    // If both animations requested, combine classes
    if (animateHover === 'both') return 'lift-on-hover scale-on-hover'

    // Default lift behavior varies slightly by variant to create depth hierarchy
    switch (variant) {
      case 'primary':
        // Primary cards lift more significantly
        return 'lift-on-hover'
      case 'secondary':
        // Secondary cards have a subtle lift
        return 'lift-sm-on-hover'
      case 'tertiary':
      default:
        // Tertiary cards also have a subtle lift
        return 'lift-sm-on-hover'
    }
  }

  // Apply press feedback class if enabled
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
      `.trim().replace(/\s+/g, ' ')} // Clean up extra whitespace in class string
      style={style}
    >
      {children}
    </div>
  )
}