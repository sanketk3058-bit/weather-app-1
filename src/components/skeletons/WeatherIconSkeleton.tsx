import React from 'react'

interface WeatherIconSkeletonProps {
    size?: number
    className?: string
}

/**
 * Loading skeleton for WeatherIcon component.
 * Displays an animated circular placeholder matching the icon dimensions.
 */
export function WeatherIconSkeleton({ size = 64, className = '' }: WeatherIconSkeletonProps) {
    return (
        <div
            className={`relative inline-flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            <div
                className="rounded-full bg-white/10 animate-pulse"
                style={{ width: size * 0.8, height: size * 0.8 }}
            />
        </div>
    )
}
