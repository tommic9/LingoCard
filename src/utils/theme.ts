/**
 * Theme management utilities
 */

import type { ThemeMode } from '../types';

/**
 * LocalStorage key for theme preference
 */
export const THEME_STORAGE_KEY = 'lingocards-theme';

/**
 * Detect system theme preference
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Get stored theme preference from localStorage
 */
export function getStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }

  return null;
}

/**
 * Store theme preference in localStorage
 */
export function setStoredTheme(theme: ThemeMode): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
}

/**
 * Resolve effective theme (system -> light/dark)
 */
export function resolveEffectiveTheme(theme: ThemeMode): 'light' | 'dark' {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

/**
 * Apply theme to DOM (add/remove 'dark' class on <html>)
 */
export function applyThemeToDOM(effectiveTheme: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  if (effectiveTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}
