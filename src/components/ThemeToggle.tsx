'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, toggleTheme, mounted } = useTheme();
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
        background: '#ff3366',
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
      <span style={{ fontSize: 20 }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
    </button>
  );
};

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;
