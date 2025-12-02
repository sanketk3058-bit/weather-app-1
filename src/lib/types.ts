// Location data interface
export interface LocationData {
  name: string
  country: string
  lat: number
  lon: number
  timezone: string
}

// Current weather interface
export interface CurrentWeather {
  temp: number
  feelsLike: number
  humidity: number
  pressure: number
  windSpeed: number
  description: string
  icon: string
  visibility?: number
  dewPoint?: number
  sunrise?: number
  sunset?: number
  timezone?: number
}

// Weather condition interface
export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

// Daily forecast interface
export interface DailyForecast {
  date: string
  temp: {
    day: number
    min: number
    max: number
    night: number
    eve: number
    morn: number
  }
  feelsLike: {
    day: number
    night: number
    eve: number
    morn: number
  }
  pressure: number
  humidity: number
  dewPoint: number
  windSpeed: number
  windDeg: number
  windGust?: number
  weather: WeatherCondition[]
  clouds: number
  pop: number
  rain?: number
  snow?: number
  uvi: number
}

// Hourly forecast interface
export interface HourlyForecast {
  dt: number
  temp: number
  feelsLike: number
  pressure: number
  humidity: number
  dewPoint: number
  uvi: number
  clouds: number
  visibility: number
  windSpeed: number
  windDeg: number
  windGust?: number
  weather: WeatherCondition[]
  pop: number
  rain?: {
    '1h': number
  }
  snow?: {
    '1h': number
  }
}

// Air quality interface
export interface AirQualityData {
  aqi: number
  co: number
  no: number
  no2: number
  o3: number
  so2: number
  nh3: number
  pm2_5: number
  pm10: number
  components: Record<string, number>
}

// UV index interface
export interface UVIndexData {
  uvIndex: number
  uvIndexMax: number
  safeExposureTime?: {
    st1: number
    st2: number
    st3: number
    st4: number
    st5: number
    st6: number
  }
}

// Pollen data interface
export interface PollenData {
  grass: number
  ragweed: number
  tree: number
  total: number
  riskLevel: 'low' | 'medium' | 'high'
}

// Main weather data interface
export interface WeatherData {
  location: LocationData
  current: CurrentWeather
  forecast: DailyForecast[]
  hourly?: HourlyForecast[]
  airQuality?: AirQualityData
  uvIndex?: UVIndexData
  pollen?: PollenData
}

// Geocoding result interface
export interface GeocodingResult {
  name: string
  lat: number
  lon: number
  country?: string
  state?: string
  local_names?: Record<string, string>
}

// API response interfaces
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

export interface UVIndexResponse {
  lat: number
  lon: number
  elev: number
  dt: number
  value: number
  max?: number
  max_dt?: number
}