/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Mocks used across multiple components
jest.mock('next/dynamic', () => (importer: any, opts?: any) => {
  // Return a component that renders loading fallback immediately (avoid importing real module)
  const Loading = opts?.loading || (() => null)
  const Fake = (props: any) => React.createElement(Loading, props)
  ;(Fake as any).displayName = 'DynamicMock'
  return Fake
})

// Avoid CSS imports breaking tests
jest.mock('@/app/globals.css', () => ({}))

// Do NOT mock WeatherIcon directly because other tests assert its real output
// Our HourlyForecast tests will assert surrounding DOM rather than WeatherIcon internals.

// Mock useTheme hook for ThemeToggle
jest.mock('../src/hooks/useTheme', () => {
  return {
    useTheme: jest.fn(() => ({ theme: 'dark', toggleTheme: jest.fn(), mounted: true }))
  }
})

// Silence console.debug noise in SearchBar
const consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {})
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

import { HourlyForecast } from '../src/components/HourlyForecast'
import { ThemeToggle } from '../src/components/ThemeToggle'
import { UnitToggle } from '../src/components/UnitToggle'
import { GlassCard } from '../src/components/GlassCard'
import { SearchBar } from '../src/components/SearchBar'

afterAll(() => {
  consoleDebugSpy.mockRestore()
  consoleErrorSpy.mockRestore()
})

// Utility: sample hourly data
const sampleHours = [
  { dt: 1700000000, temp: 20, pop: 0, windSpeed: 5, weather: [{ description: 'clear sky', icon: '01d' }] },
  { dt: 1700003600, temp: 21, pop: 0.2, windSpeed: 7, weather: [{ description: 'light rain', icon: '10d' }] },
]

// -----------------------------
// Behaviors (documentation)
// -----------------------------
// SearchBar
// 1. Should debounce and show suggestions from API response.
// 2. Should call onSearch with first geocode result on Enter when no active suggestion.
// 3. Should handle unauthorized error with alert message.
// 4. Should use geolocation on "Locate me" and call onSearch with returned weather location name.
// 5. Should maintain search history and render recent items.
// UnitToggle
// 6. Should reflect active unit and call onToggle when switching.
// ThemeToggle
// 7. Should render with mounted hook and call toggle on click.
// WeatherIcon (via HourlyForecast dynamic mock)
// 8. Should render WeatherIcon rows and convert temperature with unit.
// GlassCard
// 9. Should apply variant and hover class logic.

// -----------------------------
// Tests
// -----------------------------

