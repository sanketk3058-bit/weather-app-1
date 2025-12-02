# DARK/Light Theme Toggle PRD for Weather App

**Version:** 1.0  
**Date:** November 29, 2025  
**Author:** GitHub Copilot  
**Purpose:** Detailed blueprint for implementing dark/light theme toggle. This PRD is structured for direct execution by an LLM agent using VS Code tools (create_file, replace_string_in_file, insert_edit_into_file). Follow phases sequentially. Validate after each phase with `get_errors` and manual toggle tests.

## 1. High-Level Objective
Add a theme toggle button that switches between light/dark modes using Tailwind's `dark` class on `<html>`. Preserve glassmorphism (blur, borders, opacities). Persist via localStorage + system preference. Smooth CSS transitions. 100% visual coherence (contrast ≥4.5:1 WCAG AA).

**Key Principles:**
- Use CSS custom properties (vars) for all colors/gradients.
- Tailwind `dark:` prefixes + vars.
- Client-side only (no SSR hydration mismatch).
- No new deps (use existing lucide-react or react-icons; install if missing).

## 2. Prerequisites (Phase 0)
1. Ensure `lucide-react` installed (for Sun/Moon icons). If not:
   ```
   npm install lucide-react
   ```
   Update `package.json` types if needed.
2. Confirm Tailwind config supports dark mode.

## 3. Files to Create (Exact Specs)
| File Path | Content Summary | Action |
|-----------|-----------------|--------|
| `src/hooks/useTheme.ts` | Hook for theme state, persistence, toggle. | `create_file` with code below. |
| `src/components/ThemeToggle.tsx` | Glass-tertiary button w/ icons, positioned fixed top-right. | `create_file` with code below. |

**`src/hooks/useTheme.ts`**:
```tsx
'use client';

import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = saved || (systemPrefersDark ? 'dark' : 'light');
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
      setTheme(initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
    setTheme(newTheme);
  };

  return { theme, toggleTheme, mounted };
};
```

**`src/components/ThemeToggle.tsx`**:
```tsx
'use client';

import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full glass-card glass-card-tertiary p-0 shadow-lg transition-all duration-300 hover:glass-card-secondary hover:scale-110 hover:lift-on-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5 text-foreground" /> : <Moon className="h-5 w-5 text-foreground" />}
    </button>
  );
};

ThemeToggle.displayName = 'ThemeToggle';
```

## 4. Files to Edit (Precise Changes)
Use `replace_string_in_file` for exact matches (include 3-5 lines context). Fallback to `insert_edit_into_file`. Group by file.

### 4.1 `tailwind.config.js`
- Enable `darkMode: 'class'`.
```
module.exports = {
  darkMode: 'class',  // ADD THIS LINE
  // ... rest unchanged
```
**Exact Edit:**
Search for `content: ['./src/**/*.{js,ts,jsx,tsx,mdx}',],` and replace block to insert `darkMode: 'class',`.

### 4.2 `src/app/globals.css`
**Major Overhaul:** Extract all hardcoded colors to vars. Add `:root`, `.dark`, transitions, scrollbar themes.

1. **Add CSS Vars Block** (insert after `@tailwind base;`):
```css
:root {
  --foreground: 210 20% 12%; /* slate-900 */
  --foreground-muted: 215 20.2% 65.1%; /* slate-500 */
  --background: 0 0% 98%; /* slate-50 */
  --glass-primary: linear-gradient(to bottom right, rgba(255,255,255,0.25), rgba(255,255,255,0.10));
  --glass-secondary: linear-gradient(to bottom right, rgba(255,255,255,0.15), rgba(255,255,255,0.05));
  --glass-tertiary: rgba(255,255,255,0.08);
  --glass-border: rgba(0,0,0,0.10);
  --body-gradient: linear-gradient(135deg, rgb(245 247 250) 0%, rgb(195 207 226) 100%);
  --weather-sunny: linear-gradient(135deg, #ffd452 0%, #ff9a56 100%);
  --weather-sunny-dark: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  --weather-rainy: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  --weather-rainy-dark: linear-gradient(135deg, #0ea5e9 0%, #1e40af 100%);
  --weather-stormy: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --weather-stormy-dark: linear-gradient(135deg, #3730a3 0%, #1e293b 100%);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --ring: rgb(59 130 246 / 0.5); /* blue-500 */
}

.dark {
  --foreground: 0 0% 98%; /* white */
  --foreground-muted: 217.2 32.6% 76.5%; /* slate-300 */
  --background: 222.2 84% 4.9%; /* slate-900 */
  --glass-primary: linear-gradient(to bottom right, rgba(255,255,255,0.15), rgba(255,255,255,0.05));
  --glass-secondary: linear-gradient(to bottom right, rgba(255,255,255,0.10), rgba(255,255,255,0.05));
  --glass-tertiary: rgba(255,255,255,0.05);
  --glass-border: rgba(255,255,255,0.10);
  --body-gradient: linear-gradient(135deg, rgb(15 15 35) 0%, rgb(26 26 46) 100%);
}

html {
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

body {
  background: var(--body-gradient);
  transition: background 0.3s ease-in-out;
  color: hsl(var(--foreground));
}

/* Weather overrides */
body.weather-sunny { background: var(--weather-sunny); }
.dark body.weather-sunny { background: var(--weather-sunny-dark); }
body.weather-rainy { background: var(--weather-rainy); }
.dark body.weather-rainy { background: var(--weather-rainy-dark); }
body.weather-stormy { background: var(--weather-stormy); }
.dark body.weather-stormy { background: var(--weather-stormy-dark); }

/* Scrollbars */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: hsl(var(--background) / 0.5); }
::-webkit-scrollbar-thumb { background: hsl(var(--foreground) / 0.3); border-radius: 4px; }
.dark ::-webkit-scrollbar-thumb { background: hsl(var(--foreground) / 0.5); }
::-webkit-scrollbar-thumb:hover { background: hsl(var(--foreground) / 0.6); }

/* Tailwind text utilities */
.text-foreground { color: hsl(var(--foreground)); }
.text-muted-foreground { color: hsl(var(--foreground-muted)); }
```

