import React from 'react'

/**
 * Props for the WeatherIconSkeleton component.
 */
interface WeatherIconSkeletonProps {
    /** Size of the skeleton in pixels. Defaults to 64. */
    size?: number
    /** Additional CSS classes */
    className?: string
}

/**
 * Loading skeleton for the WeatherIcon component.
 * Displays an animated circular placeholder matching the icon dimensions.
 * Used during lazy loading of the heavy WeatherIcon component.
 */
export function WeatherIconSkeleton({ size = 64, className = '' }: WeatherIconSkeletonProps) {
    return (
        <div
            className={`relative inline-flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Inner pulsing circle representing the icon body */}
            <div
                className="rounded-full bg-white/10 animate-pulse"
                style={{ width: size * 0.8, height: size * 0.8 }}
            />
        </div>
    )
}
