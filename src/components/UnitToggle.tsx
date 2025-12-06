import React from 'react'
import { GlassCard } from './GlassCard'

/**
 * Props for the UnitToggle component.
 */
interface UnitToggleProps {
    /** Current unit system ('metric' for Celsius, 'imperial' for Fahrenheit) */
    unit: 'metric' | 'imperial'
    /** Callback function triggered when the unit is toggled */
    onToggle: (unit: 'metric' | 'imperial') => void
}

/**
 * Component to toggle between Metric (°C) and Imperial (°F) units.
 * Uses a pill-shaped design with glassmorphism effects.
 * 
 * @param props - Contains current unit and toggle handler
 */
export function UnitToggle({ unit, onToggle }: UnitToggleProps) {
    return (
        <div className="flex items-center glass-card-secondary text-foreground rounded-full p-1">
            {/* Celsius Button */}
            <button
                onClick={() => onToggle('metric')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${unit === 'metric'
                        ? 'glass-card-primary text-foreground shadow-sm' // Active state
                        : 'text-foreground/60 hover:text-foreground'     // Inactive state
                    }`}
                aria-label="Switch to Celsius"
                aria-pressed={unit === 'metric'}
            >
                °C
            </button>
            
            {/* Fahrenheit Button */}
            <button
                onClick={() => onToggle('imperial')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${unit === 'imperial'
                        ? 'glass-card-primary text-foreground shadow-sm' // Active state
                        : 'text-foreground/60 hover:text-foreground'     // Inactive state
                    }`}
                aria-label="Switch to Fahrenheit"
                aria-pressed={unit === 'imperial'}
            >
                °F
            </button>
        </div>
    )
}
