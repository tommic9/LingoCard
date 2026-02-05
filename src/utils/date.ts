/**
 * Date utility functions for LingoCards
 */

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is in the past (before today)
 */
export function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Check if a card is due for review
 */
export function isDue(nextReviewDate: Date): boolean {
  const now = new Date();
  return nextReviewDate <= now;
}

/**
 * Format a date as a relative string (e.g., "Today", "Tomorrow", "In 3 days")
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays === -1) {
    return 'Yesterday';
  } else if (diffDays > 1 && diffDays <= 7) {
    return `In ${diffDays} days`;
  } else if (diffDays < -1 && diffDays >= -7) {
    return `${Math.abs(diffDays)} days ago`;
  } else if (diffDays > 7 && diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7);
    return `In ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
  } else if (diffDays < -7 && diffDays >= -30) {
    const weeks = Math.floor(Math.abs(diffDays) / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffDays > 30) {
    const months = Math.floor(diffDays / 30);
    return `In ${months} ${months === 1 ? 'month' : 'months'}`;
  } else {
    const months = Math.floor(Math.abs(diffDays) / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
}

/**
 * Format a date as a short string (e.g., "Jan 15, 2024")
 */
export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Format a date as a long string (e.g., "Monday, January 15, 2024")
 */
export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Get the start of today
 */
export function getStartOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Get the end of today
 */
export function getEndOfToday(): Date {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today;
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get the number of days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 1000 * 60 * 60 * 24;
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / oneDay);
}
