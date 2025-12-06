import React from 'react'
import { GlassCard } from '../GlassCard'

/**
 * Loading skeleton for the HourlyForecast component.
 * Displays animated placeholder elements while the actual weather data is being fetched.
 * Mimics the layout of the actual component to prevent layout shift.
 */
export function HourlyForecastSkeleton() {
    return (
        // Use GlassCard with 'none' hover animation to keep it static
        <GlassCard variant="primary" className="p-8 sm:p-10 shadow-level-2" animateHover="none">
            {/* Title skeleton: Simulates the "Hourly Forecast" header */}
            <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse mb-8" />

            {/* Hourly items skeleton container: Horizontal scroll layout */}
            <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
                {/* Render 8 placeholder items to fill the width */}
                {Array.from({ length: 8 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-24 sm:w-28 flex flex-col items-center p-4 rounded-xl glass-card-tertiary"
                    >
                        {/* Time placeholder */}
                        <div className="h-4 w-12 bg-white/10 rounded animate-pulse mb-2" />
                        
                        {/* Icon placeholder: Circular shape */}
                        <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse mb-2" />
                        
                        {/* Temperature placeholder */}
                        <div className="h-6 w-10 bg-white/10 rounded animate-pulse mb-1" />
                        
                        {/* Extra info (wind/precip) placeholder */}
                        <div className="h-3 w-8 bg-white/10 rounded animate-pulse" />
                    </div>
                ))}
            </div>
        </GlassCard>
    )
}
