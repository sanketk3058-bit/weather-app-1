# PHASE 2 PRD: Enhanced Shadows & Depth System

## Executive Summary
Implement a professional shadow and depth layering system that creates visual hierarchy, depth perception, and sophisticated visual polish. This phase builds on Phase 1's color and typography system to add dimensional quality and refined interaction feedback.

---

## 1. SHADOW SYSTEM

### 1.1 Shadow Scale Definition

#### Level 0 - Minimal Shadow (Subtle, nearly invisible)
```
Box Shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
Usage: Hover states on already-elevated elements, subtle dividers
Effect: Barely perceptible elevation
CSS Variable: --shadow-xs
Tailwind: shadow-sm
```

#### Level 1 - Subtle Shadow (Low elevation)
```
Box Shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
Usage: Standard cards, search bar, small components
Effect: Subtle lifting from background
CSS Variable: --shadow-sm
Tailwind: shadow-md
```

#### Level 2 - Light Shadow (Moderate elevation)
```
Box Shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
Usage: Default card elevation, interactive elements
Effect: Clear separation from background
CSS Variable: --shadow-md
Tailwind: shadow-lg
```

#### Level 3 - Medium Shadow (Notable elevation)
```
Box Shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
Usage: Hoverable cards, prominent components
Effect: Distinct spatial separation
CSS Variable: --shadow-lg
Tailwind: shadow-xl
```

#### Level 4 - Heavy Shadow (Strong elevation)
```
Box Shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
Usage: Modals, dropdowns, search suggestions
Effect: Significant depth and prominence
CSS Variable: --shadow-xl
Tailwind: shadow-2xl
```

#### Level 5 - Very Heavy Shadow (Maximum elevation)
```
Box Shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35)
Usage: Critical overlays, premium components
Effect: Maximum visual separation
CSS Variable: --shadow-2xl
Tailwind: shadow-3xl (custom)
```

### 1.2 Directional Shadows (Optional Advanced)

#### Inner Shadow (Depth inset)
```
Box Shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)
Usage: Pressed buttons, input focus states
Effect: Creates pressed/depressed appearance
CSS Variable: --shadow-inner
```

#### Colored Shadows (Tinted shadows for emphasis)
```
Blue-tinted: 0 20px 25px -5px rgba(59, 130, 246, 0.2)
Cyan-tinted: 0 20px 25px -5px rgba(6, 182, 212, 0.2)
Purple-tinted: 0 20px 25px -5px rgba(168, 85, 247, 0.2)
Usage: Premium cards, featured elements, weather-specific states
Effect: Adds color personality while maintaining depth
```

### 1.3 Shadow-Opacity Variants

```
Shadow Dark: Multiply opacity by 1.3x for low-light themes
Shadow Light: Multiply opacity by 0.7x for bright areas
Shadow Hover: Multiply opacity by 1.5x for interactive states
Shadow Active: Multiply opacity by 1.2x for pressed states
```

---

## 2. DEPTH LAYERING SYSTEM

### 2.1 Z-Index Architecture

```
Background Layer: z-index: 0
├─ Page background gradient
└─ Static overlays

Card Layers: z-index: 1-10
├─ Base cards: 1
├─ Hovered cards: 2
├─ Interactive cards: 3
└─ Featured cards: 5

Overlay Layers: z-index: 20-30
├─ Search dropdown: 20
├─ Modals: 25
└─ Alerts: 30

Fixed/Sticky Layers: z-index: 40-50
├─ Header: 40
└─ Toast notifications: 50
```

### 2.2 Depth Transitions

#### Elevation Transitions
```
Normal → Hover: 
- Shadow Level 2 → Level 3
- Transform: translateY(-4px)
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
```

#### Press Feedback
```
Hover → Active (pressed):
- Shadow Level 3 → Level 1
- Transform: scale(0.98) translateY(-2px)
- Duration: 150ms
- Easing: cubic-bezier(0.4, 0, 1, 1)
```

#### Release Feedback
```
Active → Normal:
- Shadow Level 1 → Level 2
- Transform: scale(1) translateY(0)
- Duration: 200ms
- Easing: cubic-bezier(0, 0, 0.2, 1)
```

---

## 3. GRADIENT BORDERS & OVERLAYS

