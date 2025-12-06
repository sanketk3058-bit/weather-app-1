'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { GlassCard } from './GlassCard'
import { WeatherIconSkeleton } from './skeletons/WeatherIconSkeleton'
import type { HourlyForecast as HourlyForecastType } from '@/lib/types'
import { convertTemperature } from '@/lib/utils'

// Dynamic import for WeatherIcon to reduce this component's bundle contribution.
// Since this component renders many icons, lazy loading helps initial page load performance.
const WeatherIcon = dynamic(
    () => import('./WeatherIcon').then(mod => ({ default: mod.WeatherIcon })),
    {
        ssr: false, // Disable server-side rendering for the icon to avoid hydration mismatches
        loading: () => <WeatherIconSkeleton size={40} /> // Show skeleton while loading
    }
)

/**
 * Props for the HourlyForecast component.
 */
interface HourlyForecastProps {
    /** Array of hourly forecast data points */
    data: HourlyForecastType[]
    /** The current temperature unit (metric/imperial) */
    unit: 'metric' | 'imperial'
}

/**
 * Component to display a horizontal scrollable list of hourly weather forecasts.
 * 
 * @param props - Contains the forecast data and unit setting
 * @returns The rendered component or null if no data is provided
 */
export function HourlyForecast({ data, unit }: HourlyForecastProps) {
    // Return null if there is no data to display
    if (!data || data.length === 0) return null

    return (
        <GlassCard variant="primary" className="p-8 sm:p-10 shadow-level-2 anim-slide-up anim-stagger-100" animateHover="lift">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 gradient-text anim-slide-down anim-stagger-50">Hourly Forecast</h2>

            {/* Horizontal scroll container */}
            <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x">
                {data.map((hour, index) => {
                    // Convert timestamp to Date object
                    const date = new Date(hour.dt * 1000)
                    // Format time (e.g., "2 PM")
                    const timeString = date.toLocaleTimeString([], { hour: 'numeric', hour12: true })

                    return (
                        <div
                            key={hour.dt}
                            className="flex-shrink-0 w-24 sm:w-28 flex flex-col items-center p-4 rounded-xl glass-card-tertiary text-foreground snap-center anim-fade-scale"
                            style={{ animationDelay: `${index * 50}ms` }} // Staggered animation delay
                        >
                            {/* Time Label */}
                            <span className="text-foreground text-sm font-medium mb-2">{timeString}</span>

                            {/* Weather Icon */}
                            <WeatherIcon
                                condition={hour.weather[0]?.description || ''}
                                icon={hour.weather[0]?.icon}
                                size={40}
                                className="mb-2"
                                enableHoverAnimation={true}
                            />

                            {/* Temperature */}
                            <span className="text-xl font-bold text-foreground mb-1">{convertTemperature(hour.temp, unit)}°</span>

                            {/* Additional Metrics (Precipitation & Wind) */}
                            <div className="flex flex-col items-center gap-1 w-full">
                                {/* Probability of Precipitation (POP) - only show if > 0% */}
                                {(hour.pop > 0) && (
                                    <span className="text-xs text-blue-300 font-medium">
                                        {Math.round(hour.pop * 100)}%
                                    </span>
                                )}

                                {/* Wind Speed */}
                                <span className="text-[10px] text-foreground/60">
                                    {Math.round(hour.windSpeed)} km/h
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </GlassCard>
    )
}
