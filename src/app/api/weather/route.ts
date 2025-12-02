import { NextResponse } from 'next/server'
import { weatherAPI } from '../../../lib/weather-api'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { sanitizeLocationName, validateCoordinate } from '@/lib/input-sanitizer'
import type { WeatherData, DailyForecast, AirQualityData, UVIndexData, PollenData } from '../../../lib/types'

// Helper to safely fetch optional data with fallback
async function fetchWithFallback<T>(fetchFn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fetchFn()
  } catch (err) {
    console.warn('API fallback used:', err)
    return fallback
  }
}

export async function GET(request: Request) {
  // Rate limiting: 30 requests per minute per IP
  const clientIp = getClientIp(request)
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

    // Validate coordinates with range checking
    const lat = validateCoordinate(latParam, 'lat')
    const lon = validateCoordinate(lonParam, 'lon')

    // Sanitize location parameter to prevent XSS
    const locationParam = url.searchParams.get('location')
    let locationName = locationParam
      ? sanitizeLocationName(locationParam)
      : 'Unknown Location'

    // If location is "Current Location" or missing, try to reverse geocode
    let locationCountry = ''
    if (locationName === 'Current Location' || !locationParam) {
      const reversed = await weatherAPI.reverseGeocode(lat, lon)
      if (reversed) {
        locationName = reversed.name || locationName
        locationCountry = reversed.country || ''
      }
    }

    const current = await weatherAPI.getCurrentWeather(lat, lon)

    // Fetch forecast (daily and hourly)
    const forecastData = await fetchWithFallback(
      () => weatherAPI.getForecast(lat, lon),
      { daily: [], hourly: [] }
    )

    // Fetch optional data with fallbacks
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

    const uvIndex = await fetchWithFallback<UVIndexData>(
      () => weatherAPI.getUVIndex(lat, lon),
      { uvIndex: 0, uvIndexMax: 0 }
    )

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