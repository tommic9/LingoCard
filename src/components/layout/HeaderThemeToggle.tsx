/**
 * HeaderThemeToggle - Compact theme toggle for header (light/dark only)
 */

import { useTheme } from '../../contexts/ThemeContext';

export function HeaderThemeToggle() {
  const { effectiveTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    // Toggle between light and dark (no system option in header)
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-primary-700 rounded-lg transition"
      aria-label={`Switch to ${effectiveTheme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {effectiveTheme === 'dark' ? (
        // Sun icon (when dark mode is active, show sun to switch to light)
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        // Moon icon (when light mode is active, show moon to switch to dark)
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