### 3.1 Gradient Border System

#### Border Gradient - Primary
```
Gradient: linear-gradient(135deg, #3B82F6, #06B6D4)
Thickness: 1px (outer), 2px (inner)
Radius: Maintained (rounded-3xl)
Opacity: 0.5 (normal), 0.8 (hover)
Usage: Premium cards, featured elements
Implementation: Background-clip with pseudo-element or border-image
```

#### Border Gradient - Accent
```
Gradient: linear-gradient(135deg, #A855F7, #F43F5E)
Thickness: 1px
Opacity: 0.3 (normal), 0.6 (hover)
Usage: Special highlight cards
```

#### Border Gradient - Subtle
```
Gradient: linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0))
Thickness: 1px
Opacity: Always 0.5
Usage: Standard cards for subtle definition
```

### 3.2 Gradient Overlay Techniques

#### Top Gradient Overlay
```
Position: Fixed at top of card
Gradient: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)
Height: 1px - 4px
Effect: Creates "glow" from top
Opacity: 0.5 - 1.0
Usage: All glass cards for internal light effect
```

#### Inner Radial Overlay (optional)
```
Position: Centered, radial gradient
Gradient: radial-gradient(ellipse at center, rgba(255,255,255,0.05), transparent)
Effect: Subtle interior light
Opacity: 0.3
Usage: Large cards, featured elements
```

#### Corner Glow (optional)
```
Position: Corners (pseudo-elements or wrapper)
Gradient: Radial from corner, colored glow
Colors: Primary/Secondary accent colors
Opacity: 0.1 - 0.2
Effect: Subtle corner highlights
```

### 3.3 Gradient Border Implementation Methods

#### Method A: Pseudo-Element Border (Recommended)
```
CSS: 
  position: relative
  border: 2px solid transparent
  background: 
    linear-gradient(#slate-800, #slate-800) padding-box,
    linear-gradient(135deg, #3B82F6, #06B6D4) border-box
  effect: Clean, performant, supports border-radius
```

#### Method B: Box-Shadow Gradient (Alternative)
```
CSS:
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.5)
  effect: Simpler but less versatile
```

#### Method C: SVG Filter (Advanced)
```
Use only for very special components
Performance consideration: Avoid overuse
```

---

## 4. COMPONENT-SPECIFIC SHADOW & DEPTH UPDATES

### 4.1 Glass Card Component (`GlassCard.tsx`)

#### Variant: Primary Card
```
Box Shadow: --shadow-md (Level 2)
Backdrop: blur(24px) saturate(200%)
Border: 1px solid rgba(255, 255, 255, 0.15)
Gradient Border: Primary gradient, opacity 0.3
Background: rgba(255, 255, 255, 0.10)
Hover State:
  - Box Shadow: --shadow-lg (Level 3)
  - Transform: translateY(-4px)
  - Border: 1px solid rgba(255, 255, 255, 0.25)
  - Gradient Border Opacity: 0.5
  - Transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

#### Variant: Secondary Card
```
Box Shadow: --shadow-sm (Level 1)
Backdrop: blur(16px)
Border: 1px solid rgba(255, 255, 255, 0.10)
Background: rgba(255, 255, 255, 0.05)
Hover State:
  - Box Shadow: --shadow-md (Level 2)
  - Transform: translateY(-2px)
  - Gradient Border Opacity: 0.4
  - Transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

#### Variant: Tertiary Card (Flat)
```
Box Shadow: --shadow-xs (Level 0)
Backdrop: blur(8px)
Border: 1px solid rgba(255, 255, 255, 0.08)
Background: rgba(255, 255, 255, 0.02)
Hover State:
  - Box Shadow: --shadow-sm (Level 1)
  - Transform: translateY(-1px)
  - Gradient Border Opacity: 0.3
  - Transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

### 4.2 Search Bar Component (`SearchBar.tsx`)

#### Main Input Field
```
Box Shadow: --shadow-sm (Level 1) in normal state
Border: 1px solid rgba(255, 255, 255, 0.15)
Gradient Border: Subtle gradient, opacity 0.2
Focus State:
  - Box Shadow: --shadow-md (Level 2)
  - Transform: scale(1.02)
  - Border: 1px solid rgba(255, 255, 255, 0.25)
  - Gradient Border Opacity: 0.6
  - Outline: none (handled by shadow)
  - Transition: 200ms cubic-bezier(0, 0, 0.2, 1)
