'use client'

import React from 'react'
import { GlassCard } from './GlassCard'

interface UnitToggleProps {
    unit: 'metric' | 'imperial'
    onToggle: (unit: 'metric' | 'imperial') => void
}

export function UnitToggle({ unit, onToggle }: UnitToggleProps) {
    return (
        <div className="flex items-center glass-card-secondary text-foreground rounded-full p-1">
            <button
                onClick={() => onToggle('metric')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${unit === 'metric'
                        ? 'glass-card-primary text-foreground shadow-sm'
                        : 'text-foreground/60 hover:text-foreground'
                    }`}
                aria-label="Switch to Celsius"
                aria-pressed={unit === 'metric'}
            >
                °C
            </button>
            <button
                onClick={() => onToggle('imperial')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${unit === 'imperial'
                        ? 'glass-card-primary text-foreground shadow-sm'
                        : 'text-foreground/60 hover:text-foreground'
                    }`}
                aria-label="Switch to Fahrenheit"
                aria-pressed={unit === 'imperial'}
            >
                °F
            </button>
        </div>
    )
}
