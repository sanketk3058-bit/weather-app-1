**Performance Improvement Plan — Weather App Project

**Executive Summary**
- **Short Wins:** Add conservative server-side caching headers, an in-process request cache/dedupe in `src/lib/weather-api.ts`, and enable Axios keep-alive — these reduce upstream OpenWeather calls and lower latency without changing public APIs.
- **Client Wins:** Use client-side request caching (SWR) and convert heavy interactive components to `next/dynamic` to shrink hydration cost and improve FCP.
- **Infra Wins:** Layer CDN/Edge caching and Brotli/Gzip compression. These changes are configuration-first and backwards-compatible.

**Prioritized Improvements (High / Medium / Low)**

- High
  - **Cache-Control Headers (server):** Add conservative `Cache-Control` + `stale-while-revalidate` to API responses in `src/app/api/weather/route.ts` and `src/app/api/geocode/route.ts`.
  - **In-process Request Cache & Deduplication (server):** Add a small Map-based TTL cache + in-flight promise dedupe in `src/lib/weather-api.ts` around axios calls.
  - **Axios Keep-Alive (server):** Configure `http.Agent` / `https.Agent` for connection reuse in `src/lib/weather-api.ts` (or wherever `axios` client is configured).
  - **Dynamic Imports + `use client` Audit (client):** Replace heavy components (e.g., `HourlyForecast.tsx`, `WeatherIcon.tsx`) with `next/dynamic` and convert purely presentational components to server components where possible.

- Medium
  - **Client-side SWR Caching:** Introduce `swr` (or similar) in `src/hooks/useWeather.ts` (or `src/app/page.tsx`) with `dedupingInterval` and `revalidateIfStale` options.
  - **Edge Runtime (optional):** If deploying to Vercel/Cloudflare, set `export const runtime = 'edge'` in eligible routes for geographic proximity (only if Node APIs used are compatible).
  - **Bundle Analysis:** Add `@next/bundle-analyzer` (dev-only) to identify large client modules.

- Low
  - **Font & Static Asset Optimizations:** Move fonts to `next/font`, enable font-display strategies and ensure image optimization via `next/image` where applicable.
  - **Cross-instance Cache (optional):** Redis or Memcached for multi-instance shared caching (only if scale demands it).

**High-Priority Items — Detailed Notes**

**1) Cache-Control Headers**
- Files to update: `src/app/api/weather/route.ts`, `src/app/api/geocode/route.ts`.
- Rationale: Let CDN and browsers reuse responses; keep TTLs conservative so weather data doesn't get stale.
- Suggested header examples (conservative):
  - Current weather: `Cache-Control: public, s-maxage=60, stale-while-revalidate=120`
  - Forecast: `Cache-Control: public, s-maxage=600, stale-while-revalidate=300`
  - Air quality: `Cache-Control: public, s-maxage=300, stale-while-revalidate=300`
  - Pollen: `Cache-Control: public, s-maxage=86400, stale-while-revalidate=3600`
- Example snippet (server route):
  - ```ts
    import { NextResponse } from 'next/server';

    // build payload...
    const headers = new Headers();
    headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return NextResponse.json(payload, { headers });
    ```
- Tests/verification:
  - `curl -I "http://localhost:3000/api/weather?lat=51.5074&lon=-0.1278"` and confirm header.
  - Repeated curl timing to measure reduction in upstream calls.
- Roll-back plan: Remove header setting lines to revert to previous behavior.
- Estimated effort: 1–2 hours.

**2) In-process Request Cache + Deduplication**
- File to update: `src/lib/weather-api.ts` (the centralized layer that performs OpenWeather requests).
- Rationale: Concurrent requests with identical params cause duplicate OpenWeather calls; dedupe and short TTL caching drastically reduces upstream request counts and lowers average latency.
- Implementation blueprint (copy/paste-ready):
  - ```ts
    type CacheEntry<T> = { data: T; expiresAt: number };
    const memoryCache = new Map<string, CacheEntry<any>>();
    const inFlight = new Map<string, Promise<any>>();

    function cacheKey(url: string, params?: Record<string, any>) {
      return url + (params ? '::' + JSON.stringify(params) : '');
    }

    async function cachedFetch<T>(key: string, fetcher: () => Promise<T>, ttlSeconds = 60): Promise<T> {
      const now = Date.now();
      const entry = memoryCache.get(key);
      if (entry && entry.expiresAt > now) return entry.data;

      if (inFlight.has(key)) return inFlight.get(key)!;

      const p = (async () => {
        try {
          const data = await fetcher();
          memoryCache.set(key, { data, expiresAt: now + ttlSeconds * 1000 });
          return data;
        } finally {
          inFlight.delete(key);
        }
      })();

      inFlight.set(key, p);
      return p;
    }
    ```
