'use client'

// Import SWR hook and configuration type for data fetching
import useSWR, { SWRConfiguration } from 'swr'
// Import WeatherData type definition from the centralized types file
import type { WeatherData } from '@/lib/types'

/**
 * Interface defining the coordinates and name for a weather location lookup.
 * Used as the input parameter for the useWeather hook.
 */
export interface WeatherLocation {
  /** Latitude coordinate */
  lat: number
  /** Longitude coordinate */
  lon: number
  /** Human-readable location name (e.g., "London", "New York") */
  location: string
}

/**
 * Interface defining the return structure of the useWeather hook.
 * Provides data, error state, loading flags, and a mutation function.
 */
export interface UseWeatherResult {
  /** The fetched weather data, or undefined if loading/error */
  data: WeatherData | undefined
  /** Error object if the fetch failed, otherwise undefined */
  error: Error | undefined
  /** Boolean indicating if the initial data is being loaded */
  isLoading: boolean
  /** Boolean indicating if data is being revalidated (refetched in background) */
  isValidating: boolean
  /** Function to manually trigger a revalidation of the data */
  mutate: () => void
}

/**
 * Fetcher function used by SWR to retrieve weather data.
 * 
 * @param url - The API endpoint URL to fetch
 * @returns Promise resolving to the WeatherData object
 * @throws Error if the network response is not OK
 */
const weatherFetcher = async (url: string): Promise<WeatherData> => {
  // Perform the network request
  const response = await fetch(url)
  
  // Check if the response status code indicates success (200-299)
  if (!response.ok) {
    // Create a new error object with a descriptive message
    const error = new Error('Failed to fetch weather data')
    // Throw the error to be caught by SWR's error handling
    throw error
  }
  
  // Parse and return the JSON response body
  return response.json()
}

/**
 * Configuration options for the SWR hook.
 * Defines caching, revalidation, and error retry behavior.
 */
const swrOptions: SWRConfiguration<WeatherData, Error> = {
  // Deduplication interval: 60 seconds.
  // Requests with the same key within this window will return the cached promise.
  // Matches the server-side cache TTL to prevent unnecessary load.
  dedupingInterval: 60 * 1000, 
  
  // Revalidate data if it is stale (older than cache time) when mounted.
  revalidateIfStale: true,
  
  // Do not revalidate when the window regains focus.
  // This reduces API calls as weather data doesn't change that rapidly.
  revalidateOnFocus: false,
  
  // Revalidate when the browser regains network connection.
  // Ensures the user sees up-to-date data after being offline.
  revalidateOnReconnect: true,
  
  // Number of times to retry a failed request.
  errorRetryCount: 2,
  
  // Interval between retry attempts in milliseconds (5 seconds).
  errorRetryInterval: 5000,
  
  // Keep the previous data available in the UI while revalidating.
  // Prevents flashing of loading states and provides a smoother UX.
  keepPreviousData: true,
}

/**
 * Custom hook for fetching weather data using SWR (Stale-While-Revalidate).
 * 
 * This hook encapsulates the data fetching logic, caching strategy, and state management
 * for weather data. It uses SWR to provide a responsive and resilient user experience.
 * 
 * Features:
 * - Automatic request deduplication (60s window)
 * - Stale-while-revalidate pattern for instant updates if cached
 * - Error retry with exponential backoff
 * - Keeps previous data during revalidation to avoid UI flicker
 * 
 * @param location - The location coordinates and name, or null to skip fetching (e.g., if waiting for geolocation).
 * @returns UseWeatherResult object containing data, error, loading states, and mutate function.
 * 
 * @example
 * ```tsx
 * const { data, error, isLoading } = useWeather({ lat: 51.5074, lon: -0.1278, location: 'London' })
 * ```
 */
export function useWeather(location: WeatherLocation | null): UseWeatherResult {
  // Construct the SWR cache key.
  // If location is null, the key is null, which tells SWR to pause fetching.
  // We encode the location name to ensure it's URL-safe.
  const key = location
    ? `/api/weather?lat=${location.lat}&lon=${location.lon}&location=${encodeURIComponent(location.location)}`
    : null

  // Call the useSWR hook with the key, fetcher, and options.
  // Destructure the needed properties from the SWR response.
  const { data, error, isLoading, isValidating, mutate } = useSWR<WeatherData, Error>(
    key,
    weatherFetcher,
    swrOptions
  )

  // Return the structured result.
  // We wrap mutate to match the interface (void return).
  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate: () => mutate(),
  }
}
