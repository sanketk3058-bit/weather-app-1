# Timezone & Country Population Fix Plan

**Issue ID:** 3 (from LOGIC_AUDIT_REPORT.md)  
**Severity:** MEDIUM  
**Status:** ✅ FIXED  
**Date:** 2025-11-26T22:50:43.781Z  
**Author:** GitHub Copilot  

## Issue Summary
- **Location**: `src/app/api/weather/route.ts` lines 84-91
- **Problem**: `timezone` and `country` fields are always empty strings in the `WeatherData` object
- **Impact**: 
  - Incomplete location data (country shows as blank)
  - Timezone-naive displays for sunrise/sunset (shows user's local time instead of location time)
  - Forecast date grouping assumes UTC

## Root Cause Analysis
1. **Country field**: Not extracted from geocoding API response (available in `GeocodingResult.country`)
2. **Timezone field**: Not extracted from OpenWeatherMap current weather response (`data.timezone` offset in seconds)

**Data Sources:**
```
Geocoding API → { name, lat, lon, country, state }
Current Weather API → { ..., timezone: 3600 (offset in seconds), ... }
```

## Solution Strategy

### Phase 1: Extract Country from Geocoding
1. Update `reverseGeocode()` to return full `GeocodingResult` (including `country`)
2. Pass country from geocoding result to `WeatherData.location.country`

### Phase 2: Extract Timezone from Current Weather API
1. Add `timezone?: number` to `CurrentWeather` interface
2. Extract `data.timezone` in `transformCurrentWeather()`
3. Set `WeatherData.location.timezone = current.timezone`

### Phase 3: UI Timezone Awareness (Optional Enhancement)
1. Update sunrise/sunset formatting to use location timezone offset
2. Update forecast date parsing to use location timezone

## Implementation Steps

### Step 1: Update Types (`src/lib/types.ts`)
```typescript
interface CurrentWeather {
  // ... existing fields
  timezone?: number;  // Add: timezone offset in seconds
}

interface LocationData {
  name: string;
  country: string;    // Ensure properly typed (already exists)
  lat: number;
  lon: number;
  timezone: string;   // Can remain string for display, populate from current.timezone
}
```

### Step 2: Update Weather API Service (`src/lib/weather-api.ts`)
**A. Fix `reverseGeocode()` return type:**
```typescript
async reverseGeocode(lat: number, lon: number): Promise<GeocodingResult | null> {
  // ... existing code
  if (response.data && response.data.length > 0) {
    const location = response.data[0]
    return {
      name: location.name,
      lat: location.lat,
      lon: location.lon,
      country: location.country,  // ✅ Extract country
      state: location.state,
    }
  }
  return null
}
```

**B. Update `transformCurrentWeather()`:**
```typescript
private transformCurrentWeather(data: OpenWeatherResponse): CurrentWeather {
  return {
    // ... existing fields
    timezone: data.timezone,  // ✅ Extract timezone offset
  }
}
```

**C. Add timeout to geocoding calls (Bonus: Fixes Issue #5):**
```typescript
const response = await axios.get(url, {
  params: { ... },
  timeout: 10000  // ✅ Add 10s timeout
})
```

### Step 3: Update API Route (`src/app/api/weather/route.ts`)
```typescript
// Reverse geocode for location data
const reversed = await weatherAPI.reverseGeocode(lat, lon)
const locationData = reversed || { name: locationName, country: '', lat, lon }

const current = await weatherAPI.getCurrentWeather(lat, lon)

const weatherData: WeatherData = {
  location: {
    name: locationData.name,
    country: locationData.country,  // ✅ From geocoding
    lat,
    lon,
    timezone: current.timezone?.toString() || '',  // ✅ From current weather
  },
  current,
  // ... rest unchanged
}
```

### Step 4: UI Updates (`src/app/page.tsx`) - Optional but Recommended
```typescript
// Helper function for timezone-aware time formatting
const formatLocalTime = (timestamp: number, timezoneOffset: number) => {
  return new Date((timestamp + timezoneOffset) * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Usage:
{formatLocalTime(weatherData.current.sunrise, parseInt(weatherData.location.timezone || '0'))}
```

## Files to Modify (Priority Order)
| File | Changes | Effort |
|------|---------|--------|
| `src/lib/types.ts` | Add `timezone?: number` to `CurrentWeather` | Low |
| `src/lib/weather-api.ts` | Update `reverseGeocode()`, `transformCurrentWeather()`, add timeouts | Medium |
| `src/app/api/weather/route.ts` | Use geocoding result & current.timezone | Low |
| `src/app/page.tsx` | Timezone-aware formatting (optional) | Low |

## Testing Strategy
### Unit Tests (`__tests__/`)
1. Mock geocoding response → Verify `country` extracted
2. Mock current weather → Verify `timezone` extracted
3. Test fallback behavior (null geocoding → empty country)

### Integration Tests
1. Full API flow: Search location → Verify complete `location` object
2. Verify sunrise/sunset times match expected timezone

### Manual Verification
```
1. npm run dev
2. Search "London" → Check country: "GB", timezone populated
3. Check sunrise/sunset → Should show local time (not UTC)
4. Test "Current Location" → Reverse geocoding works
```

## Rollout Plan
```
Phase 1: Types + API Service (30 min)
Phase 2: API Route (10 min)  
Phase 3: Testing (20 min)
Phase 4: UI Polish (15 min, optional)
Total: ~75 minutes
```

## Risk Assessment
- ✅ **Low Risk**: Purely additive changes
- ✅ **Backward Compatible**: Fallbacks to empty strings
- ✅ **No Breaking Changes**: Existing code unaffected
- ✅ **Type Safe**: Full TypeScript coverage

## Success Criteria
- [ ] `country` field populated from geocoding
- [ ] `timezone` field populated from current weather API
- [ ] Sunrise/sunset displays location time (not user local time)
- [ ] All tests pass: `npm run test`
- [ ] No new lint errors: `npm run lint`
- [ ] App works with missing API data (graceful fallbacks)

**Next:** LOGIC_AUDIT_REPORT.md updated and fix implemented (country & timezone populated)
