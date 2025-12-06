
/**
 * @file 
 * @description Utility functions for common operations such as temperature conversion.
 * These helpers are pure functions used throughout the application to ensure consistent data formatting.
 */

/**
 * Converts a temperature value from Celsius to Fahrenheit.
 * 
 * @param {number} celsius - The temperature in degrees Celsius.
 * @returns {number} The temperature in degrees Fahrenheit.
 */
export function celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9) / 5 + 32
}

/**
 * Converts a temperature value from Fahrenheit to Celsius.
 * 
 * @param {number} fahrenheit - The temperature in degrees Fahrenheit.
 * @returns {number} The temperature in degrees Celsius.
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
    return ((fahrenheit - 32) * 5) / 9
}

/**
 * Converts a temperature to the specified unit system.
 * If the target unit is 'imperial', converts to Fahrenheit.
 * If 'metric', returns the value as-is (assuming input is Celsius).
 * The result is rounded to the nearest integer for display purposes.
 * 
 * @param {number} temp - The input temperature (assumed to be in Celsius).
 * @param {'metric' | 'imperial'} unit - The target unit system.
 * @returns {number} The converted and rounded temperature.
 */
export function convertTemperature(temp: number, unit: 'metric' | 'imperial'): number {
    if (unit === 'imperial') {
        return Math.round(celsiusToFahrenheit(temp))
    }
    return Math.round(temp)
}
