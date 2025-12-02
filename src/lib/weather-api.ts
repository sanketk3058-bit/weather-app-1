import axios from 'axios'
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

const BASE_URL = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5'
const API_KEY = process.env.OPENWEATHER_API_KEY

if (!API_KEY) {
  throw new Error('OPENWEATHER_API_KEY environment variable is not defined')
}

class WeatherAPIService {
  private client = axios.create({
    baseURL: BASE_URL,
    params: {
      appid: API_KEY,
      units: 'metric',
    },
    timeout: 10000, // 10 second timeout
  })

  async getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
    const response = await this.client.get('/weather', {
      params: { lat, lon },
    })

    return this.transformCurrentWeather(response.data)
  }

  async getForecast(lat: number, lon: number): Promise<{ daily: DailyForecast[], hourly: any[] }> {
    const response = await this.client.get('/forecast', {
      params: { lat, lon },
    })

    return this.processForecastData(response.data)
  }

  async getAirQuality(lat: number, lon: number): Promise<AirQualityData> {
    const response = await this.client.get('/air_pollution', {
      params: { lat, lon },
    })

    return this.transformAirQuality(response.data)
  }

  async getUVIndex(lat: number, lon: number): Promise<UVIndexData> {
    const response = await this.client.get('/uvi', {
      params: { lat, lon },
    })

    return this.transformUVIndex(response.data)
  }

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
      dewPoint: data.main.humidity > 0 ? data.main.temp - ((100 - data.main.humidity) / 5) : undefined,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
    }
  }

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

      // Daily Aggregation
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          items: [item]
        });
      } else {
        const dayData = dailyMap.get(date);
        dayData.temp_min = Math.min(dayData.temp_min, item.main.temp_min);
        dayData.temp_max = Math.max(dayData.temp_max, item.main.temp_max);
        dayData.items.push(item);
      }
    });

    // Transform daily map to DailyForecast array
    const daily: DailyForecast[] = Array.from(dailyMap.entries()).slice(0, 7).map(([date, data]: [string, any]) => {
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

  private transformUVIndex(data: UVIndexResponse): UVIndexData {
    return {
      uvIndex: data.value,
      uvIndexMax: data.max || data.value,
      safeExposureTime: data.max ? this.calculateSafeExposureTime(data.max) : undefined,
    }
  }

  private calculateSafeExposureTime(uvIndex: number) {
    // Simplified safe exposure time calculation based on UV index
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

  generatePollenData(current: CurrentWeather, forecast: DailyForecast[]): PollenData {
    // Generate simulated pollen data based on weather conditions
    // Use short-term forecast averages (up to 3 days) if available to improve accuracy
    const temperature = current.temp
    const humidity = current.humidity
    const windSpeed = current.windSpeed

    let avgTemp = temperature
    let avgHumidity = humidity
    let avgWind = windSpeed

    if (forecast && forecast.length > 0) {
      const days = Math.min(3, forecast.length)
      let tSum = 0, hSum = 0, wSum = 0
      for (let i = 0; i < days; i++) {
        tSum += forecast[i].temp.day
        hSum += forecast[i].humidity
        wSum += forecast[i].windSpeed
      }
      avgTemp = (temperature * 0.6) + ((tSum / days) * 0.4)
      avgHumidity = (humidity * 0.6) + ((hSum / days) * 0.4)
      avgWind = (windSpeed * 0.6) + ((wSum / days) * 0.4)
    }

    // Pollen score calculation adjusted for averages and normalized
    const rawScore = Math.max(0, (avgTemp - 8) * (avgHumidity / 100) * (avgWind / 7))
    const normalized = Math.min(10, rawScore)

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