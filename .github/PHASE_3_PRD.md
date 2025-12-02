# PHASE 3 PRD: Hover Animations & Micro-Interactions

## Executive Summary
Implement sophisticated hover animations, micro-interactions, and interactive feedback systems that enhance user engagement and provide clear visual feedback for all interactive elements. This phase transforms static interactions into delightful, responsive experiences while maintaining performance.

---

## 1. BUTTON INTERACTIONS

### 1.1 Primary Button States

#### Default State
```
Appearance: Gradient blue background (linear-gradient(135deg, #3B82F6, #0EA5E9))
Shadow: var(--shadow-md)
Transform: scale(1) translateY(0)
Cursor: pointer
```

#### Hover State
```
Appearance: Brighter gradient (linear-gradient(135deg, #60A5FA, #22D3EE))
Shadow: var(--shadow-lg)
Transform: translateY(-3px) scale(1.02)
Duration: 200ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Effect: Button lifts upward and grows slightly
```

#### Active/Press State
```
Appearance: Darker gradient (linear-gradient(135deg, #1E40AF, #0891B2))
Shadow: var(--shadow-sm) + inset 0 2px 4px rgba(0, 0, 0, 0.1)
Transform: scale(0.98) translateY(-1px)
Duration: 100ms
Easing: cubic-bezier(0.4, 0, 1, 1)
Effect: Button compresses down with inner shadow for pressed effect
```

#### Disabled State
```
Appearance: Grayed out (linear-gradient(135deg, #9CA3AF, #9CA3AF))
Opacity: 0.5
Shadow: none
Cursor: not-allowed
Transform: none
Transition: none (instantaneous)
```

### 1.2 Secondary Button States

#### Default State
```
Appearance: Semi-transparent white background (rgba(255, 255, 255, 0.1))
Border: 1px solid rgba(255, 255, 255, 0.2)
Shadow: var(--shadow-sm)
Transform: scale(1) translateY(0)
Cursor: pointer
```

#### Hover State
```
Appearance: Increased transparency (rgba(255, 255, 255, 0.15))
Border: 1px solid rgba(255, 255, 255, 0.3)
Shadow: var(--shadow-md)
Transform: translateY(-2px) scale(1.01)
Duration: 200ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Effect: Subtle lift with slight growth
```

#### Active/Press State
```
Appearance: Reduced transparency (rgba(255, 255, 255, 0.08))
Border: 1px solid rgba(255, 255, 255, 0.2)
Shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), var(--shadow-sm)
Transform: scale(0.97) translateY(0)
Duration: 100ms
Easing: cubic-bezier(0.4, 0, 1, 1)
Effect: Pressed inward with inner shadow
```

---

## 2. CARD & COMPONENT HOVER EFFECTS

### 2.1 Weather Data Card (Main Card)

#### Default State
```
Appearance: Primary glass card styling
Transform: scale(1) translateY(0)
Shadow: var(--shadow-lg)
Opacity: 1
```

#### Hover State
```
Appearance: Brightened background
Transform: translateY(-8px) scale(1.02)
Shadow: var(--shadow-xl)
Border: Enhanced color (rgba(255, 255, 255, 0.25))
Duration: 300ms
Easing: cubic-bezier(0.34, 1.56, 0.64, 1) [ease-out-back]
Effect: Dramatic lift with scale for emphasis
```

### 2.2 Stat Item Cards

#### Default State
```
Appearance: Secondary glass card with color-coded top border (4px)
Transform: scale(1) translateY(0)
Shadow: var(--shadow-md)
Background: rgba(255, 255, 255, 0.06)
```

#### Hover State
```
Appearance: Increased background opacity (rgba(255, 255, 255, 0.10))
Transform: translateY(-4px) scale(1.04)
Shadow: var(--shadow-lg)
Top border: Brighter, more saturated
Duration: 250ms
Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
Effect: Lift with scale for interactive emphasis
```

### 2.3 Forecast Card

#### Default State
```
Appearance: Secondary glass card, square/rectangular layout
Transform: scale(1) translateY(0)
Shadow: var(--shadow-md)
Opacity: 1
```