Transition for all properties: 200ms ease-out
```

#### Dropdown/Suggestions List
```
Position: Positioned below input
Box Shadow: --shadow-xl (Level 4)
Border: 1px solid rgba(255, 255, 255, 0.15)
Gradient Border: Primary gradient, opacity 0.4
Background: rgba(30, 41, 59, 0.95) (semi-opaque slate-800)
Backdrop: blur(24px)
Animation:
  - Enter: slideDown 300ms cubic-bezier(0.4, 0, 0.2, 1)
  - Exit: slideUp 200ms cubic-bezier(0.4, 0, 1, 1)
Suggestion Items:
  - Hover: 
    - Background: rgba(59, 130, 246, 0.2)
    - Transform: translateX(4px)
    - Shadow: --shadow-sm (Level 1)
    - Duration: 150ms
```

### 4.3 Weather Stat Cards (`page.tsx` stat-items)

#### Current Weather Main Card
```
Box Shadow: --shadow-lg (Level 3)
Gradient Border: Primary gradient, opacity 0.4
Background: rgba(255, 255, 255, 0.08)
Backdrop: blur(24px)
Hover State:
  - Box Shadow: --shadow-xl (Level 4)
  - Transform: translateY(-6px)
  - Gradient Border Opacity: 0.6
  - Background: rgba(255, 255, 255, 0.12)
  - Transition: 300ms cubic-bezier(0.34, 1.56, 0.64, 1) (ease-out-back)
```

#### Stat Item Cards (Air Quality, UV Index, Humidity, etc.)
```
Box Shadow: --shadow-md (Level 2)
Gradient Border: Subtle gradient, opacity 0.25
Background: rgba(255, 255, 255, 0.06)
Backdrop: blur(16px)
Hover State:
  - Box Shadow: --shadow-lg (Level 3)
  - Transform: translateY(-3px)
  - Background: rgba(255, 255, 255, 0.10)
  - Gradient Border Opacity: 0.4
  - Transition: 250ms cubic-bezier(0.4, 0, 0.2, 1)
Color-Coded Top Border (4px, no blur):
  - Success (Good): #10B981
  - Warning (Moderate): #F59E0B
  - Danger (Poor): #F43F5E
  - Info (Other): #3B82F6
```

#### Forecast Card
```
Box Shadow: --shadow-md (Level 2)
Gradient Border: Weather-specific gradient (dynamic)
Background: rgba(255, 255, 255, 0.05)
Backdrop: blur(16px)
Border: 1px solid rgba(255, 255, 255, 0.15)
Hover State:
  - Box Shadow: --shadow-lg (Level 3)
  - Transform: scale(1.05) translateY(-4px)
  - Background: rgba(255, 255, 255, 0.08)
  - Transition: 250ms cubic-bezier(0.34, 1.56, 0.64, 1)
Click State:
  - Box Shadow: --shadow-sm (Level 1)
  - Transform: scale(1.02) translateY(-1px)
  - Transition: 100ms cubic-bezier(0.4, 0, 1, 1)