2. **Update Glass Classes** (replace existing `.glass-card` blocks):
```
.glass-card {
  backdrop-filter: blur(40px);
  border: 1px solid var(--glass-border);
  background: var(--glass-primary);
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease-in-out;
}

.glass-card-primary { background: var(--glass-primary); border-color: hsl(var(--glass-border)); }
.glass-card-secondary { background: var(--glass-secondary); border-color: hsl(var(--glass-border)); }
.glass-card-tertiary { background: var(--glass-tertiary); border-color: hsl(var(--glass-border)); }

.glass-card-primary:hover,
.glass-card-secondary:hover,
.glass-card-tertiary:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  backdrop-filter: blur(50px);
}
```

3. **Add Hover Classes** (if missing):
```
.lift-on-hover:hover { transform: translateY(-2px); }
.scale-on-hover:hover { transform: scale(1.05); }
```

### 4.3 `src/app/layout.tsx`
- Add `className="h-full"` to `<html>`.
- Ensure `<body className="min-h-screen antialiased">`.

**Edit:** Replace `<html>` opening tag:
```tsx
<html lang="en" className="h-full scroll-smooth">
```

### 4.4 `src/app/page.tsx`
1. Import `ThemeToggle` and `useWeather` (for weather class).
2. Add `<ThemeToggle />` in layout.
3. Update body class via `useEffect` from `useWeather`.

**Key Inserts:**
- Top: `'use client'; import { ThemeToggle } from '@/components/ThemeToggle';`
- In JSX: Add `<ThemeToggle />` after main container.
- In `useWeather`: Add weather class setter:
```tsx
useEffect(() => {
  if (weatherData?.current?.weather?.[0]?.main?.toLowerCase()) {
    const weatherClass = `weather-${weatherData.current.weather[0].main.toLowerCase()}`;
    document.body.className = `min-h-screen antialiased ${weatherClass}`;
  }
}, [weatherData]);
```

### 4.5 Components (Minimal Changes - Use Vars/Classes)
| Component | Exact Changes |
|-----------|---------------|
| `GlassCard.tsx` | Replace hardcoded `background`, `border-color` with `var(--glass-*)`; add `transition-all duration-300`. Use `text-foreground`, `text-muted-foreground`. |
| `SearchBar.tsx` | Input: `className="glass-card glass-card-tertiary text-foreground placeholder:text-muted-foreground border-glass-border focus:border-ring focus:ring-1"`. |
| `UnitToggle.tsx` | Buttons: `glass-card-secondary text-foreground hover:glass-card-primary`. |
| `WeatherIcon.tsx` | `className="text-foreground dark:text-foreground h-16 w-16"` (icons adapt via parent). |
| `HourlyForecast.tsx` | Items: `glass-card-tertiary`; scrollbar inherits globals. |

**Example for GlassCard.tsx (replace_string):**
Find:
```
background: rgba(15, 23, 42, 0.4);
```
Replace with:
```
background: var(--glass-primary);
```

## 5. Implementation Phases (Sequential)
1. **Phase 1:** Create hooks/components. Run `npm run dev`, test toggle (class on html).
2. **Phase 2:** Edit `tailwind.config.js` + `globals.css`. Validate vars (inspect DOM).
3. **Phase 3:** Edit `layout.tsx`, `page.tsx`. Test persistence/system pref.
4. **Phase 4:** Update all components. Audit visuals: toggle → check contrast, glass, hovers, weather bg, scrollbars.
5. **Phase 5:** Add tests (`__tests__/theme.test.tsx`): render toggle, simulate click, assert class.

## 6. Validation Checklist
- [ ] `dark` class toggles on html.
- [ ] localStorage persists.
- [ ] System pref on first load.
- [ ] No console errors (`get_errors`).
- [ ] All glass cards blur/border correct.
- [ ] Text readable (DevTools contrast checker).
- [ ] Weather bg adapts per theme.
- [ ] Hover/animations smooth.
- [ ] Mobile: responsive, no blur perf issues.

## 7. Rollback
Revert `dark` class, remove vars, restore hardcoded colors.

**Total Changes:** 10 files. Est. time: 2-4 hours. Commit: `feat: dark/light theme toggle w/ glassmorphism`.