#### Hover State
```
Appearance: Enhanced brightness
Transform: scale(1.08) translateY(-6px)
Shadow: var(--shadow-xl)
Background: Increased opacity for depth
Duration: 250ms
Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
Effect: Significant scale and lift for engagement
```

#### Click State (Press Feedback)
```
Transform: scale(1.02) translateY(-2px)
Shadow: var(--shadow-md)
Duration: 100ms
Easing: cubic-bezier(0.4, 0, 1, 1)
Effect: Subtle compression on tap
```

### 2.4 Search Bar Focus Effects

#### Default State
```
Input Shadow: var(--shadow-sm)
Border: 1px solid rgba(255, 255, 255, 0.15)
Background: rgba(255, 255, 255, 0.10)
Transform: scale(1)
```

#### Focus State
```
Input Shadow: var(--shadow-md)
Border: 1px solid rgba(255, 255, 255, 0.30)
Background: rgba(255, 255, 255, 0.12)
Gradient Border: Primary gradient, opacity 0.6
Transform: scale(1.02)
Duration: 200ms
Easing: cubic-bezier(0, 0, 0.2, 1)
Outline: none (handled by shadow)
Effect: Input grows and becomes more prominent
```

---

## 3. TEXT & NUMBER ANIMATIONS

### 3.1 Number Transitions

#### Temperature Display Animation
```
Trigger: When temperature data updates
Animation Type: Smooth number transition
Duration: 0.6s
Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
Effect: Smoothly animate from old value to new value
Example: 25°C → 28°C animates smoothly
```

#### Stat Number Transitions
```
Trigger: When any numeric stat updates
Animation Type: Slide + Fade
Duration: 0.4s
Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
Effect: Old number fades up while new number slides up from bottom
Stagger: 50ms between each stat
```

### 3.2 Text Reveal Animation

#### Label Reveal
```
Trigger: Component mount or data update
Animation: Slide up from bottom
Duration: 0.3s
Opacity: 0 → 1
Transform: translateY(8px) → translateY(0)
Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
```

#### Value Reveal
```
Trigger: Component mount or data update
Animation: Fade in + slight scale
Duration: 0.4s
Opacity: 0 → 1
Scale: 0.95 → 1
Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
Delay: 50ms (after label)
```

---

## 4. ICON ANIMATIONS

### 4.1 Weather Icon Animations (Enhanced)

#### Current Conditions
```
Default: Smooth continuous animation based on weather type
Rain: Vertical bounce/fall animation (2s cycle)
Storm: Rapid shake with flash (1s cycle)
Snow: Gentle float down animation (3s cycle)
Clear: Subtle rotate animation (4s cycle)
```

#### Icon Hover Effect
```
Trigger: Hover on weather icon
Animation: Rotate + Scale
Duration: 300ms
Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
Rotate: 0deg → 10deg → 0deg
Scale: 1 → 1.1 → 1
Effect: Playful bounce on hover
```

### 4.2 Interactive Icon Animations

#### Search Icon
```
Default: Static
On Search Focus: Subtle pulse
Duration: 600ms (infinite)
Scale: 1 → 1.05 → 1
Opacity: 1 → 0.7 → 1
Effect: Attracts attention during search
```

#### Close/Clear Icon
```
Default: Static
On Hover: Rotate + Slight scale
Duration: 200ms
Rotate: 0deg → 90deg
Scale: 1 → 1.1
Effect: Indicates action on hover
```

---

## 5. DROPDOWN & MENU ANIMATIONS

### 5.1 Search Suggestions Dropdown

#### Enter Animation
```
Trigger: Suggestions dropdown appears
Animation: slideDown
Duration: 300ms
Origin: Top (staggered from input)
Keyframe:
  0%: transform translateY(-16px), opacity 0
  100%: transform translateY(0), opacity 1
Easing: cubic-bezier(0.4, 0, 0.2, 1)
```

#### Exit Animation
```
Trigger: Suggestions dropdown closes
Animation: slideUp
Duration: 200ms
Keyframe:
  0%: transform translateY(0), opacity 1
  100%: transform translateY(-16px), opacity 0
Easing: cubic-bezier(0.4, 0, 1, 1)
```

### 5.2 Suggestion Item Interactions

