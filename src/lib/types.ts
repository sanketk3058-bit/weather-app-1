/**
 * @file 
 * @description Defines the core TypeScript interfaces and types used throughout the Weather App.
 * This includes data structures for API responses (OpenWeatherMap), internal application state,
 * and specific weather metrics like Air Quality, UV Index, and Pollen data.
 * 
 * These types ensure type safety across the data pipeline, from API fetching to UI rendering.
 */

/**
 * Represents basic geographic and location information.
 * Used for displaying location details in the UI and for API queries.
 */
export interface LocationData {
  /** City or location name (e.g., "London") */
  name: string
  /** Country code (e.g., "GB") */
  country: string
  /** Latitude coordinate */
  lat: number
  /** Longitude coordinate */
  lon: number
  /** Timezone identifier (e.g., "Europe/London") */
  timezone: string
}

/**
 * Represents the current weather conditions at a specific location.
 * Normalized data structure derived from the raw OpenWeatherMap response.
 */
export interface CurrentWeather {
  /** Current temperature in degrees (Celsius by default) */
  temp: number
  /** "Feels like" temperature accounting for wind chill and humidity */
  feelsLike: number
  /** Humidity percentage (0-100) */
  humidity: number
  /** Atmospheric pressure in hPa */
  pressure: number
  /** Wind speed in meters/second */
  windSpeed: number
  /** Text description of the weather (e.g., "scattered clouds") */
  description: string
  /** Icon code corresponding to OpenWeatherMap icon set */
  icon: string
  /** Visibility distance in meters */
  visibility?: number
  /** Dew point temperature */
  dewPoint?: number
  /** Unix timestamp for sunrise time */
  sunrise?: number
  /** Unix timestamp for sunset time */
  sunset?: number
  /** Shift in seconds from UTC */
  timezone?: number
}

/**
 * Represents a specific weather condition code and description.
 * OpenWeatherMap provides these to categorize weather (e.g., Rain, Snow, Clear).
 */
export interface WeatherCondition {
  /** Weather condition ID (e.g., 800 for clear sky) */
  id: number
  /** Group of weather parameters (Rain, Snow, Extreme etc.) */
  main: string
  /** Weather condition within the group */
  description: string
  /** Weather icon id */
  icon: string
}

/**
 * Represents aggregated weather data for a single day.
 * Used for the 7-day forecast display.
 */
export interface DailyForecast {
  /** Date string (ISO format YYYY-MM-DD) */
  date: string
  /** Temperature aggregation for various times of day */
  temp: {
    /** Day temperature */
    day: number
    /** Minimum temperature */
    min: number
    /** Maximum temperature */
    max: number
    /** Night temperature */
    night: number
    /** Evening temperature */
    eve: number
    /** Morning temperature */
    morn: number
  }
  /** "Feels like" temperature aggregation */
  feelsLike: {
    day: number
    night: number
    eve: number
    morn: number
  }
  /** Atmospheric pressure in hPa */
  pressure: number
  /** Humidity percentage */
  humidity: number
  /** Dew point temperature */
  dewPoint: number
  /** Wind speed */
  windSpeed: number
  /** Wind direction in degrees */
  windDeg: number
  /** Wind gust speed */
  windGust?: number
  /** Array of weather conditions for the day */
  weather: WeatherCondition[]
  /** Cloudiness percentage */
  clouds: number
  /** Probability of precipitation (0-1) */
  pop: number
  /** Rain volume in mm */
  rain?: number
  /** Snow volume in mm */
  snow?: number
  /** UV Index */
  uvi: number
}

/**
 * Represents weather data for a specific hour.
 * Used for the hourly forecast scroll view.
 */
export interface HourlyForecast {
  /** Unix timestamp of the forecast time */
  dt: number
  /** Temperature at this hour */
  temp: number
  /** "Feels like" temperature */
  feelsLike: number
  /** Atmospheric pressure */
  pressure: number
  /** Humidity percentage */
  humidity: number
  /** Dew point temperature */
  dewPoint: number
  /** UV Index */
  uvi: number
  /** Cloudiness percentage */
  clouds: number
  /** Visibility in meters */
  visibility: number
  /** Wind speed */
  windSpeed: number
  /** Wind direction in degrees */
  windDeg: number
  /** Wind gust speed */
  windGust?: number
  /** Weather conditions */
  weather: WeatherCondition[]
  /** Probability of precipitation */
  pop: number
  /** Rain volume for the last hour */
  rain?: {
    '1h': number
  }
  /** Snow volume for the last hour */
  snow?: {
    '1h': number
  }
}

