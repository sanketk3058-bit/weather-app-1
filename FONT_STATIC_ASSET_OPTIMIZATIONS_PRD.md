# PRD: Font & Static Asset Optimizations

## Overview
This PRD outlines the implementation plan for the "Low" priority performance improvement item: **Font & Static Asset Optimizations**. The goal is to move fonts to `next/font`, enable font-display strategies, and ensure image optimization via `next/image` where applicable. This addresses font loading performance (FOUT/FOIT reduction) and static asset optimization (image compression, lazy loading, modern formats).

**Business Value:**
- Improved Core Web Vitals (LCP, CLS, FCP) through optimized font loading and image delivery.
- Reduced bundle sizes and faster page loads via Next.js built-in optimizations.
- Better user experience with faster font rendering and high-quality, compressed images.

**Technical Scope:**
- Fonts: Migrate to `next/font/google` with explicit weights, `display: 'swap'`, and CSS variable setup.
- Images: Implement opt-in build-time optimization (AVIF/WebP generation), enforce `next/image` usage, and provide tooling for scanning/migration.

**Dependencies:**
- Next.js 14 (App Router)
- Tailwind CSS (for font application)
- Sharp (optional dev dependency for image optimization)
- ESLint (for enforcement rules)

## Phases

### Phase A: Audit & Planning
- **Objective:** Assess current font and image usage in the codebase.
- **Tasks:**
  - Scan `src/` for font loading (e.g., `@font-face`, Google Fonts links).
  - Scan for `<img>` tags and static image imports.
  - Identify components using images (e.g., weather icons, backgrounds).
- **Deliverables:** Audit report with findings and migration plan.
- **Status:** Completed (via initial exploration in session).

### Phase B: Font Optimizations
- **Objective:** Implement `next/font` with font-display strategies.
- **Tasks:**
  - Update `src/app/layout.tsx` to use `next/font/google` for Inter font.
  - Set explicit weights (400, 700), `display: 'swap'`, and CSS variable.
  - Add unit test to verify font class export.
- **Deliverables:** Updated layout, test file, passing tests.
- **Status:** Completed.

### Phase C: Static Asset Optimizations (Tooling & Enforcement)
- **Objective:** Provide opt-in image optimization and enforce `next/image` usage.
- **Tasks:**
  - Create `scripts/optimize-images.js` to convert `assets-src/` to `public/images/` (AVIF/WebP).
  - Add ESLint rule `@next/next/no-img-element` (warn).
  - Create `scripts/find-imgs.js` scanner for plain `<img>` tags.
  - Add npm scripts: `optimize:images`, `lint:images`.
  - Create directories and placeholders.
  - Add documentation (`docs/image-optimization.md`).
- **Deliverables:** Scripts, docs, lint rule, generated samples.
- **Status:** Completed.

### Phase D: Component Migration (Future)
- **Objective:** Migrate any plain `<img>` tags to `next/image` when they appear.
- **Tasks:**
  - Scan for new `<img>` usage via lint/scanner.
  - Replace with `next/image` components, adding `priority`, `sizes`, `alt`, etc.
  - Generate blurDataURL if needed.
- **Deliverables:** Updated components, optimized images.
- **Status:** Pending (no current `<img>` tags found).

### Phase E: CI Integration & Enhancements (Optional)
- **Objective:** Automate optimization in CI and add advanced features.
- **Tasks:**
  - Add GitHub Action to run optimizer in CI.
  - Decide commit policy for generated assets.
  - Optimize favicons/manifest icons.
  - Add blurDataURL generation to optimizer.
- **Deliverables:** CI workflow, enhanced scripts.
- **Status:** Pending.

## Completed Phases

### Phase A: Audit & Planning
- **Findings:** Inter font already loaded via `next/font/google` in `layout.tsx`. No `@font-face` or local fonts. No plain `<img>` tags in `src/` (scanner confirmed). Weather icons use `react-icons` (SVG), no static images.
- **Plan:** Conservative font tweaks + opt-in image tooling.

