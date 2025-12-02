# Copilot Instructions for Weather App Project

## Project Overview
A Next.js 14 weather application with an Apple glass-design aesthetic featuring real-time weather data, 7-day forecasts, and advanced metrics (air quality, UV index, pollen counts) from the OpenWeatherMap API.

## Architecture & Data Flow

### Client-Server Pattern
- **Client Layer** (`src/app/page.tsx`): React components with `'use client'` directive (client-side rendering)
- **API Layer** (`src/app/api/`): Next.js route handlers acting as backend proxies
- **Service Layer** (`src/lib/weather-api.ts`): Centralized axios client managing all OpenWeatherMap API calls with configurable base URL and timeout (10s)
- **State Management**: React hooks (`useWeather`, `useAnimatedNumber`) - no external state library

### Data Pipeline
1. User searches location via `SearchBar` → calls `/api/geocode`
2. `/api/geocode` performs reverse geocoding to get lat/lon coordinates
3. `/api/weather?lat=X&lon=Y` aggregates multiple API endpoints with fallback strategy
4. API layer fetches: current weather, forecast (daily/hourly), air quality, UV index, pollen data
5. Transformations applied in `weather-api.ts` before returning to client

### Resilience Pattern
`fetchWithFallback()` wrapper in both `/api/weather` and `useWeather` ensures failed optional endpoints (air quality, UV, pollen) return sensible defaults (0 values or empty objects) rather than breaking the entire request.

## Key Files & Patterns

### Components
- **`GlassCard.tsx`**: Reusable glass container with variant system (`primary`, `secondary`, `tertiary`). Supports `animateHover` prop (`lift`, `scale`, `both`, `none`) - example of composition over JSX nesting
- **`SearchBar.tsx`**: Handles geocoding integration and location selection
- **`WeatherIcon.tsx`**: Animated weather condition indicators using react-icons
- **`HourlyForecast.tsx`**: Horizontal scrollable hourly data display

### Hooks
- **`useWeather.ts`**: Orchestrates all API calls with error handling and state updates
- **`useAnimatedNumber.ts`**: Animates numeric values (temperatures, humidity) from start to end via Framer Motion

### Type System
`src/lib/types.ts` defines comprehensive interfaces: `WeatherData`, `CurrentWeather`, `DailyForecast`, `HourlyForecast`, `AirQualityData`, `UVIndexData`, `PollenData`. All API responses are typed end-to-end.

## Build & Deployment

### Commands
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Next.js build (static export by default)
npm run start        # Production server
npm run lint         # ESLint check
npm run test         # Jest tests (configured for jsdom + TypeScript)
```

### Environment Variables
- `OPENWEATHER_API_KEY` (required): OpenWeatherMap API key
- `OPENWEATHER_BASE_URL` (optional): Defaults to `https://api.openweathermap.org/data/2.5`
- `NEXT_PUBLIC_GEOCODING_API_URL` (optional): Geocoding endpoint

### Testing Setup
- **Jest + ts-jest** for TypeScript support
- **jsdom** environment for DOM testing
- **@testing-library/react** for component rendering
- Path alias `@/*` maps to `src/*`
- Setup file: `jest.setup.ts`
- Config variants: `tsconfig.jest.json` (JSX emission) vs `tsconfig.json` (default)

## Project-Specific Conventions

### Component Structure
1. Always use `'use client'` at top of client-rendered components
2. Export components with named exports (not default)
3. Props interface suffix: `Props` (e.g., `GlassCardProps`)
4. Variants use string literal unions (e.g., `'primary' | 'secondary'`)

### API Error Handling
- Use `fetchWithFallback()` for optional data sources
- Return `NextResponse.json()` with appropriate HTTP status codes
- Log API errors to console for debugging (sensitive info partially masked)
- Fallback data ensures partial failures don't cascade

### Styling

#### Glass Design Pattern
The project implements an Apple-inspired glassmorphism aesthetic using a consistent pattern:

```css
/* Base Glass Card Structure (from globals.css) */
.glass-card {
  backdrop-filter: blur(40px);                    /* Frosted glass blur effect */
  border: 1px solid rgba(255, 255, 255, 0.1);    /* Subtle white border */
  background: rgba(15, 23, 42, 0.4);             /* Semi-transparent dark background */
  box-shadow: var(--shadow-md);                   /* Depth via shadow */
}

/* Variant System (3 opacity tiers for hierarchy) */
.glass-card-primary {
  background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  border-color: rgba(255, 255, 255, 0.15);
}

.glass-card-secondary {
  background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.05));
  border-color: rgba(255, 255, 255, 0.10);
}

.glass-card-tertiary {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.10);
}

/* Hover Elevation (lift effect, increased blur and shadow) */
.glass-card-primary:hover {
  background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.20), rgba(255, 255, 255, 0.10));
  transform: translateY(-4px);                    /* Primary cards lift more */
  box-shadow: var(--shadow-xl);
}
```