#### Hover State
```
Trigger: Mouse over suggestion item
Transform: translateX(4px)
Background: rgba(59, 130, 246, 0.3)
Shadow: var(--shadow-sm)
Duration: 150ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Effect: Item slides right and highlights
```

#### Click State
```
Trigger: Mouse down on suggestion
Transform: scale(0.98) translateX(2px)
Shadow: var(--shadow-xs)
Duration: 100ms
Easing: cubic-bezier(0.4, 0, 1, 1)
Effect: Compress feedback
```

---

## 6. PAGE TRANSITION ANIMATIONS

### 6.1 Content Load Animation

#### Initial Load
```
Trigger: Page component mounts
Animation: fadeIn
Duration: 0.5s
Opacity: 0 → 1
Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
Effect: Content fades in smoothly
```

#### Header Animation
```
Trigger: Page component mounts
Animation: slideInDown
Duration: 0.4s
Transform: translateY(-20px) → translateY(0)
Opacity: 0 → 1
Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
Delay: 0ms
```

#### Weather Card Animation
```
Trigger: Page component mounts
Animation: slideInUp
Duration: 0.5s
Transform: translateY(20px) → translateY(0)
Opacity: 0 → 1
Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
Delay: 50ms
```

#### Stat Cards Stagger Animation
```
Trigger: Page component mounts
Animation: fadeIn + slideUp
Duration: 0.4s per card
Transform: translateY(16px) → translateY(0)
Opacity: 0 → 1
Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
Stagger: 40ms between each card
Delay: 100ms start
```

### 6.2 Data Update Animation

#### Weather Data Update
```
Trigger: New weather data fetched
Animation: Smooth transition
Duration: 400ms
Opacity: 1 → 0.5 → 1 (gentle pulse)
Effect: Indicates data refresh without jarring change
```

---

## 7. IMPLEMENTATION DETAILS

### 7.1 New CSS Keyframes (Add to globals.css)

```css
/* ===== BUTTON ANIMATIONS ===== */
@keyframes buttonHover {
  from {
    transform: translateY(0) scale(1);
  }
  to {
    transform: translateY(-3px) scale(1.02);
  }
}

@keyframes buttonPress {
  from {
    transform: scale(1) translateY(0);
  }
  to {
    transform: scale(0.98) translateY(-1px);
  }
}

/* ===== NUMBER TRANSITIONS ===== */
@keyframes numberUpdate {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== ICON ANIMATIONS ===== */
@keyframes iconHover {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(10deg) scale(1.1);
  }
  100% {
    transform: rotate(0deg) scale(1);
  }
}

@keyframes iconPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

@keyframes iconRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* ===== SUGGESTION ANIMATIONS ===== */
@keyframes suggestSlideRight {
  from {
    transform: translateX(0);
    background: rgba(59, 130, 246, 0);
  }
  to {
    transform: translateX(4px);
    background: rgba(59, 130, 246, 0.3);
  }
}

/* ===== PAGE TRANSITIONS ===== */
@keyframes slideInDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ===== DATA UPDATE PULSE ===== */
@keyframes updatePulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
```

### 7.2 New Utility Classes (Add to globals.css)

```css
/* ===== ANIMATION UTILITIES ===== */
.animate-button-hover {
  animation: buttonHover 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-button-press {
  animation: buttonPress 100ms cubic-bezier(0.4, 0, 1, 1);
}

.animate-number-update {
  animation: numberUpdate 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-icon-hover {
  animation: iconHover 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-icon-pulse {
  animation: iconPulse 600ms cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.animate-icon-rotate {
  animation: iconRotate 2s linear infinite;
}

.animate-suggest-slide {
  animation: suggestSlideRight 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slide-down {
  animation: slideInDown 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-slide-up {
  animation: slideInUp 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-fade-scale {
  animation: fadeInScale 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-update-pulse {
  animation: updatePulse 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== STAGGER UTILITIES ===== */
.animation-delay-0 {
  animation-delay: 0ms;
}

.animation-delay-40 {
  animation-delay: 40ms;
}

.animation-delay-50 {
  animation-delay: 50ms;
}

.animation-delay-100 {
  animation-delay: 100ms;
}

.animation-delay-150 {
  animation-delay: 150ms;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

/* ===== SMOOTH TRANSITION UTILITIES ===== */
.transition-smooth {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-smooth-fast {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-smooth-slow {
  transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-back {
  transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ===== PREFERS-REDUCED-MOTION SUPPORT ===== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 7.3 Component-Specific Updates

#### `src/app/page.tsx` Updates
```
1. Add animation classes to weather card:
   - Main card: animate-fade-scale animation-delay-50
   - Stat items: animate-fade-scale with staggered delays
   - Forecast cards: animate-fade-scale with staggered delays

