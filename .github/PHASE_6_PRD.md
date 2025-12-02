# PHASE 6 PRD: Usability & Experience Enhancements

## Executive Summary
Focus on improving the usability and user experience (UX) of the Weather App by implementing smart location features and direct preference controls. This phase aims to reduce friction for returning users and provide immediate value through geolocation and personalization.

---

## 1. SMART LOCATION FEATURES

### 1.1 "Locate Me" Button

#### Concept
A dedicated button within the search interface that triggers the browser's Geolocation API to fetch the user's current coordinates and load the weather for that location.

#### Requirements
- **UI Element**: A "target" or "GPS" icon button inside the search bar (right side, next to search button).
- **Interaction**:
  - Click triggers `navigator.geolocation.getCurrentPosition`.
  - Show a loading state (spinner or pulse) while fetching.
  - On success: Reverse geocode (if needed by API) or query weather by lat/lon directly. Update app state.
  - On error: Show a user-friendly toast/error message (e.g., "Location access denied" or "Timeout").
- **Permissions**: Handle browser permission prompts gracefully.

#### Implementation Details
- **Icon**: Use `BiCurrentLocation` or similar from `react-icons/bi`.
- **Logic**:
  ```typescript
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Call API with lat/lon
        fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        setLoading(false);
        // Handle errors (PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT)
      }
    );
  };
  ```

### 1.2 Recent Searches

#### Concept
A dropdown or list that appears when the search input is focused, showing the last 3-5 successfully searched locations.

#### Requirements
- **Storage**: Persist recent searches in `localStorage`.
- **UI**:
  - Appears when search input is focused and empty.
  - List items show City Name and Country.
  - "Clear" button to remove individual items or clear all.
- **Behavior**:
  - Clicking an item immediately triggers a search for that location.
  - New successful searches are added to the top.
  - Duplicates are removed (or moved to top).
  - Limit to 5 items.

#### Implementation Details
- **Data Structure**: `Array<{ city: string, country: string, timestamp: number }>`
- **Component**: `RecentSearches` component rendered conditionally within `SearchBar`.

---

## 2. DIRECT PREFERENCES CONTROL

### 2.1 Unit Toggles

#### Concept
Visible, accessible toggles on the main dashboard to switch between measurement units, replacing hidden or non-existent settings.

#### Requirements
- **Temperature**: Toggle between Celsius (°C) and Fahrenheit (°F).
- **Time Format**: Toggle between 12-hour (AM/PM) and 24-hour formats.
- **UI Location**: Top-right corner of the main dashboard or within a "Settings" modal/popover (user requested "directly on dashboard", so top-right is best).
- **Design**:
  - Pill-shaped toggle or segmented control.
  - Active state clearly highlighted (e.g., filled background vs. outline).

#### Implementation Details
- **State**: Global state (Context or simple prop drilling if shallow).
- **Conversion**:
  - API usually returns one format (e.g., Metric).
  - Frontend helper functions to convert values on the fly if API doesn't support dynamic switching efficiently, or refetch with new units.
  - *Recommendation*: Convert on client-side to avoid network requests.
    - `C to F`: `(C * 9/5) + 32`
    - `12h to 24h`: Date formatting utility.

### 2.2 Preference Memory

#### Concept
Persist user preferences so the app retains its state across sessions.

#### Requirements
- **Storage**: `localStorage`.
- **Keys**:
  - `weather_app_units`: `{ temp: 'c' | 'f', time: '12' | '24' }`
  - `weather_app_last_location`: `{ city: string }` or `{ lat: number, lon: number }`
- **Behavior**:
  - On App Load: Read from `localStorage`.
  - If found: Apply settings and load last location.
  - If not found: Default to 'C', '24h', and maybe IP-based location or default city (e.g., London).

---

## 3. IMPLEMENTATION PLAN

### 3.1 Component Updates

#### `src/components/SearchBar.tsx`
- Add "Locate Me" button.
- Implement `RecentSearches` dropdown logic.
- Integrate `localStorage` for search history.

#### `src/app/page.tsx` (Main Dashboard)
- Add `UnitToggle` controls (create new component `src/components/UnitToggle.tsx` or inline).
- Integrate `useEffect` for initialization (checking `localStorage`).
- Update data display logic to respect selected units.

#### `src/lib/utils.ts` (or similar)
- Add conversion helpers: `celsiusToFahrenheit`, `formatTime`.

### 3.2 State Management
- Consider a simple `WeatherContext` or `PreferencesContext` if prop drilling becomes complex. For now, lifting state to `page.tsx` might suffice given the scope.

---

## 4. TESTING & VERIFICATION

### 4.1 Manual Testing Checklist
- [ ] **Geolocation**:
  - Click "Locate Me". Allow permission. Verify correct weather loads.
  - Click "Locate Me". Deny permission. Verify error message.
- [ ] **Recent Searches**:
  - Search for "London", "Paris", "Tokyo".
  - Reload page. Click search bar. Verify list appears.
  - Click "Paris". Verify it loads.
- [ ] **Unit Toggles**:
  - Switch to °F. Verify all temps update correctly.
  - Switch to 12h. Verify hourly forecast/sunrise times format correctly.
  - Reload page. Verify settings persist.
- [ ] **Persistence**:
  - Close tab. Reopen. Verify last location loads automatically.

### 4.2 Automated Testing (Optional/Future)
- Unit tests for conversion functions.
- Component tests for `SearchBar` interaction.