- Where to use it: wrap axios calls for `current`, `forecast`, `air_pollution`, `uvi`, `pollen` calls.
- Tests:
  - Unit test to assert that 10 concurrent requests resolve but only a single axios call was made (mock axios).
  - Integration test: spawn 10 parallel curl/http requests and observe logs/upstream call counts.
- Roll-back: replace `cachedFetch` wrapper usage with prior direct axios usage.
- Estimated effort: 2–4 hours (including tests).

**3) Axios Keep-Alive Configuration**
- File: `src/lib/weather-api.ts` (where axios client is created) or a small axios wrapper file.
- Rationale: Reuse TCP connections and reduce connect overhead for multiple sequential requests.
- Snippet:
  - ```ts
    import axios from 'axios';
    import http from 'http';
    import https from 'https';

    const httpAgent = new http.Agent({ keepAlive: true });
    const httpsAgent = new https.Agent({ keepAlive: true });

    export const axiosClient = axios.create({
      baseURL: process.env.OPENWEATHER_BASE_URL,
      timeout: 10000,
      httpAgent,
      httpsAgent,
    });
    ```
- Tests: run repeated server-side requests and measure connect times; compare with/without agents.
- Roll-back: remove `httpAgent`/`httpsAgent` options.
- Estimated effort: 0.5–1 hour.

**Client-Side Improvements (High/Medium)**

**4) Dynamic Imports & `use client` Audit**
- Files to audit: any components with `'use client'` at the top. Prioritize `src/app/components/HourlyForecast.tsx`, `src/app/components/WeatherIcon.tsx`, `src/app/page.tsx`, `src/app/components/SearchBar.tsx`.
- Rationale: Server components reduce JS shipped to the client. Dynamic import interactive widgets to avoid shipping heavy libs at initial load.
- Example:
  - ```ts
    import dynamic from 'next/dynamic';
    const HourlyForecast = dynamic(() => import('../components/HourlyForecast'), { ssr: false, loading: () => <div className="h-24 w-full animate-pulse" /> });
    ```
- Risks: `ssr: false` moves rendering to client only and can change initial HTML — mitigate with skeletons.
- Effort: 2–3 hours for audit and initial conversions.

**5) Client-side SWR Caching (Medium)**
- Files: `src/hooks/useWeather.ts` or create `src/hooks/useSWRWeather.ts`.
- Rationale: Dedupes requests client-side and caches results between components and pages; reduces client→server churn.
- Example:
  - ```ts
    import useSWR from 'swr';
    const fetcher = (url: string) => fetch(url).then(r => r.json());
    export function useWeather(lat, lon) {
      const key = `/api/weather?lat=${lat}&lon=${lon}`;
      const { data, error, isLoading } = useSWR(key, fetcher, { dedupingInterval: 60000, revalidateOnFocus: false });
      return { data, error, isLoading };
    }
    ```
- Effort: 1–2 hours to wire up and test.

**Medium/Optional Items**
- **Edge Runtime:** Consider adding `export const runtime = 'edge'` in `src/app/api/*/route.ts` only if the deployment platform supports it and no Node-only modules are needed. Test for compatibility.
- **Bundle Analyzer:** Add dev dependency `@next/bundle-analyzer` and an `analyze` script to compare before/after.
- **Cross-instance Cache:** If the app runs multiple server instances and needs coherence, add Redis and a TTL policy matching `s-maxage` values. This requires infra work and credentials.

**Risk Analysis**
- `runtime = 'edge'` can break if Node APIs (agents, local filesystem) are used — test locally.
- Overly long `s-maxage` values cause stale weather data; use conservative TTLs and `stale-while-revalidate` to balance freshness vs speed.
- `ssr: false` dynamic imports can increase cumulative layout shift without appropriate skeletons.
- In-process cache is not cross-instance; document this limitation.

