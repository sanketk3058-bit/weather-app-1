# AGENTS.md - Weather App Project

## Build/Lint/Test Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run test`: Run all Jest tests
- Single test: `npx jest --testNamePattern="test name"` or `npx jest path/to/test.tsx`

## Code Style Guidelines
- **Imports**: Use `@/*` alias for `src/`. Group: React, third-party, local components/hooks/lib, types.
- **Formatting**: ESLint `next/core-web-vitals`. 2-space indentation, semicolons, single quotes.
- **Types**: Strict TypeScript. Define interfaces in `src/lib/types.ts`. No `any`; use generics. Props: `ComponentNameProps`.
- **Naming**: PascalCase for components/hooks, camelCase for variables/functions. Files: kebab-case.tsx.
- **Components**: `'use client'` at top. Named exports. Variants: string unions like `'primary' | 'secondary'`.
- **Error Handling**: `fetchWithFallback()` for optional API data. Return defaults on failure. Log errors.
- **Styling**: Tailwind CSS. Glass design: `glass-card` classes with variants. Hover: CSS transforms, not Framer Motion.
- **API**: Use `src/lib/weather-api.ts` service. Route handlers in `src/app/api/`. Axios with 10s timeout.

## Copilot Rules (from .github/copilot-instructions.md)
- Client-Server: Components client-side, API routes proxy OpenWeatherMap.
- Resilience: `fetchWithFallback()` for optional endpoints (air quality, UV, pollen).
- Components: `GlassCard` with variants, `animateHover` prop.
- Hooks: `useWeather` for API orchestration, `useAnimatedNumber` for numbers.
- Type Safety: All API responses typed. Use `as const` for unions.
- Styling: Backdrop-filter blur(40px), rgba backgrounds, subtle borders/shadows.
- Antipatterns: No direct API calls from components, no mixing CSS/Framer Motion.</content>
<parameter name="filePath">C:\Users\Admin\Desktop\Weather App Project\weather-app-project\AGENTS.md