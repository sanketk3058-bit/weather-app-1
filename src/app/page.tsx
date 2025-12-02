'use client'

import { useState, useEffect, useRef } from 'react'
import { GlassCard } from '@/components/GlassCard'
import { SearchBar } from '@/components/SearchBar'
import { WeatherIcon } from '@/components/WeatherIcon'
import { HourlyForecast } from '@/components/HourlyForecast'
import { ThemeToggle } from '@/components/ThemeToggle'
import { FiThermometer, FiDroplet, FiWind, FiActivity, FiTarget, FiSun, FiCloud, FiMoon } from 'react-icons/fi'
import type { WeatherData } from '@/lib/types'
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber'
import { UnitToggle } from '@/components/UnitToggle'
import { convertTemperature } from '@/lib/utils'

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [isLoaded, setIsLoaded] = useState(false)
  const searchIdRef = useRef(0)

  // Load settings from localStorage
  useEffect(() => {
    const savedUnit = localStorage.getItem('weather-app-unit') as 'metric' | 'imperial'
    if (savedUnit) setUnit(savedUnit)

    const savedLocation = localStorage.getItem('weather-app-last-location')
    if (savedLocation) {
      const { lat, lon, location } = JSON.parse(savedLocation)
      handleSearch(lat, lon, location)
    }
    setIsLoaded(true)
  }, [])

  // Save unit to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('weather-app-unit', unit)
    }
  }, [unit, isLoaded])

  const handleSearch = async (lat: number, lon: number, location: string) => {
    const currentSearchId = ++searchIdRef.current
    setLoading(true)
    setError(null)

    try {
      // Call the actual API route
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}&location=${encodeURIComponent(location)}`)

      // Ignore if a newer search has started
      if (currentSearchId !== searchIdRef.current) {
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }

      const weatherData: WeatherData = await response.json()
      setWeatherData(weatherData)

      // Save last location
      localStorage.setItem('weather-app-last-location', JSON.stringify({ lat, lon, location }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  // Effect to update body class based on weather condition
  useEffect(() => {
    // Reset classes first
    document.body.classList.remove(
      'weather-sunny',
      'weather-cloudy',
      'weather-rainy',
      'weather-stormy',
      'weather-snowy'
    );

    if (weatherData) {
      const condition = weatherData.current.description.toLowerCase();
      let weatherClass = 'weather-cloudy'; // Default

      if (condition.includes('clear') || condition.includes('sun')) {
        weatherClass = 'weather-sunny';
      } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
        weatherClass = 'weather-rainy';
      } else if (condition.includes('storm') || condition.includes('thunder')) {
        weatherClass = 'weather-stormy';
      } else if (condition.includes('snow') || condition.includes('sleet') || condition.includes('ice')) {
        weatherClass = 'weather-snowy';
      } else if (condition.includes('cloud') || condition.includes('overcast') || condition.includes('mist') || condition.includes('fog')) {
        weatherClass = 'weather-cloudy';
      }

      document.body.classList.add(weatherClass);
    } else {
      // Default background if no data
      document.body.classList.add('weather-cloudy');
    }

    return () => {
      // Cleanup on unmount
      document.body.classList.remove(
        'weather-sunny',
        'weather-cloudy',
        'weather-rainy',
        'weather-stormy',
        'weather-snowy'
      );
    }
  }, [weatherData]);

  // Animated values
  const animatedTemp = useAnimatedNumber(weatherData ? Math.round(weatherData.current.temp) : 0);
  const animatedFeelsLike = useAnimatedNumber(weatherData ? Math.round(weatherData.current.feelsLike) : 0);
  const animatedHumidity = useAnimatedNumber(weatherData ? weatherData.current.humidity : 0);
  const animatedWind = useAnimatedNumber(weatherData ? Math.round(weatherData.current.windSpeed) : 0);
  const animatedPressure = useAnimatedNumber(weatherData ? weatherData.current.pressure : 0);
  const animatedUV = useAnimatedNumber(weatherData ? (weatherData.uvIndex?.uvIndex ?? 0) : 0);
  const animatedPollen = useAnimatedNumber(weatherData ? Math.round(weatherData.pollen?.total ?? 0) : 0);
  const animatedAQI = useAnimatedNumber(weatherData ? (weatherData.airQuality?.aqi ?? 0) : 0);

  return (
    <main className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 fade-in relative">
          <div className="absolute top-0 right-0 hidden sm:block">
            <UnitToggle unit={unit} onToggle={setUnit} />
          </div>
          <div className="flex justify-center sm:hidden mb-4">
            <UnitToggle unit={unit} onToggle={setUnit} />
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            <span className="gradient-text">Weather</span>
          </h1>
          <p className="text-base sm:text-lg text-white/70 font-light max-w-2xl mx-auto">
            Get accurate weather forecasts with stunning visuals
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} isLoading={loading} />

        {/* Error Display */}
        {error && (
          <GlassCard className="p-5 sm:p-6 border-red-500/30 bg-red-500/10 fade-in anim-fade-scale anim-stagger-50">
            <div className="flex items-center gap-3">
              <div className="text-red-400 text-xl">⚠️</div>
              <div className="text-red-300 text-sm sm:text-base">{error}</div>
            </div>
          </GlassCard>
        )}

        {/* Weather Display */}
        {weatherData && (
          <div className="space-y-8 sm:space-y-10 fade-in anim-fade-scale">
            {/* Current Weather - Large Card */}
            <GlassCard variant="primary" className="p-8 sm:p-12 border-gradient-primary shadow-level-3 overlay-glow-top anim-slide-up anim-stagger-100" animateHover="lift" enablePressFeedback={true}>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left: Main Weather Info */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <WeatherIcon
                      condition={weatherData.current.description}
                      icon={weatherData.current.icon}
                      size={100}
                      className="flex-shrink-0 anim-fade-scale anim-stagger-50"
                      enableHoverAnimation={true}
                    />
                    <div className="flex-1">
                      <div className="text-6xl sm:text-7xl font-bold text-white leading-none mb-3 anim-fade-scale anim-stagger-100">
                        {convertTemperature(animatedTemp, unit)}°
                      </div>
                      <div className="text-2xl sm:text-3xl text-white/80 capitalize font-light mb-1 weather-main-card__condition">
                        {weatherData.current.description}
                      </div>
                      <div className="text-lg text-white/60 font-light">
                        {weatherData.location.name}
                      </div>
                      <div className="text-sm text-white/50 mt-2">
                        Feels like {convertTemperature(animatedFeelsLike, unit)}°
                      </div>
                    </div>
                  </div>

                  {/* Sunrise/Sunset Display */}
                  {(weatherData.current.sunrise && weatherData.current.sunset) && (
                    <div className="weather-main-card__sunrise-sunset anim-fade-scale anim-stagger-150">
                      <div className="flex items-center gap-3">
                        <div className="text-yellow-400 text-xl"><FiSun /></div>
                        <div>
                          <div className="text-xs text-white/40 uppercase tracking-wider">Sunrise</div>
                          <div className="text-white font-medium">
                            {new Date(weatherData.current.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="w-px h-8 bg-white/10 mx-2"></div>
                      <div className="flex items-center gap-3">
                        <div className="text-orange-400 text-xl"><FiMoon /></div>
                        <div>
                          <div className="text-xs text-white/40 uppercase tracking-wider">Sunset</div>
                          <div className="text-white font-medium">
                            {new Date(weatherData.current.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                    <div className="stat-card anim-fade-scale anim-stagger-100">
                      <div className="stat-card__icon-container info">
                        <FiThermometer />
                      </div>
                      <div className="stat-card__value anim-number-update">{convertTemperature(animatedFeelsLike, unit)}°</div>
                      <div className="stat-card__label">Feels Like</div>
                    </div>
                    <div className="stat-card anim-fade-scale anim-stagger-140">
                      <div className="stat-card__icon-container info">
                        <FiDroplet />
                      </div>
                      <div className="stat-card__value anim-number-update">{Math.round(animatedHumidity)}%</div>
                      <div className="stat-card__label">Humidity</div>
                    </div>
                    <div className="stat-card anim-fade-scale anim-stagger-180">
                      <div className="stat-card__icon-container info">
                        <FiWind />
                      </div>
                      <div className="stat-card__value anim-number-update">{Math.round(animatedWind)}</div>
                      <div className="stat-card__label">Wind km/h</div>
                    </div>
                    <div className="stat-card anim-fade-scale anim-stagger-220">
                      <div className="stat-card__icon-container info">
                        <FiActivity />
                      </div>
                      <div className="stat-card__value anim-number-update">{Math.round(animatedPressure)}</div>
                      <div className="stat-card__label">Pressure</div>
                    </div>
                  </div>
                </div>

                {/* Right: Air Quality, UV, Pollen */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Air Quality */}
                  <div className="stat-card anim-fade-scale anim-stagger-150">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`stat-card__icon-container ${(weatherData.airQuality?.aqi ?? 0) <= 1 ? 'success' :
                        (weatherData.airQuality?.aqi ?? 0) <= 3 ? 'warning' : 'danger'
                        }`}>
                        <FiTarget />
                      </div>
                      <span className={`badge ${(weatherData.airQuality?.aqi ?? 0) <= 1 ? 'badge-success' :
                        (weatherData.airQuality?.aqi ?? 0) <= 3 ? 'badge-warning' : 'badge-danger'
                        }`}>
                        <span className="badge__dot"></span>
                        {weatherData.airQuality?.aqi ? ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][(weatherData.airQuality.aqi ?? 1) - 1] : 'N/A'}
                      </span>
                    </div>
                    <div className="stat-card__value anim-number-update">
                      {Math.round(animatedAQI)}
                    </div>
                    <div className="stat-card__label">Air Quality Index</div>
                    <div className="stat-card__description">
                      Main pollutant: {weatherData.airQuality?.components?.pm2_5 ? 'PM2.5' : 'N/A'}
                    </div>
                  </div>

                  {/* UV Index */}
                  <div className="stat-card anim-fade-scale anim-stagger-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`stat-card__icon-container ${(weatherData.uvIndex?.uvIndex ?? 0) <= 2 ? 'success' :
                        (weatherData.uvIndex?.uvIndex ?? 0) <= 5 ? 'warning' :
                          (weatherData.uvIndex?.uvIndex ?? 0) <= 7 ? 'warning' : 'danger'
                        }`}>
                        <FiSun />
                      </div>
                      <span className={`badge ${(weatherData.uvIndex?.uvIndex ?? 0) <= 2 ? 'badge-success' :
                        (weatherData.uvIndex?.uvIndex ?? 0) <= 5 ? 'badge-warning' :
                          (weatherData.uvIndex?.uvIndex ?? 0) <= 7 ? 'badge-warning' : 'badge-danger'
                        }`}>
                        <span className="badge__dot"></span>
                        {(weatherData.uvIndex?.uvIndex ?? 0) <= 2 ? 'Low' :
                          (weatherData.uvIndex?.uvIndex ?? 0) <= 5 ? 'Moderate' :
                            (weatherData.uvIndex?.uvIndex ?? 0) <= 7 ? 'High' : 'Very High'}
                      </span>
                    </div>
                    <div className="stat-card__value anim-number-update">
                      {animatedUV.toFixed(1)}
                    </div>
                    <div className="stat-card__label">UV Index</div>
                    <div className="stat-card__description">
                      Use sun protection until 4 PM
                    </div>
                  </div>

                  {/* Pollen Count */}
                  <div className="stat-card anim-fade-scale anim-stagger-250">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`stat-card__icon-container ${(weatherData.pollen?.riskLevel ?? 'low') === 'low' ? 'success' :
                        (weatherData.pollen?.riskLevel ?? 'low') === 'medium' ? 'warning' : 'danger'
                        }`}>
                        <FiCloud />
                      </div>
                      <span className={`badge ${(weatherData.pollen?.riskLevel ?? 'low') === 'low' ? 'badge-success' :
                        (weatherData.pollen?.riskLevel ?? 'low') === 'medium' ? 'badge-warning' : 'badge-danger'
                        }`}>
                        <span className="badge__dot"></span>
                        {(weatherData.pollen?.riskLevel ?? 'low').toUpperCase()}
                      </span>
                    </div>
                    <div className="stat-card__value anim-number-update">
                      {Math.round(animatedPollen)}
                    </div>
                    <div className="stat-card__label">Pollen Count</div>
                    <div className="stat-card__description">
                      Primary allergen: Grass
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Hourly Forecast */}
            {weatherData.hourly && weatherData.hourly.length > 0 && (
              <HourlyForecast data={weatherData.hourly} unit={unit} />
            )}

            {/* 7-Day Forecast */}
            <GlassCard variant="primary" className="p-8 sm:p-10 shadow-level-2 anim-slide-up anim-stagger-150" animateHover="lift">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 gradient-text anim-slide-down anim-stagger-50">7-Day Forecast</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(weatherData.forecast ?? []).length > 0 ? (
                  weatherData.forecast?.map((day, index) => {
                    const condition = day.weather[0]?.main.toLowerCase() || 'cloudy';
                    const variantClass =
                      condition.includes('clear') || condition.includes('sun') ? 'sunny' :
                        condition.includes('rain') || condition.includes('drizzle') ? 'rainy' :
                          condition.includes('storm') || condition.includes('thunder') ? 'stormy' :
                            condition.includes('snow') ? 'snowy' : 'cloudy';

                    return (
                      <div key={index} className={`forecast-card ${variantClass} p-6 rounded-2xl border border-white/5 anim-fade-scale`} style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="text-center space-y-4">
                          <div className="text-white/70 text-sm font-semibold uppercase tracking-wide">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="flex justify-center">
                            <WeatherIcon
                              condition={day.weather[0]?.description || ''}
                              icon={day.weather[0]?.icon}
                              size={48}
                              enableHoverAnimation={true}
                            />
                          </div>
                          <div className="text-3xl font-bold text-white anim-number-update">
                            {convertTemperature(day.temp.day, unit)}°
                          </div>
                          <div className="text-white/60 text-xs capitalize">
                            {day.weather[0]?.description}
                          </div>
                          <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-white/50">
                            <div className="flex justify-between">
                              <span>High:</span>
                              <span className="font-semibold text-white/70 anim-number-update">{convertTemperature(day.temp.max, unit)}°</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Low:</span>
                              <span className="font-semibold text-white/70 anim-number-update">{convertTemperature(day.temp.min, unit)}°</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Humidity:</span>
                              <span className="font-semibold text-white/70 anim-number-update">{day.humidity}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="col-span-full text-center py-12 text-white/40">
                    <p>No forecast data available</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-8 fade-in">
            <GlassCard className="p-12">
              <div className="h-96 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl animate-pulse anim-update-pulse"></div>
            </GlassCard>
            <GlassCard className="p-10">
              <div className="h-64 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl animate-pulse anim-update-pulse"></div>
            </GlassCard>
          </div>
        )}
      </div>
      <ThemeToggle />
    </main>
  )
}
