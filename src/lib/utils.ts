
export function celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9) / 5 + 32
}

export function fahrenheitToCelsius(fahrenheit: number): number {
    return ((fahrenheit - 32) * 5) / 9
}

export function convertTemperature(temp: number, unit: 'metric' | 'imperial'): number {
    if (unit === 'imperial') {
        return Math.round(celsiusToFahrenheit(temp))
    }
    return Math.round(temp)
}
