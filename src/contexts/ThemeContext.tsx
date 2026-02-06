/**
 * Theme Context for managing app-wide theme state
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ThemeMode, ThemeContextType } from '../types';
import {
  getStoredTheme,
  setStoredTheme,
  resolveEffectiveTheme,
  applyThemeToDOM,
} from '../utils/theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize from localStorage or default to 'system'
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return getStoredTheme() || 'system';
  });

  // Resolve effective theme
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => {
    return resolveEffectiveTheme(theme);
  });

  // Update theme and persist to localStorage
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme);

    const resolved = resolveEffectiveTheme(newTheme);
    setEffectiveTheme(resolved);
    applyThemeToDOM(resolved);
  };

  // Listen for system theme changes (only when theme === 'system')
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const newEffective = e.matches ? 'dark' : 'light';
      setEffectiveTheme(newEffective);
      applyThemeToDOM(newEffective);
    };

    // Modern browsers
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  // Apply theme on mount and when effectiveTheme changes
  useEffect(() => {
    applyThemeToDOM(effectiveTheme);
  }, [effectiveTheme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    effectiveTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
