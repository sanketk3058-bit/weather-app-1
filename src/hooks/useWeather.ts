'use client'

import useSWR, { SWRConfiguration } from 'swr'
import type { WeatherData } from '@/lib/types'

/**
 * Coordinates for weather lookup
 */
export interface WeatherLocation {
  lat: number
  lon: number
  location: string
}

/**
 * Return type of the useWeather hook
 */
export interface UseWeatherResult {
  data: WeatherData | undefined
  error: Error | undefined
  isLoading: boolean
  isValidating: boolean
  mutate: () => void
}

/**
 * Fetcher function for SWR
 * Throws on non-OK responses for SWR error handling
 */
const weatherFetcher = async (url: string): Promise<WeatherData> => {
  const response = await fetch(url)
  
  if (!response.ok) {
    const error = new Error('Failed to fetch weather data')
    throw error
  }
  
  return response.json()
}

/**
 * SWR configuration options for weather data
 * - dedupingInterval: 60s - prevents duplicate requests within this window
 * - revalidateIfStale: true - revalidates stale data in the background
 * - revalidateOnFocus: false - don't refetch when window regains focus (reduces API calls)
 * - revalidateOnReconnect: true - refetch when network reconnects
 * - errorRetryCount: 2 - retry failed requests twice
 * - errorRetryInterval: 5000 - wait 5s between retries
 */
const swrOptions: SWRConfiguration<WeatherData, Error> = {
  dedupingInterval: 60 * 1000, // 60 seconds - matches server cache TTL
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  errorRetryCount: 2,
  errorRetryInterval: 5000,
  // Keep previous data while revalidating for smoother UX
  keepPreviousData: true,
}

/**
 * Custom hook for fetching weather data with SWR caching
 * 
 * Features:
 * - Automatic request deduplication (60s window)
 * - Stale-while-revalidate pattern
 * - Error retry with exponential backoff
 * - Keeps previous data during revalidation
 * 
 * @param location - The location coordinates and name, or null to skip fetching
 * @returns Weather data, loading/error states, and mutate function
 * 
 * @example
 * ```tsx
 * const { data, error, isLoading } = useWeather({ lat: 51.5074, lon: -0.1278, location: 'London' })
 * ```
 */
export function useWeather(location: WeatherLocation | null): UseWeatherResult {
  // Build the SWR key - null key means don't fetch
  const key = location
    ? `/api/weather?lat=${location.lat}&lon=${location.lon}&location=${encodeURIComponent(location.location)}`
    : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<WeatherData, Error>(
    key,
    weatherFetcher,
    swrOptions
  )

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate: () => mutate(),
  }
}
