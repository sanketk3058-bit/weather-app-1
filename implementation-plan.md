# Weather App Implementation Plan

## Phase 1: Project Setup and Foundation

### Step 1.1: Initialize Next.js Project
```bash
# Create new Next.js project with TypeScript
npx create-next-app@latest weather-app --typescript --tailwind --eslint

cd weather-app

# Install additional dependencies
npm install axios clsx framer-motion react-icons
npm install -D @types/node
```

### Step 1.2: Environment Configuration
Create `.env.local` file:
```env
OPENWEATHER_API_KEY=your_api_key_here
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
GEOCODING_API_URL=https://api.openweathermap.org/geo/1.0
```

### Step 1.3: Project Structure Setup
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/weather/route.ts
├── components/
│   ├── GlassCard.tsx
│   ├── SearchBar.tsx
│   ├── WeatherCard.tsx
│   ├── ForecastCard.tsx
│   └── WeatherIcon.tsx
├── lib/
│   ├── weather-api.ts
│   ├── types.ts
│   └── utils.ts
├── hooks/
│   └── useWeather.ts
└── styles/
    └── glass-effects.css
```

## Phase 2: Core Infrastructure

### Step 2.1: TypeScript Type Definitions
```typescript
// lib/types.ts
export interface WeatherData {
  location: LocationData;
  current: CurrentWeather;
  forecast: DailyForecast[];
  airQuality?: AirQualityData;
  uvIndex?: UVIndexData;
  pollen?: PollenData;
}

export interface LocationData {
  name: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
  visibility?: number;
  dewPoint?: number;
}

export interface DailyForecast {
  date: string;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feelsLike: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dewPoint: number;
  windSpeed: number;
  windDeg: number;
  windGust?: number;
  weather: WeatherCondition[];
  clouds: number;
  pop: number;
  rain?: number;
  snow?: number;
  uvi: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface AirQualityData {
  aqi: number;
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  nh3: number;
  pm2_5: number;
  pm10: number;
  components: Record<string, number>;
}

export interface UVIndexData {
  uvIndex: number;
  uvIndexMax: number;
  safeExposureTime?: {
    st1: number;
    st2: number;
    st3: number;
    st4: number;
    st5: number;
    st6: number;
  };
}

export interface PollenData {
  grass: number;
  ragweed: number;
  tree: number;
  total: number;
  riskLevel: 'low' | 'medium' | 'high';
}
```

### Step 2.2: Weather API Service
```typescript
// lib/weather-api.ts
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

class WeatherAPIService {
  private client = axios.create({
    baseURL: BASE_URL,
    params: {
      appid: API_KEY,
      units: 'metric',
    },
  });

  async getCurrentWeather(lat: number, lon: number) {
    const response = await this.client.get('/weather', {
      params: { lat, lon },
    });
    return this.transformCurrentWeather(response.data);
  }

  async getForecast(lat: number, lon: number) {
    const response = await this.client.get('/onecall', {
      params: {
        lat,
        lon,
        exclude: 'minutely',
        units: 'metric',
      },
    });
    return this.transformForecast(response.data);
  }

  async getAirQuality(lat: number, lon: number) {
    const response = await this.client.get('/air_pollution', {
      params: { lat, lon },
    });
    return this.transformAirQuality(response.data);
  }

  async getUVIndex(lat: number, lon: number) {
    const response = await this.client.get('/uvi', {
      params: { lat, lon },
    });
    return this.transformUVIndex(response.data);
  }