```

### 4.4 Interactive Elements (Buttons, etc.)

#### Primary Button
```
Default State:
  - Background: linear-gradient(135deg, #3B82F6, #0EA5E9)
  - Box Shadow: --shadow-md (Level 2)
  - Transform: translateY(0)
Hover State:
  - Background: linear-gradient(135deg, #60A5FA, #22D3EE)
  - Box Shadow: --shadow-lg (Level 3)
  - Transform: translateY(-2px)
  - Transition: 200ms cubic-bezier(0.4, 0, 0.2, 1)
Active/Press State:
  - Background: linear-gradient(135deg, #2563EB, #0891B2)
  - Box Shadow: --shadow-sm (Level 1), inset 0 2px 4px rgba(0, 0, 0, 0.1)
  - Transform: scale(0.98) translateY(0)
  - Transition: 100ms cubic-bezier(0.4, 0, 1, 1)
```

#### Secondary Button
```
Default State:
  - Background: rgba(255, 255, 255, 0.1)
  - Border: 1px solid rgba(255, 255, 255, 0.2)
  - Box Shadow: --shadow-sm (Level 1)
Hover State:
  - Background: rgba(255, 255, 255, 0.15)
  - Border: 1px solid rgba(255, 255, 255, 0.3)
  - Box Shadow: --shadow-md (Level 2)
  - Transform: translateY(-1px)
  - Transition: 200ms cubic-bezier(0.4, 0, 0.2, 1)
Active State:
  - Background: rgba(255, 255, 255, 0.08)
  - Box Shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), --shadow-sm
  - Transform: scale(0.98) translateY(0)
  - Transition: 100ms cubic-bezier(0.4, 0, 1, 1)
```

---

## 5. IMPLEMENTATION DETAILS

### 5.1 CSS Variables (Add to globals.css)

```css
/* Shadow System */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.1);

/* Colored Shadows */
--shadow-primary: 0 20px 25px -5px rgba(59, 130, 246, 0.2);
--shadow-secondary: 0 20px 25px -5px rgba(6, 182, 212, 0.2);
--shadow-accent: 0 20px 25px -5px rgba(168, 85, 247, 0.2);

/* Gradient Borders */
--gradient-border-primary: linear-gradient(135deg, #3B82F6, #06B6D4);
--gradient-border-accent: linear-gradient(135deg, #A855F7, #F43F5E);
--gradient-border-subtle: linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));

/* Elevation Transitions */
--transition-elevation: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-press: all 150ms cubic-bezier(0.4, 0, 1, 1);
--transition-release: all 200ms cubic-bezier(0, 0, 0.2, 1);
--transition-focus: all 200ms cubic-bezier(0, 0, 0.2, 1);
```

### 5.2 Utility Classes (Add to globals.css)

```css
/* Shadow Utilities */
.shadow-level-0 {
  box-shadow: var(--shadow-xs);
}

.shadow-level-1 {
  box-shadow: var(--shadow-sm);
}

.shadow-level-2 {
  box-shadow: var(--shadow-md);
}

.shadow-level-3 {
  box-shadow: var(--shadow-lg);
}

.shadow-level-4 {
  box-shadow: var(--shadow-xl);
}

.shadow-level-5 {
  box-shadow: var(--shadow-2xl);
}

.shadow-inner-sm {
  box-shadow: var(--shadow-inner);
}

.shadow-colored-primary {
  box-shadow: var(--shadow-primary);
}

.shadow-colored-secondary {
  box-shadow: var(--shadow-secondary);
}

.shadow-colored-accent {
  box-shadow: var(--shadow-accent);
}

/* Gradient Border Utilities */
.border-gradient-primary {
  position: relative;
  border: 1px solid transparent;
  background: 
    linear-gradient(rgba(30, 41, 59, 0.95), rgba(30, 41, 59, 0.95)) padding-box,
    var(--gradient-border-primary) border-box;
}

.border-gradient-accent {
  position: relative;
  border: 1px solid transparent;
  background: 
    linear-gradient(rgba(30, 41, 59, 0.95), rgba(30, 41, 59, 0.95)) padding-box,
    var(--gradient-border-accent) border-box;
}

.border-gradient-subtle {
  position: relative;
  border: 1px solid transparent;
  background: 
    linear-gradient(rgba(30, 41, 59, 0.95), rgba(30, 41, 59, 0.95)) padding-box,
    var(--gradient-border-subtle) border-box;
}

/* Top Overlay Glow */
.overlay-glow-top::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.5), transparent);
  border-radius: inherit;
  pointer-events: none;
}

/* Elevation Hover Effects */
.lift-on-hover {
  transition: var(--transition-elevation);
}

.lift-on-hover:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.lift-sm-on-hover {
  transition: var(--transition-elevation);
}

.lift-sm-on-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Color-Coded Top Border */
.border-top-success {
  border-top: 4px solid #10B981;
}

.border-top-warning {
  border-top: 4px solid #F59E0B;
}

.border-top-danger {
  border-top: 4px solid #F43F5E;
}

.border-top-info {
  border-top: 4px solid #3B82F6;
}

/* Scale on Hover */
.scale-on-hover {
  transition: var(--transition-elevation);
}

.scale-on-hover:hover {
  transform: scale(1.05);
}