**Benchmarks & Commands (before / after)**
- Validate headers:
  - `curl -I "http://localhost:3000/api/weather?lat=51.5074&lon=-0.1278"`
- Measure API timings (PowerShell `pwsh`):
  - ```pwsh
    curl -w "namelookup: %{time_namelookup}s\nconnect: %{time_connect}s\nstarttransfer: %{time_starttransfer}s\ntotal: %{time_total}s\n" -o $null -s "http://localhost:3000/api/weather?lat=51.5074&lon=-0.1278"
    ```
- Measure dedupe (node script):
  - Save as `scripts/measure.js`:
    ```js
    const fetch = require('node-fetch');
    (async ()=>{
      console.time('first');
      await fetch('http://localhost:3000/api/weather?lat=51.5074&lon=-0.1278');
      console.timeEnd('first');
      console.time('second');
      await fetch('http://localhost:3000/api/weather?lat=51.5074&lon=-0.1278');
      console.timeEnd('second');
    })();
    ```
  - Run:
    ```pwsh
    node .\scripts\measure.js
    ```
- Lighthouse: Use DevTools Lighthouse or `npx lighthouse http://localhost:3000 --output html --output-path ./lh-report.html`.
- Bundle analysis:
  - Add script to `package.json`:
    ```json
    "analyze": "cross-env ANALYZE=true next build"
    ```
  - Run:
    ```pwsh
    npm run analyze
    ```

**Infra / Configuration Checklist**
- Enable CDN/Edge caching and respect `Cache-Control` headers (Vercel/Cloudflare recommended).
- Ensure Brotli/Gzip compression is enabled.
- If implementing cross-instance caching, provision Redis and store credentials in environment variables (e.g., `REDIS_URL`).

**Testing & Rollback Strategy**
- Implement high-priority items one at a time and run the micro-benchmarks above after each change.
- Keep commits small and reversible; include unit tests for `cachedFetch` dedupe behavior.
- Monitor logs for unexpected 5xx from OpenWeather (a symptom of request throttling changes).

**Next Steps (recommended)**
- Pick one high-priority item to implement first (I recommend adding `Cache-Control` headers to `src/app/api/weather/route.ts`), validate with `curl -I`, and run a short dedupe benchmark.
- After header rollout, implement `cachedFetch` in `src/lib/weather-api.ts` and add one unit test that asserts dedupe behavior.



**Follow-up tasks for implementation (handoff)**
- ✅~~`PATCH 1` — Add `Cache-Control` headers to `src/app/api/weather/route.ts`.~~ **(Completed: 2025-12-05)**
- ✅ `PATCH 2` — Add `cachedFetch` + in-flight dedupe to `src/lib/weather-api.ts` and wrap axios calls. **DONE: 2025-12-06**
- ✅ `PATCH 3` — Add Axios keep-alive configuration in axios client creation. **DONE: 2025-12-06**

Note: TTL choices implemented conservatively — Current=60s, Forecast=5m, Optional endpoints=5m, Pollen=24h. In-process cache is memory-only and single-instance (not shared across processes); consider Redis/Memcached for multi-instance deployments.
- ✅ `PATCH 4` — Convert 2–3 heavy components to `next/dynamic` and audit `use client` usage. **DONE: 2025-12-06**

**PATCH 4 Implementation Details:**
- Converted `GlassCard.tsx` and `UnitToggle.tsx` to server components (removed `use client`)
- Created skeleton components: `HourlyForecastSkeleton.tsx`, `WeatherIconSkeleton.tsx`
- Dynamic import `WeatherIcon` in `page.tsx` with skeleton fallback (heavy: Framer Motion + 15+ react-icons)
- Dynamic import `HourlyForecast` in `page.tsx` with skeleton fallback
- Dynamic import `WeatherIcon` in `HourlyForecast.tsx` with skeleton fallback
- Build verified: First Load JS reduced from 97.3kB shared bundle

- ✅ `PATCH 5` — Add client-side SWR caching in `src/hooks/useWeather.ts`. **DONE: 2025-12-06**

**PATCH 5 Implementation Details:**
- Installed `swr` package for client-side data fetching and caching
- Created `src/hooks/useWeather.ts` hook with SWR integration
- Configured SWR options: `dedupingInterval: 60s`, `revalidateIfStale: true`, `revalidateOnFocus: false`
- Refactored `src/app/page.tsx` to use `useWeather` hook instead of manual fetch/state management
- Benefits: Automatic request deduplication, stale-while-revalidate pattern, error retry, keeps previous data during revalidation
- Added unit tests in `__tests__/useWeather.test.tsx`