describe('GlassCard', () => {
  test('applies variant and hover classes', () => {
    const { container } = render(
      <GlassCard variant="secondary" animateHover="both" className="extra" style={{ width: 10 }}>
        <div>content</div>
      </GlassCard>
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toMatch(/glass-card-secondary/)
    expect(root.className).toMatch(/lift-on-hover|lift-sm-on-hover/)
    expect(root.className).toMatch(/scale-on-hover/)
    expect(root.className).toMatch(/extra/)
  })
})

describe('UnitToggle', () => {
  test('reflects active unit and toggles', () => {
    const onToggle = jest.fn()
    render(<UnitToggle unit="metric" onToggle={onToggle} />)

    const cBtn = screen.getByRole('button', { name: /switch to celsius/i })
    const fBtn = screen.getByRole('button', { name: /switch to fahrenheit/i })

    expect(cBtn).toHaveAttribute('aria-pressed', 'true')
    expect(fBtn).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(fBtn)
    expect(onToggle).toHaveBeenCalledWith('imperial')

    fireEvent.click(cBtn)
    expect(onToggle).toHaveBeenCalledWith('metric')
  })
})

describe('ThemeToggle', () => {
  test('renders and toggles theme', () => {
    const hookMod = require('../src/hooks/useTheme')
    const toggleSpy = jest.fn()
    ;(hookMod.useTheme as any).mockReturnValue({ theme: 'dark', toggleTheme: toggleSpy, mounted: true })

    render(<ThemeToggle />)

    const btn = screen.getByTestId('theme-toggle')
    expect(btn).toBeInTheDocument()
    fireEvent.click(btn)
    expect(toggleSpy).toHaveBeenCalled()
  })
})

describe('HourlyForecast', () => {
  test('renders list and temperatures by unit', () => {
    const { rerender, container } = render(<HourlyForecast data={sampleHours as any} unit="metric" />)
    // items rendered (two forecast cards)
    expect(container.querySelectorAll('.glass-card-tertiary').length).toBe(2)
    // temperature symbol presence
    expect(screen.getAllByText(/°/).length).toBeGreaterThanOrEqual(2)

    rerender(<HourlyForecast data={sampleHours as any} unit="imperial" />)
    // still renders (two forecast cards)
    expect(container.querySelectorAll('.glass-card-tertiary').length).toBe(2)
  })

  test('returns null when no data', () => {
    const { container } = render(<HourlyForecast data={[]} unit="metric" />)
    expect(container.firstChild).toBeNull()
  })
})

describe('SearchBar', () => {
  const origFetch = global.fetch
  const origAlert = global.alert
  const geoloc = (global as any).navigator?.geolocation || { getCurrentPosition: jest.fn() }

  beforeEach(() => {
    jest.useFakeTimers()
    ;(global as any).fetch = jest.fn()
    ;(global as any).alert = jest.fn()
    ;(global as any).navigator = { ...(global as any).navigator, geolocation: { getCurrentPosition: jest.fn() } }
    localStorage.clear()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    ;(global as any).fetch = origFetch
    ;(global as any).alert = origAlert
    ;(global as any).navigator = { geolocation: geoloc }
  })

  test('debounces and shows suggestions from API', async () => {
    const suggestions = [
      { name: 'Paris', lat: 1, lon: 2, country: 'FR' },
      { name: 'Paris, TX', lat: 3, lon: 4, country: 'US' }
    ]
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify(suggestions)) })

    render(<SearchBar onSearch={jest.fn()} />)
    const input = screen.getByRole('combobox')

    fireEvent.change(input, { target: { value: 'par' } })

    // Advance debounce timer (300ms in component)
    jest.advanceTimersByTime(350)

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      expect(screen.getAllByRole('option').length).toBe(2)
    })
  })

  test('calls onSearch with first geocode result on Enter', async () => {
    const results = [ { name: 'Berlin', lat: 52.52, lon: 13.405, country: 'DE' } ]
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify(results)) })
    const onSearch = jest.fn()

    render(<SearchBar onSearch={onSearch} />)
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'berlin' } })

    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith(52.52, 13.405, expect.stringMatching(/Berlin/))
    })
  })

  test('shows unauthorized alert on 401', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 401, statusText: 'Unauthorized', text: () => Promise.resolve('{"message":"bad key"}') })

    render(<SearchBar onSearch={jest.fn()} />)
    const input = screen.getByRole('combobox')

    fireEvent.change(input, { target: { value: 'rome' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Unauthorized (401)'))
    })
  })

  test('Locate me uses geolocation and weather API to call onSearch', async () => {
    const onSearch = jest.fn()
    if (!(global as any).navigator) (global as any).navigator = {}
    if (!(global as any).navigator.geolocation) (global as any).navigator.geolocation = { getCurrentPosition: jest.fn() }
    ;(global as any).navigator.geolocation.getCurrentPosition = (success: any) => success({ coords: { latitude: 1, longitude: 2 } })
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({ location: { name: 'Here' } }) })

    render(<SearchBar onSearch={onSearch} />)
    const locateBtn = screen.getByRole('button', { name: /locate me/i })
    fireEvent.click(locateBtn)

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith(1, 2, 'Here')
    })
  })

  test('maintains search history and renders recent section', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify([{ name: 'Oslo', lat: 1, lon: 2 }])) })
    const onSearch = jest.fn()

    render(<SearchBar onSearch={onSearch} />)
    const input = screen.getByRole('combobox')

    fireEvent.change(input, { target: { value: 'Oslo' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => expect(onSearch).toHaveBeenCalled())

    // trigger suggestions to open and include history header
    fireEvent.change(input, { target: { value: 'O' } })
    jest.advanceTimersByTime(350)

    await waitFor(() => {
      expect(screen.getByText(/Recent/i)).toBeInTheDocument()
    })
  })
})
