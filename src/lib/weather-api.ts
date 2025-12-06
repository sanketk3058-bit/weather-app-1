/**
 * @file 
 * @description Centralized service layer for interacting with the OpenWeatherMap API.
 * 
 * This module handles:
 * - API configuration (Base URL, API Key)
 * - HTTP client setup (Axios with keep-alive agents)
 * - In-memory caching to reduce API calls and latency
 * - Data fetching for current weather, forecasts, air quality, UV index, and geocoding
 * - Transformation of raw API responses into application-specific interfaces
 * 
 * The  class encapsulates all API logic, providing a clean interface
 * for the rest of the application.
 */

import axios from 'axios'
import http from 'http'
import https from 'https'
import type {
  WeatherData,
  LocationData,
  CurrentWeather,
  DailyForecast,
  AirQualityData,
  UVIndexData,
  PollenData,
  GeocodingResult,
  OpenWeatherResponse,
  AirQualityResponse,
  UVIndexResponse,
} from './types'

// Configuration constants
const BASE_URL = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5'
const API_KEY = process.env.OPENWEATHER_API_KEY

// Validate API Key presence at startup
if (!API_KEY) {
  throw new Error('OPENWEATHER_API_KEY environment variable is not defined')
}

// Keep-alive options for reusing OpenWeatherMap TCP connections.
// This significantly improves performance for sequential requests by avoiding SSL handshake overhead.
const KEEP_ALIVE_AGENT_OPTIONS = { keepAlive: true, maxSockets: 50, keepAliveMsecs: 30_000 } as const
const httpAgent = new http.Agent(KEEP_ALIVE_AGENT_OPTIONS)
const httpsAgent = new https.Agent(KEEP_ALIVE_AGENT_OPTIONS)

// Shared Axios instance with default configuration
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: { appid: API_KEY, units: 'metric' }, // Default to metric units
  timeout: 10000, // 10 second timeout
  httpAgent,
  httpsAgent,
})

// ==========================================
// Caching Mechanism
// ==========================================

// In-process cache + in-flight deduplication
type CacheEntry = { expiresAt: number; value: unknown }
const memoryCache = new Map<string, CacheEntry>()
const inFlight = new Map<string, Promise<unknown>>()

/**
 * Generates a unique cache key based on the request method, URL, and parameters.
 * 
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string} url - Request URL path
 * @param {Record<string, unknown>} [params] - Query parameters
 * @returns {string} A unique string key for the cache
 */
export function makeCacheKey(method: string, url: string, params?: Record<string, unknown>) {
  const sorted = params
    ? Object.keys(params)
        .sort()
        .map((k) => `${k}=${String((params as Record<string, any>)[k])}`)
        .join('&')
    : ''
  return `${method.toUpperCase()}|${url}|${sorted}`
}

/**
 * A wrapper function that implements caching and request deduplication.
 * 
 * 1. Checks memory cache for valid data.
 * 2. Checks for identical in-flight requests to prevent stampedes.
 * 3. Executes the fetcher if needed and caches the result.
 * 
 * @template T
 * @param {string} key - Unique cache key
 * @param {number} ttlMs - Time-to-live in milliseconds
 * @param {() => Promise<T>} fetcher - Function that performs the actual data fetch
 * @returns {Promise<T>} The fetched or cached data
 */
export async function cachedFetch<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const now = Date.now()

  // Check cache
  const cached = memoryCache.get(key)
  if (cached && cached.expiresAt > now) {
    return cached.value as T
  }

  // Check in-flight requests (deduplication)
  const inflight = inFlight.get(key)
  if (inflight) return inflight as Promise<T>

  // Execute fetch
  const p = (async () => {
    try {
      const res = await fetcher()
      memoryCache.set(key, { expiresAt: Date.now() + ttlMs, value: res as unknown })
      return res
    } catch (err) {
      // Do not populate cache on error to allow retries
      throw err
    } finally {
      inFlight.delete(key)
    }
  })()

  inFlight.set(key, p as Promise<unknown>)
  return p
}

