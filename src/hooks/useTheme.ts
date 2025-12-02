'use client';

import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = (saved as 'light' | 'dark') || (systemPrefersDark ? 'dark' : 'light');
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
      setTheme(initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) {
      // ignore storage errors
    }
    document.documentElement.classList.toggle('dark');
    setTheme(newTheme);
  };

  return { theme, toggleTheme, mounted };
};

export default useTheme;
