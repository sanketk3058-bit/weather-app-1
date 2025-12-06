'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloud,
  WiCloudy,
  WiShowers,
  WiDayRain,
  WiNightAltRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
  WiDaySunnyOvercast
} from 'react-icons/wi'
import { IconType } from 'react-icons'

/**
 * Props for the WeatherIcon component.
 */
interface WeatherIconProps {
  /** Weather condition description (e.g., "light rain") - used for animation logic */
  condition: string
  /** OpenWeatherMap icon code (e.g., "01d") */
  icon?: string
  /** Size of the icon in pixels. Defaults to 64. */
  size?: number
  /** Additional CSS classes */
  className?: string
  /** Whether to enable hover animations. Defaults to true. */
  enableHoverAnimation?: boolean
}

// Map OpenWeatherMap icon codes to React Icons and Colors
// This configuration object maps API icon codes to specific React components and color schemes.
const iconConfig: Record<string, { component: IconType, color: string, hoverColor: string }> = {
  '01d': { component: WiDaySunny, color: '#F59E0B', hoverColor: '#FBBF24' }, // Clear Day - Amber
  '01n': { component: WiNightClear, color: '#60A5FA', hoverColor: '#93C5FD' }, // Clear Night - Blue
  '02d': { component: WiDayCloudy, color: '#FCD34D', hoverColor: '#FDE68A' }, // Few Clouds Day - Light Amber
  '02n': { component: WiNightAltCloudy, color: '#818CF8', hoverColor: '#A5B4FC' }, // Few Clouds Night - Indigo
  '03d': { component: WiCloud, color: '#9CA3AF', hoverColor: '#D1D5DB' }, // Scattered Clouds - Gray
  '03n': { component: WiCloud, color: '#9CA3AF', hoverColor: '#D1D5DB' },
  '04d': { component: WiCloudy, color: '#6B7280', hoverColor: '#9CA3AF' }, // Broken Clouds - Darker Gray
  '04n': { component: WiCloudy, color: '#6B7280', hoverColor: '#9CA3AF' },
  '09d': { component: WiShowers, color: '#3B82F6', hoverColor: '#60A5FA' }, // Shower Rain - Blue
  '09n': { component: WiShowers, color: '#3B82F6', hoverColor: '#60A5FA' },
  '10d': { component: WiDayRain, color: '#2563EB', hoverColor: '#3B82F6' }, // Rain Day - Darker Blue
  '10n': { component: WiNightAltRain, color: '#2563EB', hoverColor: '#3B82F6' }, // Rain Night
  '11d': { component: WiThunderstorm, color: '#7C3AED', hoverColor: '#8B5CF6' }, // Thunderstorm - Purple
  '11n': { component: WiThunderstorm, color: '#7C3AED', hoverColor: '#8B5CF6' },
  '13d': { component: WiSnow, color: '#E5E7EB', hoverColor: '#F3F4F6' }, // Snow - White/Gray
  '13n': { component: WiSnow, color: '#E5E7EB', hoverColor: '#F3F4F6' }, // Snow Night
  '50d': { component: WiFog, color: '#D1D5DB', hoverColor: '#E5E7EB' }, // Mist - Light Gray
  '50n': { component: WiFog, color: '#D1D5DB', hoverColor: '#E5E7EB' }, // Mist Night
}

/**
 * Component to display an animated weather icon based on the weather condition.
 * Uses Framer Motion for animations and React Icons for the iconography.
 * 
 * @param props - Configuration for the icon
 */
export function WeatherIcon({
  condition,
  icon,
  size = 64,
  className = '',
  enableHoverAnimation = true
}: WeatherIconProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Default to sunny/clear if icon not found in config
  const config = icon && iconConfig[icon] ? iconConfig[icon] : iconConfig['01d']
  const IconComponent = config.component

  /**
   * Determine animation variants based on the weather condition.
   * Returns a Framer Motion Variants object.
   */
  const getAnimationVariants = (): Variants => {
    // Rain/Shower conditions: Vertical movement (falling rain effect)
    if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('shower')) {
      return {
        animate: {
          y: [0, -5, 0],
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        },
        hover: {
          scale: 1.1,
          rotate: [0, -5, 5, 0],
          transition: { duration: 0.3 }
        }
      }
    } 
    // Storm/Thunder conditions: Pulsing and brightness flash
    else if (condition.toLowerCase().includes('storm') || condition.toLowerCase().includes('thunder')) {
      return {
        animate: {
          scale: [1, 1.05, 1],
          filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'],
          transition: { duration: 0.5, repeat: Infinity, repeatDelay: 3 }
        },
        hover: {
          scale: 1.1,
          rotate: [0, -2, 2, 0],
          transition: { duration: 0.3 }
        }
      }
    } 
    // Snow conditions: Gentle rocking
    else if (condition.toLowerCase().includes('snow')) {
      return {
        animate: {
          rotate: [0, 5, -5, 0],
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        },
        hover: {
          scale: 1.1,
          rotate: 180,
          transition: { duration: 0.8 }
        }
      }
    } else if (condition.toLowerCase().includes('clear') || condition.toLowerCase().includes('sun')) {
      return {
        animate: {
          rotate: [0, 360],
          transition: { duration: 20, repeat: Infinity, ease: 'linear' }
        },
        hover: {
          scale: 1.2,
          rotate: [0, 90],
          transition: { duration: 1, ease: 'easeOut' }
        }
      }
    }

    // Default/Cloudy
    return {
      animate: {
        x: [0, 5, 0],
        transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
      },
      hover: {
        scale: 1.1,
        x: 0,
        transition: { duration: 0.3 }
      }
    }
  }

  const variants = getAnimationVariants()

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center text-foreground dark:text-foreground ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => enableHoverAnimation && setIsHovered(true)}
      onMouseLeave={() => enableHoverAnimation && setIsHovered(false)}
      initial="initial"
      animate="animate"
      whileHover={enableHoverAnimation ? "hover" : undefined}
    >
      <AnimatePresence mode='wait'>
        <motion.div
          key={icon} // Animate when icon changes
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: 1,
            color: isHovered ? config.hoverColor : config.color
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          variants={variants}
        >
          <IconComponent size={size} />
        </motion.div>
      </AnimatePresence>

      {/* Particle Effects Layer (Optional, can be expanded) */}
      {condition.toLowerCase().includes('rain') && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
          {/* Simple CSS rain effect could go here if needed, but keeping it clean for now */}
        </div>
      )}
    </motion.div>
  )
}
