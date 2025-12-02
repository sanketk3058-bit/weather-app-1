# PHASE 1 PRD: Color Palette & Typography System

## Executive Summary
Implement a professional, cohesive color palette and typography system that establishes visual consistency across the Weather App. This phase focuses on establishing the design foundation for all subsequent visual improvements.

---

## 1. COLOR PALETTE SYSTEM

### 1.1 Semantic Colors

#### Primary Colors
```
Primary Blue: #3B82F6 (rgb(59, 130, 246))
- Used for: Main CTAs, primary actions, highlights
- CSS Variable: --color-primary

Primary Blue Light: #60A5FA (rgb(96, 165, 250))
- Used for: Hover states, focus states
- CSS Variable: --color-primary-light

Primary Blue Dark: #2563EB (rgb(37, 99, 235))
- Used for: Active states, pressed states
- CSS Variable: --color-primary-dark
```

#### Secondary Colors
```
Cyan: #06B6D4 (rgb(6, 182, 212))
- Used for: Secondary highlights, accents
- CSS Variable: --color-secondary

Cyan Light: #22D3EE (rgb(34, 211, 238))
- Used for: Secondary hover states
- CSS Variable: --color-secondary-light

Cyan Dark: #0891B2 (rgb(8, 145, 178))
- Used for: Secondary active states
- CSS Variable: --color-secondary-dark
```

#### Accent Color
```
Purple/Violet: #A855F7 (rgb(168, 85, 247))
- Used for: Special highlights, premium features
- CSS Variable: --color-accent

Purple Light: #D8B4FE (rgb(216, 180, 254))
- Used for: Accent hover states
- CSS Variable: --color-accent-light

Purple Dark: #7E22CE (rgb(126, 34, 206))
- Used for: Accent active states
- CSS Variable: --color-accent-dark
```

#### Status Colors
```
Success Green: #10B981 (rgb(16, 185, 129))
- Used for: Good air quality, success states
- CSS Variable: --color-success

Warning Amber: #F59E0B (rgb(245, 158, 11))
- Used for: Moderate air quality, warnings
- CSS Variable: --color-warning

Danger Rose: #F43F5E (rgb(244, 63, 94))
- Used for: Poor air quality, errors
- CSS Variable: --color-danger

Info Blue: #0EA5E9 (rgb(14, 165, 233))
- Used for: General information
- CSS Variable: --color-info
```

#### Neutral Colors
```
White: #FFFFFF (rgb(255, 255, 255))
- Used for: Text on dark backgrounds
- CSS Variable: --color-white

Off-White: #F1F5F9 (rgb(241, 245, 249))
- Used for: Secondary text
- CSS Variable: --color-off-white

Gray-50: #E2E8F0 (rgb(226, 232, 240))
- Used for: Borders, dividers
- CSS Variable: --color-gray-50

Gray-100: #CBD5E1 (rgb(203, 213, 225))
- Used for: Disabled states
- CSS Variable: --color-gray-100

Gray-400: #94A3B8 (rgb(148, 163, 184))
- Used for: Secondary text, labels
- CSS Variable: --color-gray-400

Gray-600: #475569 (rgb(71, 85, 105))
- Used for: Placeholder text
- CSS Variable: --color-gray-600

Slate-900: #0F172A (rgb(15, 23, 42))
- Used for: Dark backgrounds
- CSS Variable: --color-slate-900

Slate-800: #1E293B (rgb(30, 41, 59))
- Used for: Card backgrounds
- CSS Variable: --color-slate-800
```

### 1.2 Weather-Specific Color Schemes

#### Clear Sky / Sunny
```
Primary: #F59E0B (Amber)
Secondary: #FCD34D (Yellow)
Background Tint: rgba(245, 158, 11, 0.1)
```

#### Cloudy
```
Primary: #94A3B8 (Gray-400)
Secondary: #CBD5E1 (Gray-100)
Background Tint: rgba(148, 163, 184, 0.1)
```

