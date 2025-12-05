import React from 'react'
import { GlassCard } from '../GlassCard'

/**
 * Loading skeleton for HourlyForecast component.
 * Displays animated placeholder elements while the actual component loads.
 */
export function HourlyForecastSkeleton() {
    return (
        <GlassCard variant="primary" className="p-8 sm:p-10 shadow-level-2" animateHover="none">
            {/* Title skeleton */}
            <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse mb-8" />

            {/* Hourly items skeleton */}
            <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-24 sm:w-28 flex flex-col items-center p-4 rounded-xl glass-card-tertiary"
                    >
                        {/* Time */}
                        <div className="h-4 w-12 bg-white/10 rounded animate-pulse mb-2" />
                        
                        {/* Icon placeholder */}
                        <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse mb-2" />
                        
                        {/* Temperature */}
                        <div className="h-6 w-10 bg-white/10 rounded animate-pulse mb-1" />
                        
                        {/* Extra info */}
                        <div className="h-3 w-8 bg-white/10 rounded animate-pulse" />
                    </div>
                ))}
            </div>
        </GlassCard>
    )
}