### Phase B: Font Optimizations
- **Changes:**
  - `src/app/layout.tsx`: Updated `Inter` call to include `weight: ['400','700']`, `display: 'swap'`, `variable: '--font-inter'`. Exported `inter` for testability.
  - `__tests__/layout.test.tsx`: Added test mocking `next/font/google` and CSS import; asserts `inter.className` presence.
- **Verification:** Test passes. No breaking changes.
- **Impact:** Enables font-display swap, reduces FOUT, optimizes loading.

### Phase C: Static Asset Optimizations
- **Changes:**
  - `scripts/optimize-images.js`: Opt-in script using `sharp` to generate AVIF/WebP from `assets-src/` to `public/images/`. Idempotent, quality settings: AVIF=60, WebP=75.
  - `scripts/find-imgs.js`: Scanner for plain `<img>` in `src/`.
  - `.eslintrc.json`: Added `"@next/next/no-img-element": "warn"`.
  - `package.json`: Added `"optimize:images"` and `"lint:images"` scripts.
  - `docs/image-optimization.md`: Workflow guide.
  - `assets-src/.gitkeep`, `public/images/.gitkeep`: Placeholders.
- **Verification:** Ran `npm run optimize:images` → produced `rain.avif`, `rain.webp`. `npm run lint:images` → "No plain <img> tags found."
- **Impact:** Provides tooling for image optimization; enforces best practices.

## Remaining Phases

### Phase D: Component Migration
- **Why Pending:** No current `<img>` tags; scanner clean.
- **Trigger:** When new images are added or `<img>` appears, migrate immediately.
- **Effort:** Low (per component).

### Phase E: CI Integration & Enhancements
- **Why Optional:** Tooling works locally; CI can automate.
- **Tasks:**
  - GitHub Action: Run optimizer on push/PR, commit or cache generated assets.
  - Commit Policy: Decide if `public/images/*` should be committed (for static hosting) or generated in CI (for dynamic).
  - Favicons: Convert `public/favicon.ico`, `public/manifest.json` icons to optimized formats.
  - BlurDataURL: Add generation in optimizer for `next/image` placeholders.
- **Effort:** Medium (1-2 hours for CI, more for enhancements).

## Context from Session
- **Initial Audit:** Found Inter font via `next/font`, no images needing `next/image`.
- **Approach:** Conservative changes to avoid breakage; opt-in tooling for images.
- **Implementation:** Mechanical edits with tests; ran tools to verify.
- **Challenges:** Test mocking for CSS imports; directory creation for scripts.
- **Results:** Fonts optimized; image tooling ready; no lint violations.
- **Unrelated:** One animation test failing (not related to changes).

## Implementation Details
- **Fonts:** Uses `next/font/google` for automatic optimization, subsetting, and caching.
- **Images:** Opt-in because not all images need optimization; developer-run script to avoid build-time overhead.
- **Enforcement:** Lint rule warns on `<img>`; scanner for CI checks.
- **Formats:** AVIF (modern, high compression) + WebP (fallback); quality tuned for balance.
- **Safety:** Optimizer skips if outputs newer; provides install instructions for `sharp`.

## Testing & Verification
- Fonts: Unit test for class export.
- Images: Run optimizer, check outputs; run scanner, confirm no `<img>`.
- Integration: `npm run dev`, check font loading; Lighthouse for metrics.

## Rollback Plan
- Fonts: Revert `layout.tsx` to previous `Inter` call; remove test.
- Images: Remove scripts, docs, lint rule; delete generated files.

## Next Steps
- Implement Phase E if desired (CI automation).
- Monitor for new images; migrate as needed.
- Measure impact via Lighthouse before/after.

**Date:** December 6, 2025  
**Author:** GitHub Copilot (based on session implementation)</content>
<parameter name="filePath">c:\Users\Admin\Desktop\Weather App Project\weather-app-project\FONT_STATIC_ASSET_OPTIMIZATIONS_PRD.md