#### Rainy
```
Primary: #3B82F6 (Blue)
Secondary: #0EA5E9 (Sky Blue)
Background Tint: rgba(59, 130, 246, 0.1)
```

#### Thunderstorm
```
Primary: #8B5CF6 (Violet)
Secondary: #A855F7 (Purple)
Background Tint: rgba(139, 92, 246, 0.1)
```

#### Snow
```
Primary: #E0F2FE (Light Cyan)
Secondary: #F1F5F9 (Light Gray)
Background Tint: rgba(225, 242, 254, 0.1)
```

### 1.3 Opacity/Alpha Variants

```
Background Overlays:
- Very Light: rgba(255, 255, 255, 0.03) - Subtle, almost invisible
- Light: rgba(255, 255, 255, 0.05) - Very subtle backgrounds
- Medium-Light: rgba(255, 255, 255, 0.08) - Card tertiary
- Medium: rgba(255, 255, 255, 0.10) - Card secondary
- Medium-Heavy: rgba(255, 255, 255, 0.15) - Card primary
- Heavy: rgba(255, 255, 255, 0.20) - Strong emphasis
- Very Heavy: rgba(255, 255, 255, 0.30) - Hover/active states

Text Colors:
- Disabled: rgba(255, 255, 255, 0.40)
- Secondary Text: rgba(255, 255, 255, 0.60)
- Primary Text: rgba(255, 255, 255, 0.80)
- Full: rgba(255, 255, 255, 1.00)
```

---

## 2. TYPOGRAPHY SYSTEM

### 2.1 Font Stack
```css
Font Family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- Primary font stack for all text
- Fallback to system fonts for better performance
- Include font-feature-settings for optimal rendering
```

### 2.2 Heading System

#### H1 - Main Page Title
```
Size: 3.5rem (56px)
Weight: 700 (Bold)
Line Height: 1.2 (67.2px)
Letter Spacing: -0.02em
Usage: Page title "Weather"
Examples: Main hero title
```

#### H2 - Section Headers
```
Size: 2rem (32px)
Weight: 600 (SemiBold)
Line Height: 1.3 (41.6px)
Letter Spacing: -0.01em
Usage: "7-Day Forecast", "Advanced Weather"
Examples: Major section titles
```

#### H3 - Card Titles
```
Size: 1.5rem (24px)
Weight: 600 (SemiBold)
Line Height: 1.4 (33.6px)
Letter Spacing: 0em
Usage: Card headers within sections
Examples: Weather stat titles
```

#### H4 - Subsection Titles
```
Size: 1.25rem (20px)
Weight: 600 (SemiBold)
Line Height: 1.5 (30px)
Letter Spacing: 0em
Usage: Subsection headers
Examples: Weather condition type
```

### 2.3 Body Text System

#### Large Body (18px)
```
Size: 1.125rem (18px)
Weight: 400 (Regular)
Line Height: 1.6 (28.8px)
Letter Spacing: 0em
Usage: Main data display (temperature, key numbers)
Color: --color-white
Examples: "28°C", "65% Humidity"
```

#### Body (16px)
```
Size: 1rem (16px)
Weight: 400 (Regular)
Line Height: 1.6 (25.6px)
Letter Spacing: 0em
Usage: General content, descriptions
Color: --color-white / --color-off-white
Examples: "Partly Cloudy", location descriptions
```

#### Small Body (14px)
```
Size: 0.875rem (14px)
Weight: 400 (Regular)
Line Height: 1.5 (21px)
Letter Spacing: 0em
Usage: Secondary information, subtext
Color: rgba(255, 255, 255, 0.60)
Examples: "Feels like", "Wind Speed"
```

### 2.4 Label & Utility Text

#### Label (12px)
```
Size: 0.75rem (12px)
Weight: 500 (Medium)
Line Height: 1.5 (18px)
Letter Spacing: 0.05em (uppercase tracking)
Usage: Labels, badges, status tags
Transform: uppercase
Color: rgba(255, 255, 255, 0.60)
Examples: "AIR QUALITY", "UV INDEX"
```

