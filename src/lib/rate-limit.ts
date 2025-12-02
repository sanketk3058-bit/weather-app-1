/**
 * In-memory rate limiter for API routes
 * Implements sliding window rate limiting to prevent abuse
 */

interface RateLimitRecord {
    count: number
    resetTime: number
}

const rateLimitStore = new Map<string, RateLimitRecord>()

/**
 * Rate limit a request based on identifier (usually IP address)
 * @param identifier - Unique identifier for the client (IP address)
 * @param limit - Maximum number of requests allowed in the window
 * @param windowMs - Time window in milliseconds (default: 60 seconds)
 * @returns Rate limit result with success status and remaining requests
 */
export function rateLimit(
    identifier: string,
    limit: number = 30,
    windowMs: number = 60000
): { success: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const record = rateLimitStore.get(identifier)

    // Clean up old entries periodically to prevent memory leaks
    if (rateLimitStore.size > 1000) {
        for (const [key, value] of rateLimitStore.entries()) {
            if (now > value.resetTime) {
                rateLimitStore.delete(key)
            }
        }
    }

    // No record or expired - create new window
    if (!record || now > record.resetTime) {
        const resetTime = now + windowMs
        rateLimitStore.set(identifier, { count: 1, resetTime })
        return { success: true, remaining: limit - 1, resetTime }
    }

    // Limit exceeded
    if (record.count >= limit) {
        return {
            success: false,
            remaining: 0,
            resetTime: record.resetTime
        }
    }

    // Increment counter
    record.count++
    return {
        success: true,
        remaining: limit - record.count,
        resetTime: record.resetTime
    }
}

/**
 * Extract client IP address from request headers
 * Checks X-Forwarded-For and X-Real-IP headers for proxied requests
 * @param request - Next.js Request object
 * @returns Client IP address or 'anonymous' if not available
 */
export function getClientIp(request: Request): string {
    // Check X-Forwarded-For header (set by proxies/load balancers)
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')

    if (forwarded) {
        // X-Forwarded-For can contain multiple IPs, take the first one
        return forwarded.split(',')[0].trim()
    }

    if (realIp) {
        return realIp
    }

    // Fallback to 'anonymous' if no IP available (e.g., local dev)
    return 'anonymous'
}