- ✅ `PATCH 6` — Add `@next/bundle-analyzer` for bundle analysis. **DONE: 2025-12-06**

**PATCH 6 Implementation Details:**
- Installed `@next/bundle-analyzer` and `cross-env` as dev dependencies
- Updated `next.config.js` to conditionally enable bundle analyzer when `ANALYZE=true`
- Added `analyze` npm script: `cross-env ANALYZE=true next build`
- Usage: Run `npm run analyze` to generate bundle analysis reports

**Document history**
- Created: 2025-12-05
- Author: Automated performance findings (design subagent)

---

**Actionable Steps — High-Priority Items**

Below are step-by-step, copy-paste-ready instructions for each High-priority improvement. Implement these one at a time, run the short tests listed, and monitor after deployment.

**1) Cache-Control Headers (server API routes)**
- Goal: Add conservative `Cache-Control` response headers to reduce repeated upstream work while preserving freshness.
- Files to edit:
  - `src/app/api/weather/route.ts`
  - `src/app/api/geocode/route.ts`
- Exact edits (copy-paste snippets):
  - In `src/app/api/weather/route.ts`, return the successful payload with headers:

```ts
// src/app/api/weather/route.ts
import { NextResponse } from 'next/server';
// existing imports ...

export async function GET(req: Request) {
  try {
    // existing logic that computes `payload`
    const payload = await getAggregatedWeather(...);

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
```

  - In `src/app/api/geocode/route.ts`, use a longer TTL for geocoding results:

```ts
// src/app/api/geocode/route.ts
import { NextResponse } from 'next/server';
// existing imports ...

export async function GET(req: Request) {
  try {
    const results = await geocode(...);
    return NextResponse.json(results, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300'
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
```

- Test plan (quick):
  - Start dev server: `npm run dev`
  - Inspect headers:

```pwsh
curl -i "http://localhost:3000/api/weather?lat=51.5&lon=-0.12"
curl -i "http://localhost:3000/api/geocode?q=London"
```

  - Expect: `Cache-Control` header present on 200 responses with configured values; absent on 500 responses.
  - Optional unit test (Jest): call the handler and assert the `cache-control` header equals the expected string.

- Rollback: revert the file changes or remove the `headers` object. Use `git checkout -- <file>` or `git revert`.
- Estimated effort: 0.5–1 hour.
- Post-deploy monitoring: watch CDN cache hit rates and user reports of stale data; tune TTLs after 24–72 hours.

**2) In-process Request Cache + Deduplication (`src/lib/weather-api.ts`)**
- Goal: Prevent duplicate identical upstream requests and serve short-lived cached responses from memory to reduce latency and quota usage.
- File to edit:
  - `src/lib/weather-api.ts`
- Add the following helper code near the top of the file (copy-paste):

```ts
// src/lib/weather-api.ts (top-level additions)
type CacheEntry = { expiresAt: number; value: any };
const requestCache = new Map<string, CacheEntry | Promise<any>>();

const TTL = {
  CURRENT_WEATHER: 60 * 1000, // 60s
  FORECAST: 5 * 60 * 1000,    // 5m
  OPTIONAL: 5 * 60 * 1000     // 5m
};

function makeCacheKey(method: string, url: string, params?: Record<string, any>) {
  const sorted = params
    ? Object.keys(params).sort().map(k => `${k}=${String(params[k])}`).join('&')
    : '';
  return `${method.toUpperCase()}|${url}|${sorted}`;
}

async function cachedFetch<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const existing = requestCache.get(key);
  const now = Date.now();

  if (existing && !(existing instanceof Promise)) {
    if (existing.expiresAt > now) return existing.value as T;
    requestCache.delete(key);
  }

  if (existing instanceof Promise) return existing as Promise<T>;

  const inflight = (async () => {
    try {
      const res = await fetcher();
      requestCache.set(key, { expiresAt: Date.now() + ttlMs, value: res });
      return res;
    } catch (err) {
      requestCache.delete(key);
      throw err;
    }
  })();

  requestCache.set(key, inflight as any);
  return inflight;
}
```

