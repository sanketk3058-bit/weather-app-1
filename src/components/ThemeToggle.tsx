'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

/**
 * Component for toggling between light and dark themes.
 * Renders a fixed-position button that switches the application theme.
 */
export const ThemeToggle = () => {
  // Use the custom useTheme hook to access theme state and toggle function
  const { theme, toggleTheme, mounted } = useTheme();
  
  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) return null;

  // Debug: log mount and theme for visibility checks in DevTools
  try {
    // eslint-disable-next-line no-console
    console.log('[ThemeToggle] mounted=', mounted, 'theme=', theme);
  } catch (e) {}

  return (
    <button
      onClick={toggleTheme}
      data-testid="theme-toggle"
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9999,
        background: '#ff3366', // Distinctive color for visibility
        color: '#fff',
        width: 72,
        height: 72,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span style={{ fontSize: 12, fontWeight: 700, marginRight: 8 }}>Theme</span>
      {/* Display appropriate icon based on current theme */}
      <span style={{ fontSize: 20 }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
    </button>
  );
};

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;
