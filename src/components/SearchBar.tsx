'use client'

import React, { useEffect, useRef, useState } from 'react'
import { GlassCard } from './GlassCard'
import { FiSearch, FiX, FiMapPin } from 'react-icons/fi'

interface SearchBarProps {
  onSearch: (lat: number, lon: number, location: string) => void
  isLoading?: boolean
}

type GeoLocation = {
  name: string
  lat: number
  lon: number
  country?: string
  state?: string
}

const FETCH_TIMEOUT = 8000 // ms

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [searching, setSearching] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const rootRef = useRef<HTMLDivElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('weather-search-history')
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved))
      } catch {
        setSearchHistory([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('weather-search-history', JSON.stringify(searchHistory.slice(0, 5)))
  }, [searchHistory])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
        setActiveIndex(null)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  // Debounced suggestions fetch
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => {
      abortRef.current?.abort()
      const c = new AbortController()
      abortRef.current = c

      fetchSuggestions(query, c.signal)
        .then((items) => {
          setSuggestions(items)
          setShowSuggestions(items.length > 0 || searchHistory.length > 0)
          setActiveIndex(items.length > 0 ? 0 : null)
        })
        .catch((err) => {
          if ((err as any)?.name === 'AbortError') return
          console.error('Suggestion fetch failed:', err)
          setSuggestions([])
          setShowSuggestions(searchHistory.length > 0)
        })
    }, 300)

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [query, searchHistory])

  async function fetchWithTimeout(url: string, options: RequestInit = {}) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT)
    const signal = options.signal
      ? new AbortController().signal // ensure separate if user passed signal; we don't merge
      : controller.signal

    try {
      const res = await fetch(url, { ...options, signal })
      const text = await res.text().catch(() => '')
      return { res, text }
    } finally {
      clearTimeout(timeout)
    }
  }

  async function fetchSuggestions(q: string, signal?: AbortSignal): Promise<GeoLocation[]> {
    try {
      const url = `/api/geocode?q=${encodeURIComponent(q)}`
      const controller = new AbortController()
      if (signal) signal.addEventListener('abort', () => controller.abort())

      const response = await fetch(url, { signal: controller.signal })
      const raw = await response.text().catch(() => '')
      console.debug('[geocode suggestions] url:', url, 'status:', response.status, 'body:', raw)

      if (!response.ok) {
        // do not alert user for suggestions; just log and return empty
        return []
      }

      const data = JSON.parse(raw || '[]')
      return (data || []).map((d: any) => ({ name: d.name, lat: d.lat, lon: d.lon, country: d.country, state: d.state }))
    } catch (err) {
      if ((err as any)?.name === 'AbortError') return []
      console.error('fetchSuggestions error', err)
      return []
    }
  }

  async function doSearch(trimmed: string) {
    if (!trimmed.trim()) return
    setSearching(true)

    try {
      // Update history
      setSearchHistory((prev) => {
        const next = [trimmed, ...prev.filter((h) => h !== trimmed)].slice(0, 5)
        return next
      })

      // perform fetch with debug and readable errors
      const url = `/api/geocode?q=${encodeURIComponent(trimmed)}`
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT)

      let raw = ''
      let status = 0
      try {
        const res = await fetch(url, { signal: controller.signal /* credentials: 'include' if needed */ })
        status = res.status
        raw = await res.text().catch(() => '')
        console.debug('[geocode] url:', url, 'status:', status, 'body:', raw)

        if (!res.ok) {
          let msg = raw
          try {
            const parsed = JSON.parse(raw)
            msg = parsed?.message || parsed?.error || JSON.stringify(parsed)
          } catch { }

          if (res.status === 401) {
            throw new Error(`Unauthorized (401): ${msg || 'Server rejected request (invalid/missing API key)'}`)
          }

          throw new Error(`${res.status} ${res.statusText}: ${msg || 'Failed to find location'}`)
        }
      } finally {
        clearTimeout(timeout)
      }

      const locations = JSON.parse(raw || '[]')
      if (locations && Array.isArray(locations) && locations.length > 0) {
        const location = locations[0]
        onSearch(location.lat, location.lon, `${location.name}${location.state ? ', ' + location.state : ''}${location.country ? ', ' + location.country : ''}`)
        setQuery('')
        setShowSuggestions(false)
        setSuggestions([])
        setActiveIndex(null)
      } else {
        throw new Error('Location not found')
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('Unauthorized (401)')) {
          alert('Search failed: Unauthorized (401). Check server API key / geocoding service configuration.')
        } else if ((err as any)?.name === 'AbortError') {
          alert('Search failed: Request timed out. Try again.')
        } else {
          alert(`Search failed: ${err.message}`)
        }
        console.error('doSearch error:', err)
      } else {
        alert('Search failed: Unexpected error')
        console.error('doSearch unknown error:', err)
      }
    } finally {
      setSearching(false)
    }
  }

  const handleSearch = () => {
    if (!query.trim()) return
    doSearch(query.trim())
  }

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setSearching(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          // Reverse geocode to get name
          const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}&location=Current%20Location`)
          if (response.ok) {
            const data = await response.json()
            onSearch(latitude, longitude, data.location.name)
            setQuery('')
            setShowSuggestions(false)
          } else {
            // Fallback if weather API doesn't return name nicely or just use "Current Location"
            onSearch(latitude, longitude, "Current Location")
          }
        } catch (error) {
          console.error('Locate me error:', error)
          onSearch(latitude, longitude, "Current Location")
        } finally {
          setSearching(false)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        let msg = 'Failed to retrieve location.'
        if (error.code === error.PERMISSION_DENIED) msg = 'Location permission denied.'
        else if (error.code === error.POSITION_UNAVAILABLE) msg = 'Location information is unavailable.'
        else if (error.code === error.TIMEOUT) msg = 'The request to get user location timed out.'
        alert(msg)
        setSearching(false)
      },
      { timeout: 10000 }
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (showSuggestions && activeIndex !== null && suggestions[activeIndex]) {
        const s = suggestions[activeIndex]
        doSearch(`${s.name}${s.state ? ', ' + s.state : ''}${s.country ? ', ' + s.country : ''}`)
      } else {
        doSearch(query.trim())
      }
      e.preventDefault()
      return
    }

    if (e.key === 'ArrowDown') {
      if (!showSuggestions || suggestions.length === 0) return
      setActiveIndex((idx) => {
        if (idx === null) return 0
        return Math.min(suggestions.length - 1, idx + 1)
      })
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      if (!showSuggestions || suggestions.length === 0) return
      setActiveIndex((idx) => {
        if (idx === null) return 0
        return Math.max(0, idx - 1)
      })
      e.preventDefault()
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveIndex(null)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setShowSuggestions(false)
    setActiveIndex(null)
  }

  const handleHistoryClick = (location: string) => {
    setQuery(location)
    doSearch(location)
  }

  const handleSuggestionClick = (loc: GeoLocation) => {
    const label = `${loc.name}${loc.state ? ', ' + loc.state : ''}${loc.country ? ', ' + loc.country : ''}`
    doSearch(label)
  }

  return (
    <div className="search-bar-refined fade-in anim-fade-scale anim-stagger-50" ref={rootRef}>
      <div className="relative">
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (e.target.value.trim()) setShowSuggestions(true)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowSuggestions(suggestions.length > 0)}
          placeholder="Search for a location..."
          className="glass-card glass-card-tertiary text-foreground placeholder:text-muted-foreground border-glass-border focus:border-ring focus:ring-1 p-3 rounded-lg"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showSuggestions}
          role="combobox"
        />

        <div className="search-icon-container">
          {query && (
            <button
              onClick={clearSearch}
              className="p-2 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              aria-label="Clear search"
              type="button"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleLocateMe}
            disabled={isLoading || searching}
            className="p-2 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            aria-label="Locate me"
            type="button"
            title="Use current location"
          >
            <FiMapPin className="w-4 h-4" />
          </button>

          <button
            onClick={handleSearch}
            disabled={isLoading || searching || !query.trim()}
            className={`p-2.5 rounded-xl transition-all ${!isLoading && !searching && query.trim()
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25'
              : 'text-white/30 cursor-not-allowed'
              }`}
            aria-label="Search"
            type="button"
          >
            {isLoading || searching ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FiSearch className={`w-5 h-5 ${query ? 'anim-icon-pulse' : ''}`} />
            )}
          </button>
        </div>

        {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
          <div id="search-suggestions" className="suggestions-refined" role="listbox" aria-labelledby="search-input">
            {suggestions.length > 0 && (
              <>
                <div className="px-4 py-2 text-white/40 text-xs font-semibold uppercase tracking-wider">Suggestions</div>
                {suggestions.map((s, i) => {
                  const label = `${s.name}${s.state ? ', ' + s.state : ''}${s.country ? ', ' + s.country : ''}`
                  const isActive = activeIndex === i
                  return (
                    <button
                      key={`${s.name}-${s.lat}-${s.lon}-${i}`}
                      onClick={() => handleSuggestionClick(s)}
                      className={`suggestion-item-refined ${isActive ? 'selected' : ''}`}
                      role="option"
                      aria-selected={isActive}
                    >
                      <span className="truncate">{label}</span>
                    </button>
                  )
                })}
              </>
            )}

            {searchHistory.length > 0 && (
              <>
                <div className="px-4 py-2 mt-2 text-white/40 text-xs font-semibold uppercase tracking-wider">Recent</div>
                {searchHistory.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(location)}
                    className="suggestion-item-refined"
                  >
                    <span className="truncate">{location}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