#### Caption (12px)
```
Size: 0.75rem (12px)
Weight: 400 (Regular)
Line Height: 1.5 (18px)
Letter Spacing: 0em
Usage: Captions, helper text, meta information
Color: rgba(255, 255, 255, 0.50)
Examples: "Last updated 2 hours ago"
```

#### Badge (13px)
```
Size: 0.8125rem (13px)
Weight: 500 (Medium)
Line Height: 1.4 (18.2px)
Letter Spacing: 0em
Usage: Inline badges, status indicators
Color: Varies by status
Examples: "Good", "Moderate", "High"
```

### 2.5 Special Text Styles

#### Gradient Text
```
Background: linear-gradient(to right, #3B82F6, #06B6D4)
Background Clip: text
Text Color: transparent
Usage: Headings requiring emphasis
Examples: Main "Weather" title
```

#### Temperature Display
```
Font: Same as Large Body but with extra spacing
Weight: 700 (Bold)
Size: 3.5rem - 4.5rem (varies by context)
Letter Spacing: -0.02em
Color: --color-white
```

#### Weather Condition Text
```
Size: 1.125rem (18px)
Weight: 400 (Regular)
Transform: capitalize
Color: rgba(255, 255, 255, 0.80)
```

### 2.6 Font Feature Settings
```css
font-feature-settings: "rlig" 1, "calt" 1, "ss01" 1
- rlig: Contextual ligatures
- calt: Contextual alternates
- ss01: Stylistic set 1 (optional, improves readability)
```

---

## 3. IMPLEMENTATION DETAILS

### 3.1 CSS Variables (to be added to globals.css)

```css
/* Color Variables */
--color-primary: #3B82F6;
--color-primary-light: #60A5FA;
--color-primary-dark: #2563EB;

--color-secondary: #06B6D4;
--color-secondary-light: #22D3EE;
--color-secondary-dark: #0891B2;

--color-accent: #A855F7;
--color-accent-light: #D8B4FE;
--color-accent-dark: #7E22CE;

--color-success: #10B981;
--color-warning: #F59E0B;
--color-danger: #F43F5E;
--color-info: #0EA5E9;

--color-white: #FFFFFF;
--color-off-white: #F1F5F9;
--color-gray-50: #E2E8F0;
--color-gray-100: #CBD5E1;
--color-gray-400: #94A3B8;
--color-gray-600: #475569;

--color-slate-900: #0F172A;
--color-slate-800: #1E293B;

/* Typography Variables */
--font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
--font-size-3xl: 2rem;
--font-size-4xl: 2.25rem;
--font-size-5xl: 3rem;
--font-size-6xl: 3.5rem;
--font-size-7xl: 4.5rem;

--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

--line-height-tight: 1.2;
--line-height-snug: 1.3;
--line-height-normal: 1.4;
--line-height-relaxed: 1.5;
--line-height-loose: 1.6;
--line-height-very-loose: 1.8;

--letter-spacing-tight: -0.02em;
--letter-spacing-normal: 0em;
--letter-spacing-wide: 0.05em;
--letter-spacing-wider: 0.1em;
```

### 3.2 Tailwind Configuration Updates

```javascript
// tailwind.config.js additions
theme: {
  colors: {
    primary: '#3B82F6',
    'primary-light': '#60A5FA',
    'primary-dark': '#2563EB',
    
    secondary: '#06B6D4',
    'secondary-light': '#22D3EE',
    'secondary-dark': '#0891B2',
    
    accent: '#A855F7',
    'accent-light': '#D8B4FE',
    'accent-dark': '#7E22CE',
    
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#F43F5E',
    info: '#0EA5E9',
  },
  fontFamily: {
    base: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1.5' }],
    sm: ['0.875rem', { lineHeight: '1.5' }],
    base: ['1rem', { lineHeight: '1.6' }],
    lg: ['1.125rem', { lineHeight: '1.6' }],
    xl: ['1.25rem', { lineHeight: '1.5' }],
    '2xl': ['1.5rem', { lineHeight: '1.4' }],
    '3xl': ['2rem', { lineHeight: '1.3' }],
    '4xl': ['2.25rem', { lineHeight: '1.2' }],
    '5xl': ['3rem', { lineHeight: '1.2' }],
    '6xl': ['3.5rem', { lineHeight: '1.2' }],
    '7xl': ['4.5rem', { lineHeight: '1.2' }],
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.05em',
    wider: '0.1em',
  },
}
```

