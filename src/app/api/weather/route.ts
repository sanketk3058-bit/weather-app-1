import { NextResponse } from 'next/server'
import { weatherAPI } from '../../../lib/weather-api'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { sanitizeLocationName, validateCoordinate } from '@/lib/input-sanitizer'
import type { WeatherData, DailyForecast, AirQualityData, UVIndexData, PollenData } from '../../../lib/types'

/**
 * Helper function to safely fetch optional data with a fallback value.
 * Ensures that a failure in a secondary data source (like Pollen or UV)
 * does not crash the entire weather request.
 * 
 * @param fetchFn - The async function to execute
 * @param fallback - The default value to return if fetchFn fails
 * @returns The result of fetchFn or the fallback value
 */
async function fetchWithFallback<T>(fetchFn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fetchFn()
  } catch (err) {
    // Log warning but continue execution
    console.warn('API fallback used:', err)
    return fallback
  }
}

/**
 * GET handler for the Weather Aggregation API route.
 * Fetches and combines data from multiple OpenWeatherMap endpoints:
 * - Current Weather
 * - Forecast (Daily/Hourly)
 * - Air Quality
 * - UV Index
 * - Pollen (Simulated/Derived)
 * 
 * Features:
 * - Rate limiting
 * - Input validation & sanitization
 * - Reverse geocoding fallback
 * - Resilience via fallback values for optional data
 * 
 * @param request - The incoming HTTP request containing lat/lon parameters
 * @returns JSON response with aggregated WeatherData
 */
export async function GET(request: Request) {
  // Identify client IP for rate limiting
  const clientIp = getClientIp(request)
  
  // Apply rate limit: 30 requests per minute
  const rateLimitResult = rateLimit(clientIp, 30, 60000)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '30',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
        }
      }
    )
  }

  const url = new URL(request.url)

  // Validate and sanitize inputs
  try {
    const latParam = url.searchParams.get('lat')
    const lonParam = url.searchParams.get('lon')

    // Validate coordinates with strict range checking (-90 to 90, -180 to 180)
    // Throws error if invalid
    const lat = validateCoordinate(latParam, 'lat')
    const lon = validateCoordinate(lonParam, 'lon')

    // Sanitize location parameter to prevent XSS
    const locationParam = url.searchParams.get('location')
    let locationName = locationParam
      ? sanitizeLocationName(locationParam)
      : 'Unknown Location'

    // If location is generic ("Current Location") or missing, attempt reverse geocoding
    // to get the actual city/country name from coordinates.
    let locationCountry = ''
    if (locationName === 'Current Location' || !locationParam) {
      const reversed = await weatherAPI.reverseGeocode(lat, lon)
      if (reversed) {
        locationName = reversed.name || locationName
        locationCountry = reversed.country || ''
      }
    }

    // Fetch current weather (Critical - no fallback)
    const current = await weatherAPI.getCurrentWeather(lat, lon)

    // Fetch forecast (daily and hourly) with fallback to empty arrays
    const forecastData = await fetchWithFallback(
      () => weatherAPI.getForecast(lat, lon),
      { daily: [], hourly: [] }
    )

    // Fetch Air Quality Data with fallback to zero values
    const airQuality = await fetchWithFallback<AirQualityData>(
      () => weatherAPI.getAirQuality(lat, lon),
      {
        aqi: 0,
        co: 0,
        no: 0,
        no2: 0,
        o3: 0,
        so2: 0,
        nh3: 0,
        pm2_5: 0,
        pm10: 0,
        components: {},
      }
    )

    // Fetch UV Index with fallback
    const uvIndex = await fetchWithFallback<UVIndexData>(
      () => weatherAPI.getUVIndex(lat, lon),
      { uvIndex: 0, uvIndexMax: 0 }
    )

    // Generate Pollen Data (derived from weather conditions) with fallback
    const pollen = await fetchWithFallback<PollenData>(
      async () => weatherAPI.generatePollenData(current, forecastData.daily),
      {
        grass: 0,
        ragweed: 0,
        tree: 0,
        total: 0,
        riskLevel: 'low' as const,
      }
    )

    const weatherData: WeatherData = {
      location: {
        name: locationName,
        country: locationCountry,
        lat,
        lon,
        timezone: current.timezone != null ? current.timezone.toString() : '',
      },
      current,
      forecast: forecastData.daily,
      hourly: forecastData.hourly,
      airQuality,
      uvIndex,
      pollen,
    }

    return NextResponse.json(weatherData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        'X-RateLimit-Limit': '30',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      // Handle validation errors with 400 status
      if (error.message.includes('required') || error.message.includes('Invalid') ||
        error.message.includes('must be between')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
    }

    console.error('Weather API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}