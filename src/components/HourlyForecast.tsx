'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { GlassCard } from './GlassCard'
import { WeatherIconSkeleton } from './skeletons/WeatherIconSkeleton'
import type { HourlyForecast as HourlyForecastType } from '@/lib/types'
import { convertTemperature } from '@/lib/utils'

// Dynamic import for WeatherIcon to reduce this component's bundle contribution
const WeatherIcon = dynamic(
    () => import('./WeatherIcon').then(mod => ({ default: mod.WeatherIcon })),
    {
        ssr: false,
        loading: () => <WeatherIconSkeleton size={40} />
    }
)

interface HourlyForecastProps {
    data: HourlyForecastType[]
    unit: 'metric' | 'imperial'
}

export function HourlyForecast({ data, unit }: HourlyForecastProps) {
    if (!data || data.length === 0) return null

    return (
        <GlassCard variant="primary" className="p-8 sm:p-10 shadow-level-2 anim-slide-up anim-stagger-100" animateHover="lift">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 gradient-text anim-slide-down anim-stagger-50">Hourly Forecast</h2>

            <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x">
                {data.map((hour, index) => {
                    const date = new Date(hour.dt * 1000)
                    const timeString = date.toLocaleTimeString([], { hour: 'numeric', hour12: true })

                    return (
                        <div
                            key={hour.dt}
                            className="flex-shrink-0 w-24 sm:w-28 flex flex-col items-center p-4 rounded-xl glass-card-tertiary text-foreground snap-center anim-fade-scale"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <span className="text-foreground text-sm font-medium mb-2">{timeString}</span>

                            <WeatherIcon
                                condition={hour.weather[0]?.description || ''}
                                icon={hour.weather[0]?.icon}
                                size={40}
                                className="mb-2"
                                enableHoverAnimation={true}
                            />

                            <span className="text-xl font-bold text-foreground mb-1">{convertTemperature(hour.temp, unit)}°</span>

                            <div className="flex flex-col items-center gap-1 w-full">
                                {(hour.pop > 0) && (
                                    <span className="text-xs text-blue-300 font-medium">
                                        {Math.round(hour.pop * 100)}%
                                    </span>
                                )}

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