2. Add hover classes:
   - Main card: lift-on-hover (already exists, now enhanced)
   - Stat items: lift-sm-on-hover with scale-on-hover
   - Forecast cards: scale-on-hover with animation-delay stagger

3. Update stat item renders:
   - Wrap number display with animation wrapper
   - Add key change trigger for number updates

4. Add data-update animation trigger:
   - Apply updatePulse on weatherData changes
   - Duration: 400ms
```

#### `src/components/SearchBar.tsx` Updates
```
1. Dropdown appearance animation:
   - Add animate-slide-down on mount
   - Add animation-delay-0 to dropdown
   - Add fade-in for smooth entrance

2. Suggestion item interactions:
   - Add hover class: animate-suggest-slide
   - Add press feedback: scale 0.98
   - Add smooth transitions

3. Search icon animation:
   - Pulse animation on search focus
   - Add animate-icon-pulse class when focused
   - Remove animation on blur

4. Input focus animation:
   - Enhance scale-on-focus effect
   - Add smooth transition timing
```

#### `src/components/WeatherIcon.tsx` Updates
```
1. Icon hover animation:
   - Add animate-icon-hover on hover
   - Apply to icon element
   - Trigger on onMouseEnter/onMouseLeave

2. Weather-specific animations:
   - Verify rain/storm/snow animations working
   - Add scale on weather icon hover
   - Ensure smooth keyframe execution

3. Animation variants:
   - Clear: subtle rotate (keep existing)
   - Rainy: fall animation (keep existing)
   - Storm: shake + flash (keep existing)
   - Snow: float animation (keep existing)
```

#### `src/components/GlassCard.tsx` Updates
```
1. Add hover animation prop:
   - New prop: animateHover?: 'lift' | 'scale' | 'both' (default: 'lift')
   
2. Update className logic:
   - Primary variant: lift-on-hover
   - Secondary variant: lift-sm-on-hover
   - Tertiary variant: no hover by default

3. Add press feedback:
   - All variants: press-feedback class on active

4. Add animation class composition:
   - Combine with existing elevation transitions
   - Ensure smooth transition timing
```

---

## 8. ANIMATION PERFORMANCE OPTIMIZATION

### 8.1 GPU Acceleration
```
Use only these properties for animations (GPU-accelerated):
- transform (translate, scale, rotate)
- opacity
- filter (if necessary)