/* Press Feedback */
.press-feedback:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-press);
}
```

### 5.3 Component Updates Required

#### `src/app/globals.css`
```
1. Add all shadow variables (--shadow-xs through --shadow-2xl)
2. Add gradient border variables
3. Add transition timing variables
4. Add all shadow utility classes
5. Add gradient border classes
6. Add overlay glow utilities
7. Add hover/press feedback utilities
8. Update existing .glass-card variants to use new shadow system
9. Update .stat-item to include color-coded borders
```

#### `src/components/GlassCard.tsx`
```
1. Add gradient-border prop (optional: boolean, default: false)
2. Add shadow-level prop (optional: 1-5, default: 2)
3. Update className composition to use shadow variables
4. Add gradient border logic based on variant
5. Update hover states to use CSS transition variables
6. Example:
   - Primary variant: shadow-level-3, border-gradient-primary
   - Secondary variant: shadow-level-2, no border-gradient
   - Tertiary variant: shadow-level-1, border-gradient-subtle
```

#### `src/components/SearchBar.tsx`
```
1. Update input focus styles to use new shadow system
2. Add box-shadow: var(--shadow-md) on focus
3. Update dropdown to use --shadow-xl
4. Add gradient border to dropdown (border-gradient-primary)
5. Update suggestion hover to use shadow-level-1 and translateX
6. Add slideDown/slideUp animation keyframes (if not present)
7. Update all transitions to use CSS variables
```

#### `src/app/page.tsx`
```
1. Update main weather card to use shadow-level-3 (was using default)
2. Add border-gradient-primary to main card
3. Update stat-item className to include:
   - shadow-level-2
   - color-coded border-top (success/warning/danger/info)
   - lift-sm-on-hover
4. Update forecast cards to use:
   - shadow-level-2 by default
   - scale-on-hover and lift-on-hover
5. Ensure weather-specific backgrounds applied to stat cards
6. Add overlay-glow-top to premium cards
```

#### `src/components/WeatherIcon.tsx`
```
1. No major changes needed
2. Optional: Add subtle shadow to icon container if implemented
```

### 5.4 Tailwind Configuration Updates

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    boxShadow: {
      'xs': 'var(--shadow-xs)',
      'sm': 'var(--shadow-sm)',
      'md': 'var(--shadow-md)',
      'lg': 'var(--shadow-lg)',
      'xl': 'var(--shadow-xl)',
      '2xl': 'var(--shadow-2xl)',
      'inner-sm': 'var(--shadow-inner)',
      'colored-primary': 'var(--shadow-primary)',
      'colored-secondary': 'var(--shadow-secondary)',
      'colored-accent': 'var(--shadow-accent)',
    },
    transitionDuration: {
      'elevation': 'var(--transition-elevation)',
      'press': 'var(--transition-press)',
      'release': 'var(--transition-release)',
      'focus': 'var(--transition-focus)',
    },
  },
}
```

---

## 6. ANIMATION ADDITIONS (if not present from Phase 1)

### 6.1 Elevation Animations

```css
@keyframes elevateUp {
  from {
    transform: translateY(0);
    box-shadow: var(--shadow-md);
  }
  to {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
}

@keyframes pressDown {
  from {
    transform: scale(1) translateY(0);
  }
  to {
    transform: scale(0.98) translateY(-2px);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}

@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
}
```

---

## 7. TESTING CHECKLIST

### 7.1 Visual Testing
- [ ] All shadows render with correct depth levels
- [ ] Gradient borders display smoothly on all card types
- [ ] Shadow transitions are smooth and performant
- [ ] Overlay glows appear subtle but visible on dark backgrounds
- [ ] Color-coded borders match design specifications
- [ ] Z-index layering correct (overlays appear above cards)

### 7.2 Interaction Testing
- [ ] Hover states elevate cards correctly
- [ ] Press feedback (scale + shadow) works on buttons
- [ ] Transitions are smooth (no jank or stuttering)
- [ ] Focus states have proper visual feedback
- [ ] Gradient borders animate smoothly on hover

### 7.3 Performance Testing
- [ ] No performance degradation with shadow effects
- [ ] Animations maintain 60fps
- [ ] No layout thrashing on hover/press
- [ ] Transitions use GPU-accelerated properties (transform, opacity)
- [ ] Page load time not significantly increased