**Key Principles:**
- **Backdrop-filter blur(40px)**: Creates the frosted glass effect (GPU-accelerated)
- **rgba() + opacity**: Layered semi-transparent backgrounds for depth
- **Subtle borders**: White @ 0.1-0.25 opacity for edge definition
- **Shadow system**: Predefined shadows (--shadow-md/lg/xl) indicate elevation
- **Hover transforms**: `translateY()` + enhanced shadow = lift effect (NOT Framer Motion—use CSS)

**Usage in Components:**
```tsx
/* GlassCard.tsx applies these classes dynamically */
<div className={`glass-card glass-card-${variant} ${roundedClasses} ${shadowClasses}`}>
  {children}
</div>
```

#### Global Styling System
- **Tailwind CSS 4** with PostCSS
- **Global styles**: `src/app/globals.css` defines CSS custom properties (variables) and component classes
- **Weather-responsive classes**: `body.weather-sunny`, `body.weather-rainy`, `body.weather-stormy` update background gradients dynamically
- **Animations**: Framer Motion (useAnimatedNumber) for numeric transitions; Tailwind hover/transition classes for UI feedback

### Type Safety
- All API responses must be typed via `types.ts`
- Use `as const` for discriminated unions (e.g., risk levels: `'low' | 'high'`)
- Avoid `any`; use generics in utility functions like `fetchWithFallback<T>`

## Critical Integration Points

### OpenWeatherMap API
- Current weather: `/weather?lat,lon`
- Forecast: `/forecast?lat,lon` (returns 5-day data)
- Air quality: `/air_pollution?lat,lon`
- UV index: `/uvi?lat,lon`
- Geocoding: `/geo/1.0/direct?q=location_name`
- All calls include `appid=` and `units=metric` parameters

### Framer Motion Usage
Only `useAnimatedNumber.ts` currently uses Framer Motion for smooth number transitions. All hover/scale animations use Tailwind CSS classes (e.g., `lift-on-hover`, `scale-on-hover`).

## Development Workflows

### Adding a New Weather Metric
1. Add interface to `src/lib/types.ts`
2. Create API call method in `src/lib/weather-api.ts`
3. Add `fetchWithFallback()` call in `/api/weather` route
4. Display in component via state update from fetched data

### Debugging API Issues
- Check `.env.local` for `OPENWEATHER_API_KEY` and `NEXT_PUBLIC_GEOCODING_API_KEY`
- Browser DevTools → Network tab shows full geocode and weather request URLs
- Server console shows `fetchWithFallback` warnings when optional endpoints fail
- Default location is London (`51.5074, -0.1278`)

### Testing Components
Use `@testing-library/react` with jsdom. Component must render without crashing; optional: verify specific text/elements via `screen.getByText()` or `screen.getByRole()`.

## Performance Considerations
- Axios client has 10-second timeout to prevent hanging requests
- Fallback data prevents UI blocking on optional API failures
- Framer Motion animations are GPU-accelerated via CSS transforms
- Next.js App Router enables automatic code splitting

## Known Patterns & Antipatterns

✅ **DO:**
- Use `fetchWithFallback()` for optional weather data
- Type all API responses in `types.ts`
- Use component prop variants for styling variations
- Leverage Tailwind's responsive classes for mobile support

❌ **DON'T:**
- Bypass types with `any`
- Fetch API endpoints directly from components (use API routes)
- Mix CSS animations with Framer Motion for the same element
- Assume all OpenWeatherMap endpoints succeed without fallback

## Quick Checklist for New Features
- [ ] Add types to `src/lib/types.ts` (interfaces, enums)
- [ ] Implement API call in `src/lib/weather-api.ts`
- [ ] Add route handler in `src/app/api/` if needed
- [ ] Update component to display or use new data
- [ ] Add `fetchWithFallback()` for optional endpoints
- [ ] Test with `npm run test` (add test files to `__tests__/`)
- [ ] Verify in dev server: `npm run dev`