- Usage example (wrap existing axios calls):

```ts
// example inside a function in src/lib/weather-api.ts
const url = `${baseURL}/weather`;
const key = makeCacheKey('GET', url, { lat, lon, units: 'metric' });
const current = await cachedFetch(key, TTL.CURRENT_WEATHER, () =>
  axiosInstance.get(url, { params: { lat, lon, appid: apiKey, units: 'metric' } }).then(r => r.data)
);
```

- Test plan:
  - Unit tests (Jest):
    - Deduplication: mock a fetcher that resolves after a delay; call `cachedFetch` concurrently and assert the fetcher was invoked only once and both callers receive same result.
    - TTL eviction: use fake timers to advance beyond TTL and assert re-fetch occurs.
    - Error handling: ensure failing fetchers do not populate the cache.
  - Integration check: start dev server and trigger two near-simultaneous requests to `/api/weather` and verify only one external OpenWeather request (via logs or metrics).

- Rollback: revert edits to `src/lib/weather-api.ts`.
- Estimated effort: 2–4 hours (implementation + unit tests + integration check).
- Post-deploy monitoring: add simple counters/logs for cache hits/misses and periodically check memory usage; consider LRU or maximum size if cardinality grows.

**3) Axios Keep-Alive Configuration**
- Goal: Reuse TCP connections to OpenWeatherMap to reduce connection overhead and lower latency.
- File to edit:
  - `src/lib/weather-api.ts` (where axios instance is created) or the axios wrapper file used by the project.
- Copy-paste snippet (replace or add the axios instance creation):

```ts
// src/lib/weather-api.ts
import axios from 'axios';
import http from 'http';
import https from 'https';

const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 50, keepAliveMsecs: 30000 });
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 50, keepAliveMsecs: 30000 });

export const axiosInstance = axios.create({
  baseURL: process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
  httpAgent,
  httpsAgent
});
```

- Test plan:
  - Start dev server and perform repeated requests. Measure average request latency under simple load.
  - Optional: use `netstat` or platform tools to inspect persistent connections to OpenWeather API host.

- Rollback: restore previous axios.create call.
- Estimated effort: 0.5–1 hour.
- Post-deploy monitoring: observe connection counts and adjust `maxSockets` and `keepAliveMsecs` if needed. On serverless platforms, the benefit may be limited — test accordingly.

**4) Dynamic Imports + `use client` Audit (client-side bundle reduction)**
- Goal: Reduce client-side JavaScript shipped at first load by converting presentational components to server components and dynamically importing heavy interactive widgets.
- Files to audit/target:
  - `src/components/HourlyForecast.tsx`
  - `src/components/WeatherIcon.tsx`
  - `src/components/SearchBar.tsx`
  - `src/components/GlassCard.tsx` (if purely presentational)
  - `src/app/page.tsx` and other pages importing these components
- Example conversion (replace static import with dynamic):

```ts
// before in src/app/page.tsx
// import { HourlyForecast } from '@/components/HourlyForecast';

// after
import dynamic from 'next/dynamic';
const HourlyForecast = dynamic(() => import('@/components/HourlyForecast'), {
  ssr: false,
  loading: () => <div className="h-24 w-full animate-pulse" />
});
```

- `use client` audit guidance:
  - Search for occurrences of `'use client'` and remove it only when the file does not use hooks, state, effects, refs, or browser APIs.
  - Keep `use client` for components that need browser features; for those, prefer dynamic import to avoid inflating the main bundle.

- Test plan:
  - Find all `use client` usages:

```pwsh
Select-String -Path "src\**\*.tsx" -Pattern "'use client'" -List
```

  - Build and test:
```pwsh
npm run build
npm run start
npm run test
```
  - Run Lighthouse before/after to measure FCP and JS payload reductions.

- Rollback: revert import changes and restore `use client` directives.
- Estimated effort: 2–4 hours for an initial audit and 2–8 hours depending on the number of components converted.
- Post-deploy monitoring: run Lighthouse and real-user metrics to validate improvements; iterate with bundle-analyzer to find additional heavy modules.

---

End of actionable steps. Implement one item at a time, run the listed tests, and monitor results. If you'd like, I can now (A) apply the first patch to `src/app/api/weather/route.ts` and add a quick unit test, or (B) run a `use client` audit and return a prioritized list of components for conversion.


