'use client';

// Import React hooks for state and side effects
import { useState, useEffect } from 'react';

/**
 * Custom hook to manage the application's theme (light/dark mode).
 * Handles persistence to localStorage and synchronization with system preferences.
 * 
 * @returns An object containing:
 * - theme: The current theme ('light' or 'dark')
 * - toggleTheme: Function to switch between themes
 * - mounted: Boolean indicating if the component has mounted (to prevent hydration mismatch)
 */
export const useTheme = () => {
  // State to store the current theme. Defaults to 'light'.
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // State to track if the component has mounted on the client.
  // This is crucial for Next.js to avoid hydration errors when accessing window/localStorage.
  const [mounted, setMounted] = useState(false);

  // Effect to initialize the theme on client-side mount
  useEffect(() => {
    // Mark as mounted
    setMounted(true);
    
    // Ensure we are running in the browser environment
    if (typeof window !== 'undefined') {
      // Try to retrieve the saved theme from localStorage
      const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
      
      // Check if the user's system prefers dark mode
      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Determine the initial theme:
      // 1. Use saved preference if available
      // 2. Fallback to system preference
      // 3. Default to 'light' (implicit in logic)
      const initialTheme = (saved as 'light' | 'dark') || (systemPrefersDark ? 'dark' : 'light');
      
      // Apply the 'dark' class to the document root if needed
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
      
      // Update the state with the determined theme
      setTheme(initialTheme);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Toggles the theme between 'light' and 'dark'.
   * Updates state, localStorage, and the document's class list.
   */
  const toggleTheme = () => {
    // Calculate the new theme based on the current state
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    try {
      // Save the new preference to localStorage
      localStorage.setItem('theme', newTheme);
    } catch (e) {
      // Silently ignore storage errors (e.g., if cookies/storage are disabled)
    }
    
    // Toggle the 'dark' class on the html element
    // This triggers Tailwind's dark mode styles
    document.documentElement.classList.toggle('dark');
    
    // Update the local state
    setTheme(newTheme);
  };

  // Return the hook's interface
  return { theme, toggleTheme, mounted };
};

// Default export for the hook
export default useTheme;