AVOID these properties (CPU-intensive):
- width, height
- margin, padding
- left, top, right, bottom
- box-shadow (use during transitions only)
```

### 8.2 Frame Rate Optimization
```
Target: 60fps minimum
Reduce motion:
- Lower animation durations for mobile
- Use will-change sparingly
- Batch DOM updates
- Debounce resize handlers
```

### 8.3 Motion Preferences
```
Implement @media (prefers-reduced-motion: reduce)
- Disable animations for motion-sensitive users
- Keep functionality intact
- Maintain visual states
```

---

## 9. TESTING CHECKLIST

### 9.1 Animation Testing
- [ ] All button hover animations smooth and 60fps
- [ ] Card lift animations trigger correctly
- [ ] Number transitions display smoothly
- [ ] Icon animations match weather conditions
- [ ] Dropdown animations enter/exit cleanly
- [ ] Staggered animations maintain proper delay

### 9.2 Interaction Testing
- [ ] Click feedback (press) works on all buttons
- [ ] Suggestion items slide on hover
- [ ] Search bar input focus animation working
- [ ] Weather icon responds to hover
- [ ] Page transitions smooth on load
- [ ] Data updates trigger animations

### 9.3 Performance Testing
- [ ] No animation jank (60fps minimum)
- [ ] No layout thrashing
- [ ] GPU acceleration active
- [ ] Mobile performance acceptable
- [ ] Long animation sequences don't block UI
- [ ] Animation cleanup (no memory leaks)

### 9.4 Accessibility Testing
- [ ] prefers-reduced-motion respected
- [ ] Animations don't distract from content
- [ ] Focus states clear and visible
- [ ] Keyboard navigation unaffected
- [ ] Screen readers ignore animations
- [ ] Contrast maintained during animations

### 9.5 Cross-Browser Testing
- [ ] Chrome animations smooth
- [ ] Firefox animations smooth
- [ ] Safari animations smooth
- [ ] Mobile browsers maintain performance
- [ ] No animation glitches on older devices

---

## 10. IMPLEMENTATION SEQUENCE

### Step 1: Add Keyframes
- Add all keyframe definitions to globals.css
- Verify CSS syntax correct
- Test keyframe timing in DevTools

### Step 2: Add Utility Classes
- Add animation utility classes to globals.css
- Add stagger delay utilities
- Add smooth transition utilities
- Add prefers-reduced-motion media query

### Step 3: Update GlassCard Component
- Add animateHover prop
- Update className logic for variants
- Add press-feedback class support
- Test hover animations

### Step 4: Update SearchBar Component
- Add dropdown entrance animation
- Update suggestion hover effects
- Add search icon pulse animation
- Test interactions

### Step 5: Update WeatherIcon Component
- Add hover animation logic
- Verify weather-specific animations
- Test icon interactions
- Ensure smooth playback

### Step 6: Update Main Page Component
- Add load-time stagger animations
- Update stat item animations
- Add data-update pulse triggers
- Apply stagger utilities

### Step 7: Performance Testing
- Profile animations in DevTools
- Check frame rate (60fps minimum)
- Test on low-end devices
- Verify GPU acceleration

### Step 8: Accessibility Testing
- Test with prefers-reduced-motion
- Verify focus states
- Test keyboard navigation
- Screen reader compatibility check

---

## 11. ROLLBACK PLAN

If animations cause performance issues:

1. **Remove specific animation**: Comment out keyframe and utility class
2. **Disable animation category**: Remove from component (e.g., remove hover animations but keep load animations)
3. **Simplify animations**: Reduce duration or remove complex transforms
4. **Full rollback**: Revert globals.css changes

Rollback commands:
```bash
git diff src/app/globals.css  # Review changes
git checkout src/app/globals.css  # Revert file
rm -rf .next && npm run build  # Clean rebuild
```

---

## 12. SUCCESS CRITERIA

✅ Phase 3 is complete when:
- [ ] All button hover/press animations implemented and smooth
- [ ] Card lift animations working on primary/secondary/tertiary variants
- [ ] Icon animations enhanced with hover effects
- [ ] Dropdown animations smooth and performant
- [ ] Number transitions display smoothly
- [ ] Page load animations staggered correctly
- [ ] All animations 60fps minimum
- [ ] No performance degradation from Phase 1-2
- [ ] Accessibility preserved (prefers-reduced-motion)
- [ ] Cross-browser compatibility verified
- [ ] Mobile performance acceptable
- [ ] Build passes without errors
- [ ] No visual regressions

---

## 13. DESIGNER NOTES

### Easing Curves Used
```
Ease Out: cubic-bezier(0.4, 0, 0.2, 1) - Standard exit animation
Ease Out Back: cubic-bezier(0.34, 1.56, 0.64, 1) - Bouncy, playful effect
Ease In Out: cubic-bezier(0.4, 0, 1, 1) - Smooth press/release
```

### Animation Best Practices
1. Keep durations short (150-400ms) for interactions
2. Use longer durations (500-800ms) for page transitions
3. Stagger related animations by 40-50ms
4. Never animate during data fetch (disable while loading)
5. Always provide visual feedback on interaction

### Mobile Considerations
1. Reduce animation durations on mobile (80% of desktop)
2. Simplify stagger sequences
3. Disable some hover effects on touch devices
4. Test on actual devices, not just simulators

