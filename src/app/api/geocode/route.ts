import { NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { sanitizeString } from '@/lib/input-sanitizer'
import { weatherAPI } from '@/lib/weather-api'

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
  const query = url.searchParams.get('q')

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    )
  }

  // Sanitize input to prevent XSS and injection attacks
  const sanitizedQuery = sanitizeString(query, 100)

  if (!sanitizedQuery) {
    return NextResponse.json(
      { error: 'Invalid query parameter' },
      { status: 400 }
    )
  }

  try {
    const locations = await weatherAPI.searchLocation(sanitizedQuery)
    return NextResponse.json(locations, {
      headers: {
        'X-RateLimit-Limit': '30',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
      }
    })
  } catch (error) {
    console.error('Geocoding error:', error)
    return NextResponse.json(
      { error: 'Failed to geocode location' },
      { status: 500 }
    )
  }
}

