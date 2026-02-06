/**
 * ThemeToggle - Segmented control for theme selection
 */

import { useTheme } from '../../contexts/ThemeContext';
import type { ThemeMode } from '../../types';

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
  {
    value: 'light',
    label: 'Light',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ),
  },
  {
    value: 'system',
    label: 'System',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {THEME_OPTIONS.map((option) => {
          const isActive = theme === option.value;

          return (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md transition-all duration-200 ${
                isActive
                  ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              aria-label={`Switch to ${option.label} theme`}
              aria-pressed={isActive}
            >
              {option.icon}
              <span className="font-medium text-sm">{option.label}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {theme === 'system'
          ? 'Theme follows your system settings'
          : `Theme is set to ${theme} mode`}
      </p>
    </div>
  );
}