/**
 * Represents Air Quality Index (AQI) and pollutant components.
 * Derived from OpenWeatherMap Air Pollution API.
 */
export interface AirQualityData {
  /** Air Quality Index (1 = Good, 5 = Very Poor) */
  aqi: number
  /** Carbon monoxide concentration (μg/m3) */
  co: number
  /** Nitrogen monoxide concentration (μg/m3) */
  no: number
  /** Nitrogen dioxide concentration (μg/m3) */
  no2: number
  /** Ozone concentration (μg/m3) */
  o3: number
  /** Sulphur dioxide concentration (μg/m3) */
  so2: number
  /** Ammonia concentration (μg/m3) */
  nh3: number
  /** Particulates PM2.5 (μg/m3) */
  pm2_5: number
  /** Particulates PM10 (μg/m3) */
  pm10: number
  /** Full map of all pollutant components */
  components: Record<string, number>
}

/**
 * Represents UV Index data and safe exposure times.
 * Derived from OpenWeatherMap UV Index API.
 */
export interface UVIndexData {
  /** Current UV Index value */
  uvIndex: number
  /** Maximum UV Index for the day */
  uvIndexMax: number
  /** 
   * Calculated safe exposure times (in minutes) for different skin types.
   * Keys st1-st6 represent Fitzpatrick skin types I-VI.
   */
  safeExposureTime?: {
    st1: number
    st2: number
    st3: number
    st4: number
    st5: number
    st6: number
  }
}

/**
 * Represents Pollen count data and risk levels.
 * Note: Often simulated or derived if direct API data is unavailable.
 */
export interface PollenData {
  /** Grass pollen count/level */
  grass: number
  /** Ragweed pollen count/level */
  ragweed: number
  /** Tree pollen count/level */
  tree: number
  /** Total pollen index */
  total: number
  /** Categorized risk level */
  riskLevel: 'low' | 'medium' | 'high'
}

/**
 * The main aggregated data structure returned to the client.
 * Contains all necessary weather information for the dashboard.
 */
export interface WeatherData {
  /** Location details */
  location: LocationData
  /** Current weather conditions */
  current: CurrentWeather
  /** 7-day daily forecast */
  forecast: DailyForecast[]
  /** Hourly forecast data (optional) */
  hourly?: HourlyForecast[]
  /** Air quality metrics (optional) */
  airQuality?: AirQualityData
  /** UV index metrics (optional) */
  uvIndex?: UVIndexData
  /** Pollen data (optional) */
  pollen?: PollenData
}

/**
 * Result from the Geocoding API.
 * Used when searching for a city by name.
 */
export interface GeocodingResult {
  /** Location name */
  name: string
  /** Latitude */
  lat: number
  /** Longitude */
  lon: number
  /** Country code */
  country?: string
  /** State or region */
  state?: string
  /** Localized names map */
  local_names?: Record<string, string>
}

// ==========================================
// Raw API Response Interfaces
// These match the exact JSON structure returned by OpenWeatherMap
// ==========================================

/**
 * Raw response from OpenWeatherMap Current Weather API.
 */
export interface OpenWeatherResponse {
  coord: {
    lon: number
    lat: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level: number
    grnd_level: number
  }
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  clouds: {
    all: number
  }
  visibility?: number
  pop?: number
  rain?: {
    '1h': number
  }
  snow?: {
    '1h': number
  }
  dt: number
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

/**
 * Raw response from OpenWeatherMap Air Pollution API.
 */
export interface AirQualityResponse {
  coord: [number, number]
  list: Array<{
    main: {
      aqi: number
    }
    components: {
      co: number
      no: number
      no2: number
      o3: number
      so2: number
      nh3: number
      pm2_5: number
      pm10: number
    }
    dt: number
  }>
}

/**
 * Raw response from OpenWeatherMap UV Index API.
 */
export interface UVIndexResponse {
  lat: number
  lon: number
  elev: number
  dt: number
  value: number
  max?: number
  max_dt?: number
}