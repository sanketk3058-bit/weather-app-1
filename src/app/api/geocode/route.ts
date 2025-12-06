import { NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { sanitizeString } from '@/lib/input-sanitizer'
import { weatherAPI } from '@/lib/weather-api'

/**
 * GET handler for the Geocoding API route.
 * Searches for locations based on a query string.
 * 
 * Features:
 * - Rate limiting (30 req/min)
 * - Input sanitization
 * - Caching headers
 * 
 * @param request - The incoming HTTP request
 * @returns JSON response with location data or error
 */
export async function GET(request: Request) {
  // Identify the client IP address for rate limiting purposes
  const clientIp = getClientIp(request)
  
  // Check rate limit: 30 requests per minute per IP
  // Window size is 60000ms (1 minute)
  const rateLimitResult = rateLimit(clientIp, 30, 60000)

  // If rate limit exceeded, return 429 Too Many Requests
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

  // Parse the URL to get query parameters
  const url = new URL(request.url)
  const query = url.searchParams.get('q')

  // Validate that the query parameter exists
  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    )
  }

  // Sanitize input to prevent XSS and injection attacks.
  // Limits length to 100 characters.
  const sanitizedQuery = sanitizeString(query, 100)

  // If sanitization fails (e.g., empty string after cleanup), return error
  if (!sanitizedQuery) {
    return NextResponse.json(
      { error: 'Invalid query parameter' },
      { status: 400 }
    )
  }

  try {
    // Call the weather API service to search for locations
    const locations = await weatherAPI.searchLocation(sanitizedQuery)
    
    // Return the results with caching headers
    // s-maxage=3600: Cache on CDN/Edge for 1 hour
    // stale-while-revalidate=300: Serve stale content for up to 5 mins while updating
    return NextResponse.json(locations, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
        'X-RateLimit-Limit': '30',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
      }
    })
  } catch (error) {
    // Log the error internally but return a generic message to the client
    console.error('Geocoding error:', error)
    return NextResponse.json(
      { error: 'Failed to geocode location' },
      { status: 500 }
    )
  }
}

