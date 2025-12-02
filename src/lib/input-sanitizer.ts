/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

/**
 * Sanitizes a generic string input
 * Removes HTML tags, dangerous characters, and JavaScript protocols
 * @param input - User input string
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns Sanitized string
 */
export function sanitizeString(
    input: string,
    maxLength: number = 100
): string {
    return input
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[<>'"]/g, '') // Remove dangerous characters
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
        .substring(0, maxLength)
        .trim()
}

/**
 * Sanitizes location names for geocoding queries
 * Allows only alphanumeric characters, spaces, and basic punctuation
 * @param location - Location name from user
 * @returns Sanitized location name
 */
export function sanitizeLocationName(location: string): string {
    return location
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[^\w\s,.-]/g, '') // Only alphanumeric, spaces, commas, periods, hyphens
        .substring(0, 100) // Limit length
        .trim()
}

/**
 * Validates and sanitizes coordinate values
 * @param value - String representation of coordinate
 * @param type - Whether it's latitude or longitude
 * @returns Parsed and validated number
 * @throws Error if invalid
 */
export function validateCoordinate(
    value: string | null,
    type: 'lat' | 'lon'
): number {
    if (!value) {
        throw new Error(`${type} parameter is required`)
    }

    const num = parseFloat(value)

    if (isNaN(num)) {
        throw new Error(`Invalid ${type} value`)
    }

    // Validate coordinate ranges
    if (type === 'lat' && (num < -90 || num > 90)) {
        throw new Error('Latitude must be between -90 and 90')
    }

    if (type === 'lon' && (num < -180 || num > 180)) {
        throw new Error('Longitude must be between -180 and 180')
    }

    return num
}