### 3.3 Utility Classes (to be added to globals.css)

```css
/* Typography Utilities */
.text-h1 {
  @apply text-6xl font-bold leading-tight -tracking-tighter;
}

.text-h2 {
  @apply text-3xl font-semibold leading-snug -tracking-tight;
}

.text-h3 {
  @apply text-2xl font-semibold leading-normal;
}

.text-h4 {
  @apply text-xl font-semibold leading-relaxed;
}

.text-body-lg {
  @apply text-lg font-regular leading-loose;
}

.text-body {
  @apply text-base font-regular leading-loose;
}

.text-body-sm {
  @apply text-sm font-regular leading-relaxed;
}

.text-label {
  @apply text-xs font-medium leading-relaxed uppercase tracking-wide;
}

.text-caption {
  @apply text-xs font-regular leading-relaxed;
}

.text-badge {
  @apply text-sm font-medium leading-relaxed;
}

.text-temperature {
  @apply text-7xl font-bold leading-tight -tracking-tighter text-white;
}

.text-gradient {
  @apply bg-gradient-to-r from-primary via-secondary to-secondary-light bg-clip-text text-transparent;
}

.text-muted {
  @apply text-gray-400 text-opacity-60;
}

.text-secondary {
  @apply text-gray-400 text-opacity-80;
}

.text-primary {
  @apply text-white;
}

/* Color Utilities */
.text-success {
  @apply text-success;
}

.text-warning {
  @apply text-warning;
}

.text-danger {
  @apply text-danger;
}

.bg-success {
  @apply bg-success bg-opacity-20;
}

.bg-warning {
  @apply bg-warning bg-opacity-20;
}

.bg-danger {
  @apply bg-danger bg-opacity-20;
}
```

---

## 4. COMPONENT UPDATES

### 4.1 Update globals.css
- Replace existing color definitions with new color palette
- Add CSS variables section
- Update animation and transition utilities
- Add new typography classes

### 4.2 Files to Modify
1. `src/app/globals.css` - Main color and typography updates
2. `tailwind.config.js` - Extend theme with new colors and typography

### 4.3 Files NOT Modified (yet)
- `src/app/page.tsx` - Will be updated in Phase 2
- `src/components/*.tsx` - Will be updated in Phase 2
- Other component files - Unchanged in Phase 1

---

## 5. TESTING CHECKLIST

### 5.1 Visual Testing
- [ ] All colors render correctly in light and dark modes
- [ ] Text hierarchy is clear and visually distinct
- [ ] Color contrast meets WCAG AA standards
- [ ] Typography scales properly on mobile/tablet/desktop

### 5.2 Functional Testing
- [ ] CSS variables are accessible in all components
- [ ] Gradient text renders without pixelation
- [ ] Font weights display correctly
- [ ] Line heights and letter spacing render as designed

### 5.3 Browser Testing
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### 5.4 Accessibility Testing
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Color is not the only means of conveying information
- [ ] Text is readable at all font sizes
- [ ] No issues with color blindness simulators

---

## 6. ROLLBACK PLAN

If issues arise:
1. Revert `globals.css` to backup
2. Revert `tailwind.config.js` to backup
3. Clear Next.js cache: `rm -rf .next`
4. Rebuild: `npm run build`

---

## 7. SUCCESS CRITERIA

✅ Phase 1 is complete when:
- [ ] All colors defined in CSS variables
- [ ] Typography system fully implemented
- [ ] All colors meet accessibility standards
- [ ] Build completes without errors
- [ ] No visual regressions from Phase 0
- [ ] New color/typography utilities are available for Phase 2