### 7.4 Browser Compatibility
- [ ] Shadows render correctly in Chrome, Firefox, Safari
- [ ] Gradient borders work across browsers
- [ ] Backdrop-filter blur works where expected
- [ ] Fallbacks for older browsers (graceful degradation)

### 7.5 Accessibility Testing
- [ ] Focus states clearly visible (shadow + outline)
- [ ] Contrast not degraded by overlay glows
- [ ] No color-only information conveyed (borders have form)
- [ ] Animation respects prefers-reduced-motion
- [ ] Shadow depth doesn't interfere with readability

### 7.6 Mobile Testing
- [ ] Shadows render correctly on mobile
- [ ] Hover states work with touch feedback
- [ ] No performance issues on lower-end devices
- [ ] Gradient borders scale appropriately
- [ ] Overlay glows not too intense on small screens

---

## 8. IMPLEMENTATION SEQUENCE

### Step 1: Add CSS Variables
- Update `globals.css` with all shadow, gradient, and transition variables

### Step 2: Add Utility Classes
- Implement shadow utilities (shadow-level-*)
- Implement gradient border utilities
- Implement hover/press feedback utilities

### Step 3: Update GlassCard Component
- Add shadow-level prop
- Update variant styling to use new shadows
- Add gradient border support

### Step 4: Update SearchBar Component
- Apply new shadow system to input and dropdown
- Add gradient borders
- Implement smooth transitions

### Step 5: Update Main Page Component
- Apply shadow levels to main weather card
- Apply color-coded borders to stat items
- Add lift/scale hover effects

### Step 6: Test & Validate
- Visual inspection across browsers
- Performance profiling
- Accessibility audit
- Mobile responsiveness check

---

## 9. ROLLBACK PLAN

If issues arise during implementation:

1. **CSS Variables Issue**: Revert `globals.css` to last known good state
2. **Component Rendering Issue**: Revert individual component file (GlassCard, SearchBar, page.tsx)
3. **Performance Issue**: Remove animations, keep static shadows
4. **Browser Compatibility Issue**: Simplify gradient borders to solid borders with fallback

Rollback sequence:
```bash
git revert HEAD~[N]           # Revert to previous commit
rm -rf .next                  # Clear Next.js build cache
npm run build                 # Rebuild
npm run dev                   # Test locally
```

---

## 10. SUCCESS CRITERIA

✅ Phase 2 is complete when:
- [ ] All shadow levels implemented and visible
- [ ] Gradient borders render smoothly on cards
- [ ] Hover states elevate with --shadow-lg
- [ ] Press feedback (scale) works on interactive elements
- [ ] Overlay glows appear on premium cards
- [ ] Color-coded borders on stat cards visible
- [ ] All transitions smooth (60fps)
- [ ] Build passes without errors
- [ ] No visual regressions from Phase 1
- [ ] Accessibility standards maintained (WCAG AA)
- [ ] Mobile performance acceptable (<2s load time)
- [ ] No browser compatibility issues

---

## 11. COMPARISON: Before vs. After

### Before Phase 2:
- Flat design with minimal depth
- Single shadow level on all cards
- No visual hierarchy through elevation
- Basic hover effects
- No gradient borders
- Limited visual polish

### After Phase 2:
- Sophisticated depth layering system
- 5+ shadow levels for visual hierarchy
- Clear elevation changes on interaction
- Smooth transitions with proper easing
- Premium gradient borders on featured elements
- Professional, polished appearance
- Responsive depth feedback on all interactive elements

---

## 12. DESIGNER NOTES

### Color & Shadow Harmony
- Blue shadows (#3B82F6) complement cool tones
- Keep shadow opacity consistent with glassmorphism theme
- Gradient borders add luxury feel without overwhelming

### Performance Optimization Tips
1. Use `transform: translateY()` and `box-shadow` for smooth animations
2. Avoid animating `width`/`height`/`top`/`left` properties
3. Group related properties in transitions
4. Test on low-end devices

### Accessibility Best Practices
1. Ensure shadow is not the only visual indicator
2. Maintain 4.5:1 contrast for text regardless of shadow
3. Support `prefers-reduced-motion` by disabling animations
4. Focus indicators should be distinct from shadows