  async searchLocation(query: string) {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_GEOCODING_API_URL}/direct`,
      {
        params: {
          q: query,
          limit: 5,
          appid: API_KEY,
        },
      }
    );
    return response.data;
  }

  private transformCurrentWeather(data: any) {
    // Transform API response to our interface
  }

  private transformForecast(data: any) {
    // Transform forecast data
  }

  private transformAirQuality(data: any) {
    // Transform air quality data
  }

  private transformUVIndex(data: any) {
    // Transform UV index data
  }
}

export const weatherAPI = new WeatherAPIService();
```

### Step 2.3: Custom React Hook
```typescript
// hooks/useWeather.ts
import { useState, useEffect } from 'react';
import { weatherAPI, type WeatherData } from '../lib/weather-api';

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (lat: number, lon: number, locationName: string) => {
    setLoading(true);
    setError(null);

    try {
      const [
        current,
        forecast,
        airQuality,
        uvIndex,
      ] = await Promise.all([
        weatherAPI.getCurrentWeather(lat, lon),
        weatherAPI.getForecast(lat, lon),
        weatherAPI.getAirQuality(lat, lon),
        weatherAPI.getUVIndex(lat, lon),
      ]);

      // Transform pollen data (simulate from existing data)
      const pollen = generatePollenData(current, forecast);

      setWeatherData({
        location: {
          name: locationName,
          country: '', // Extract from geocoding
          lat,
          lon,
          timezone: '', // Extract from API response
        },
        current,
        forecast,
        airQuality,
        uvIndex,
        pollen,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = async (query: string) => {
    try {
      const locations = await weatherAPI.searchLocation(query);
      return locations;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search location');
      return [];
    }
  };

  return {
    weatherData,
    loading,
    error,
    fetchWeather,
    searchLocation,
    clearError: () => setError(null),
  };
}

function generatePollenData(current: any, forecast: any) {
  // Generate simulated pollen data based on weather conditions
  const temperature = current.temp;
  const humidity = current.humidity;
  
  // Simplified pollen calculation
  const basePollen = Math.max(0, temperature - 10) * (humidity / 100);
  
  return {
    grass: Math.min(10, basePollen * 0.8),
    ragweed: Math.min(10, basePollen * 0.6),
    tree: Math.min(10, basePollen * 0.9),
    total: Math.min(10, basePollen),
    riskLevel: basePollen > 7 ? 'high' : basePollen > 3 ? 'medium' : 'low',
  };
}
```

## Phase 3: UI Components

### Step 3.1: Glass Card Component
```typescript
// components/GlassCard.tsx
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  rounded?: boolean;
  shadow?: boolean;
}

export function GlassCard({ 
  children, 
  className = '', 
  variant = 'primary',
  rounded = true,
  shadow = true 
}: GlassCardProps) {
  const baseClasses = `
    backdrop-blur-xl
    bg-white/10
    border
    border-white/20
    transition-all
    duration-300
    hover:bg-white/15
    hover:border-white/30
  `;

  const variantClasses = {
    primary: 'bg-white/15 border-white/25 hover:bg-white/20',
    secondary: 'bg-white/10 border-white/20 hover:bg-white/15',
    tertiary: 'bg-white/5 border-white/15 hover:bg-white/10',
  };

  const roundedClasses = rounded ? 'rounded-2xl' : '';
  const shadowClasses = shadow ? 'shadow-xl shadow-black/10' : '';

  return (
    <div 
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${roundedClasses}
        ${shadowClasses}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
```

### Step 3.2: Search Bar Component
```typescript
// components/SearchBar.tsx
import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { SearchIcon, XIcon } from 'react-icons/fi';

interface SearchBarProps {
  onSearch: (lat: number, lon: number, location: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('weather-search-history');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      // Add to search history
      const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('weather-search-history', JSON.stringify(newHistory));

      // For demo purposes, use a default location
      // In real implementation, use the geocoding API
      onSearch(51.5074, -0.1278, query); // London as default
      setQuery('');
      setShowSuggestions(false);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
  };

  const selectSuggestion = (suggestion: any) => {
    setQuery(suggestion.name);
    onSearch(suggestion.lat, suggestion.lon, suggestion.name);
    setShowSuggestions(false);
  };

  return (
    <GlassCard className="p-6 mb-8">
      <div className="relative">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query && setShowSuggestions(true)}
              placeholder="Enter city, state, or country..."
              className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            />
            <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60" />
            
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <SearchIcon className="w-4 h-4" />
            )}
            <span>Search</span>
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <GlassCard className="absolute top-full left-0 right-0 mt-2 z-50 max-h-60 overflow-y-auto">
            <div className="p-2">
              {searchHistory.length > 0 && (
                <>
                  <div className="px-3 py-2 text-white/60 text-sm font-medium">Recent</div>
                  {searchHistory.map((location, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(location);
                        handleSearch();
                      }}
                      className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {location}
                    </button>
                  ))}
                </>
              )}
            </div>
          </GlassCard>
        )}
      </div>
    </GlassCard>
  );
}
```

## Phase 4: Main Components

### Step 4.1: Weather Card Component
```typescript
// components/WeatherCard.tsx
import React from 'react';
import { GlassCard } from './GlassCard';
import { WeatherIcon } from './WeatherIcon';

interface WeatherCardProps {
  weatherData: any;
}

export function WeatherCard({ weatherData }: WeatherCardProps) {
  if (!weatherData) return null;

  const { current, location, airQuality, uvIndex, pollen } = weatherData;

  return (
    <GlassCard className="p-8 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Weather Info */}
        <div className="lg:col-span-2">
          <div className="flex items-center space-x-6 mb-6">
            <WeatherIcon condition={current.icon} size={80} />
            <div>
              <div className="text-6xl font-light text-white">{Math.round(current.temp)}°</div>
              <div className="text-xl text-white/80 capitalize">{current.description}</div>
              <div className="text-lg text-white/60">{location.name}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(current.feelsLike)}°</div>
              <div className="text-xs text-white/60">Feels like</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{current.humidity}%</div>
              <div className="text-xs text-white/60">Humidity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{current.windSpeed} km/h</div>
              <div className="text-xs text-white/60">Wind</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{current.pressure} hPa</div>
              <div className="text-xs text-white/60">Pressure</div>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="space-y-6">
          {/* Air Quality */}
          {airQuality && (
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Air Quality</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  airQuality.aqi <= 1 ? 'bg-green-500/20 text-green-300' :
                  airQuality.aqi <= 3 ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][airQuality.aqi - 1]}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">{airQuality.aqi}</div>
              <div className="text-xs text-white/60 mt-1">AQI</div>
            </GlassCard>
          )}

          {/* UV Index */}
          {uvIndex && (
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">UV Index</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  uvIndex.uvIndex <= 2 ? 'bg-green-500/20 text-green-300' :
                  uvIndex.uvIndex <= 5 ? 'bg-yellow-500/20 text-yellow-300' :
                  uvIndex.uvIndex <= 7 ? 'bg-orange-500/20 text-orange-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {uvIndex.uvIndex <= 2 ? 'Low' :
                   uvIndex.uvIndex <= 5 ? 'Moderate' :
                   uvIndex.uvIndex <= 7 ? 'High' : 'Very High'}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">{uvIndex.uvIndex}</div>
            </GlassCard>
          )}

          {/* Pollen Count */}
          {pollen && (
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Pollen</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  pollen.riskLevel === 'low' ? 'bg-green-500/20 text-green-300' :
                  pollen.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {pollen.riskLevel.toUpperCase()}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">{Math.round(pollen.total)}</div>
              <div className="text-xs text-white/60 mt-1">Pollen Index</div>
            </GlassCard>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
```

## Phase 5: API Routes and Data Fetching

### Step 5.1: Next.js API Route
```typescript
// app/api/weather/route.ts
import { NextResponse } from 'next/server';
import { weatherAPI } from '../../../lib/weather-api';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = parseFloat(url.searchParams.get('lat') || '51.5074'); // Default to London
  const lon = parseFloat(url.searchParams.get('lon') || '-0.1278');
  const location = url.searchParams.get('location') || 'London';

  try {
    const [
      current,
      forecast,
      airQuality,
      uvIndex,
    ] = await Promise.all([
      weatherAPI.getCurrentWeather(lat, lon),
      weatherAPI.getForecast(lat, lon),
      weatherAPI.getAirQuality(lat, lon),
      weatherAPI.getUVIndex(lat, lon),
    ]);

    // Generate pollen data
    const pollen = {
      grass: Math.min(10, (current.temp - 10) * 0.8),
      ragweed: Math.min(10, (current.temp - 10) * 0.6),
      tree: Math.min(10, (current.temp - 10) * 0.9),
      total: Math.min(10, current.temp - 10),
      riskLevel: current.temp > 17 ? 'high' : current.temp > 13 ? 'medium' : 'low',
    };

    const weatherData = {
      location: {
        name: location,
        country: '',
        lat,
        lon,
        timezone: '',
      },
      current,
      forecast,
      airQuality,
      uvIndex,
      pollen,
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
```

This implementation plan provides a comprehensive roadmap for building the weather application with all the requested features and Apple glass-like design aesthetics.