/**
 * Service class for all Weather API interactions.
 */
class WeatherAPIService {
  // use shared axios instance with keep-alive
  private client = axiosInstance

  /**
   * Fetches current weather data for a specific location.
   * Cached for 60 seconds.
   * 
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<CurrentWeather>} Transformed current weather data
   */
  async getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
    const key = makeCacheKey('GET', '/weather', { lat, lon })
    const data = await cachedFetch<OpenWeatherResponse>(key, 60 * 1000, () =>
      this.client.get('/weather', { params: { lat, lon } }).then((r) => r.data as OpenWeatherResponse)
    )

    return this.transformCurrentWeather(data)
  }

  /**
   * Fetches 5-day/3-hour forecast data and processes it into daily and hourly formats.
   * Cached for 5 minutes.
   * 
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<{ daily: DailyForecast[], hourly: any[] }>} Processed forecast data
   */
  async getForecast(lat: number, lon: number): Promise<{ daily: DailyForecast[], hourly: any[] }> {
    const key = makeCacheKey('GET', '/forecast', { lat, lon })
    const data = await cachedFetch<any>(key, 5 * 60 * 1000, () =>
      this.client.get('/forecast', { params: { lat, lon } }).then((r) => r.data)
    )

    return this.processForecastData(data)
  }

  /**
   * Fetches air quality data.
   * Cached for 5 minutes.
   * 
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<AirQualityData>} Transformed air quality data
   */
  async getAirQuality(lat: number, lon: number): Promise<AirQualityData> {
    const key = makeCacheKey('GET', '/air_pollution', { lat, lon })
    const data = await cachedFetch<AirQualityResponse>(key, 5 * 60 * 1000, () =>
      this.client.get('/air_pollution', { params: { lat, lon } }).then((r) => r.data as AirQualityResponse)
    )

    return this.transformAirQuality(data)
  }

  /**
   * Fetches UV Index data.
   * Cached for 5 minutes.
   * 
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<UVIndexData>} Transformed UV index data
   */
  async getUVIndex(lat: number, lon: number): Promise<UVIndexData> {
    const key = makeCacheKey('GET', '/uvi', { lat, lon })
    const data = await cachedFetch<UVIndexResponse>(key, 5 * 60 * 1000, () =>
      this.client.get('/uvi', { params: { lat, lon } }).then((r) => r.data as UVIndexResponse)
    )

    return this.transformUVIndex(data)
  }

  /**
   * Searches for a location by name using the Geocoding API.
   * 
   * @param {string} query - City name or search term
   * @returns {Promise<GeocodingResult[]>} List of matching locations
   */
  async searchLocation(query: string): Promise<GeocodingResult[]> {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_GEOCODING_API_URL || 'https://api.openweathermap.org/geo/1.0'}/direct`,
      {
        params: {
          q: query,
          limit: 5,
          appid: API_KEY,
        },
        timeout: 10000,
      }
    )

    return response.data.map((item: any) => ({
      name: item.name,
      lat: item.lat,
      lon: item.lon,
      country: item.country,
      state: item.state,
    }))
  }

  /**
   * Performs reverse geocoding to find location details from coordinates.
   * 
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<GeocodingResult | null>} Location details or null if not found
   */
  async reverseGeocode(lat: number, lon: number): Promise<GeocodingResult | null> {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_GEOCODING_API_URL || 'https://api.openweathermap.org/geo/1.0'}/reverse`,
        {
          params: {
            lat,
            lon,
            limit: 1,
            appid: API_KEY,
          },
          timeout: 10000,
        }
      )

      if (response.data && response.data.length > 0) {
        const location = response.data[0]
        return {
          name: location.name,
          lat: location.lat,
          lon: location.lon,
          country: location.country,
          state: location.state,
          local_names: location.local_names,
        }
      }
      return null
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
      return null
    }
  }

  /**
   * Transforms raw OpenWeatherMap current weather response into internal CurrentWeather interface.
   * 
   * @param {OpenWeatherResponse} data - Raw API response
   * @returns {CurrentWeather} Normalized data
   */
  private transformCurrentWeather(data: OpenWeatherResponse): CurrentWeather {
    return {
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      visibility: data.visibility,
      // Calculate dew point approximation if not provided
      dewPoint: data.main.humidity > 0 ? data.main.temp - ((100 - data.main.humidity) / 5) : undefined,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
    }
  }

  /**
   * Processes the 5-day/3-hour forecast data.
   * - Aggregates 3-hour segments into daily summaries.
   * - Extracts hourly data points.
   * 
   * @param {any} data - Raw forecast API response
   * @returns {{ daily: DailyForecast[], hourly: any[] }} Processed forecast
   */
  private processForecastData(data: any): { daily: DailyForecast[], hourly: any[] } {
    const dailyMap = new Map<string, any>();
    const hourly: any[] = [];

    // Process list for hourly (all available items ~40) and daily aggregation
    data.list.forEach((item: any, index: number) => {
      // Hourly (all items)
      hourly.push({
          dt: item.dt,
          temp: item.main.temp,
          feelsLike: item.main.feels_like,
          pressure: item.main.pressure,
          humidity: item.main.humidity,
          dewPoint: item.main.temp - ((100 - item.main.humidity) / 5), // Approx
          uvi: 0, // Not available in standard forecast
          clouds: item.clouds.all,
          visibility: item.visibility,
          windSpeed: item.wind.speed,
          windDeg: item.wind.deg,
          windGust: item.wind.gust,
          weather: item.weather,
          pop: item.pop,
          rain: item.rain,
          snow: item.snow
      });

      // Daily Aggregation: Group by date string (YYYY-MM-DD)
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          items: [item]
        });
      } else {
        const dayData = dailyMap.get(date);
        // Track min/max temps across all 3-hour segments for the day
        dayData.temp_min = Math.min(dayData.temp_min, item.main.temp_min);
        dayData.temp_max = Math.max(dayData.temp_max, item.main.temp_max);
        dayData.items.push(item);
      }
    });

    // Transform daily map to DailyForecast array
    const daily: DailyForecast[] = Array.from(dailyMap.entries()).slice(0, 7).map(([date, data]: [string, any]) => {
      // Find the item closest to noon for representative day weather, or middle item
      const noonItem = data.items.find((i: any) => i.dt_txt.includes('12:00:00')) || data.items[Math.floor(data.items.length / 2)];

      return {
        date,
        temp: {
          day: noonItem.main.temp,
          min: data.temp_min,
          max: data.temp_max,
          night: data.items[data.items.length - 1].main.temp,
          eve: data.items[Math.floor(data.items.length * 0.75)].main.temp,
          morn: data.items[0].main.temp,
        },
        feelsLike: {
          day: noonItem.main.feels_like,
          night: data.items[data.items.length - 1].main.feels_like,
          eve: data.items[Math.floor(data.items.length * 0.75)].main.feels_like,
          morn: data.items[0].main.feels_like,
        },
        pressure: noonItem.main.pressure,
        humidity: noonItem.main.humidity,
        dewPoint: 0, // Simplified
        windSpeed: noonItem.wind.speed,
        windDeg: noonItem.wind.deg,
        windGust: noonItem.wind.gust,
        weather: noonItem.weather,
        clouds: noonItem.clouds.all,
        pop: noonItem.pop,
        rain: noonItem.rain?.['3h'],
        snow: noonItem.snow?.['3h'],
        uvi: 0
      };
    });

    return { daily, hourly };
  }

  /**
   * Transforms raw Air Quality response.
   * 
   * @param {AirQualityResponse} data - Raw API response
   * @returns {AirQualityData} Normalized data
   */
  private transformAirQuality(data: AirQualityResponse): AirQualityData {
    const list = data.list[0]

    return {
      aqi: list.main.aqi,
      co: list.components.co,
      no: list.components.no,
      no2: list.components.no2,
      o3: list.components.o3,
      so2: list.components.so2,
      nh3: list.components.nh3,
      pm2_5: list.components.pm2_5,
      pm10: list.components.pm10,
      components: list.components,
    }
  }

  /**
   * Transforms raw UV Index response and calculates safe exposure times.
   * 
   * @param {UVIndexResponse} data - Raw API response
   * @returns {UVIndexData} Normalized data with safe exposure times
   */
  private transformUVIndex(data: UVIndexResponse): UVIndexData {
    return {
      uvIndex: data.value,
      uvIndexMax: data.max || data.value,
      safeExposureTime: data.max ? this.calculateSafeExposureTime(data.max) : undefined,
    }
  }

  /**
   * Calculates safe exposure times for different skin types based on UV Index.
   * Uses standard dermatological formulas for approximation.
   * 
   * @param {number} uvIndex - The UV Index value
   * @returns {Object} Safe exposure times in minutes for skin types 1-6
   */
  private calculateSafeExposureTime(uvIndex: number) {
    // Simplified safe exposure time calculation based on UV index
    // Formula: Time to Burn (mins) = 200 / UV Index (approximate baseline)
    // Clamped between 60 and 300 minutes for safety in this implementation
    const st1 = uvIndex > 0 ? Math.max(60, Math.min(300, (1 / uvIndex) * 300)) : 300
    const st2 = st1 * 0.5
    const st3 = st1 * 0.25
    const st4 = st1 * 0.1
    const st5 = st1 * 0.05
    const st6 = st1 * 0.02

    return {
      st1: Math.round(st1),
      st2: Math.round(st2),
      st3: Math.round(st3),
      st4: Math.round(st4),
      st5: Math.round(st5),
      st6: Math.round(st6),
    }
  }

  /**
   * Generates simulated pollen data based on weather conditions.
   * Since OpenWeatherMap does not provide free pollen data, this heuristic
   * estimates pollen risk based on temperature, humidity, and wind speed.
   * 
   * @param {CurrentWeather} current - Current weather conditions
   * @param {DailyForecast[]} forecast - Forecast data for averaging
   * @returns {PollenData} Estimated pollen levels
   */
  generatePollenData(current: CurrentWeather, forecast: DailyForecast[]): PollenData {
    // Generate simulated pollen data based on weather conditions
    // Use short-term forecast averages (up to 3 days) if available to improve accuracy
    const temperature = current.temp
    const humidity = current.humidity
    const windSpeed = current.windSpeed

    let avgTemp = temperature
    let avgHumidity = humidity
    let avgWind = windSpeed

    // Calculate 3-day moving average if forecast is available
    if (forecast && forecast.length > 0) {
      const days = Math.min(3, forecast.length)
      let tSum = 0, hSum = 0, wSum = 0
      for (let i = 0; i < days; i++) {
        tSum += forecast[i].temp.day
        hSum += forecast[i].humidity
        wSum += forecast[i].windSpeed
      }
      // Weighted average: 60% current, 40% forecast
      avgTemp = (temperature * 0.6) + ((tSum / days) * 0.4)
      avgHumidity = (humidity * 0.6) + ((hSum / days) * 0.4)
      avgWind = (windSpeed * 0.6) + ((wSum / days) * 0.4)
    }

    // Pollen score calculation adjusted for averages and normalized
    // High temp + low humidity + high wind = Higher Pollen Risk
    const rawScore = Math.max(0, (avgTemp - 8) * (avgHumidity / 100) * (avgWind / 7))
    const normalized = Math.min(10, rawScore)

    // Distribute score across pollen types with arbitrary weights
    const grass = Math.round(Math.min(10, normalized * 0.75))
    const ragweed = Math.round(Math.min(10, normalized * 0.55))
    const tree = Math.round(Math.min(10, normalized * 0.85))
    const total = Math.round(normalized)

    let riskLevel: 'low' | 'medium' | 'high'
    if (total <= 3) riskLevel = 'low'
    else if (total <= 7) riskLevel = 'medium'
    else riskLevel = 'high'

    return {
      grass,
      ragweed,
      tree,
      total,
      riskLevel,
    }
  }
}

export const weatherAPI = new WeatherAPIService()