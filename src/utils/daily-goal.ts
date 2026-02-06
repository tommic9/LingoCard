/**
 * Utility functions for daily goal persistence
 */

import { DAILY_GOAL_CONFIG } from '../constants/daily-goal';

/**
 * Get stored daily goal from localStorage
 * @returns The stored goal or default value
 */
export function getStoredDailyGoal(): number {
  if (typeof window === 'undefined') {
    return DAILY_GOAL_CONFIG.defaultGoal;
  }

  try {
    const stored = localStorage.getItem(DAILY_GOAL_CONFIG.storageKey);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (
        !isNaN(parsed) &&
        parsed >= DAILY_GOAL_CONFIG.minGoal &&
        parsed <= DAILY_GOAL_CONFIG.maxGoal
      ) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to read daily goal from localStorage:', error);
  }

  return DAILY_GOAL_CONFIG.defaultGoal;
}

/**
 * Save daily goal to localStorage
 * @param goal The goal value to save (will be clamped to min/max)
 */
export function setStoredDailyGoal(goal: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Clamp value to valid range
    const clamped = Math.max(
      DAILY_GOAL_CONFIG.minGoal,
      Math.min(DAILY_GOAL_CONFIG.maxGoal, goal)
    );

    localStorage.setItem(DAILY_GOAL_CONFIG.storageKey, clamped.toString());
  } catch (error) {
    console.error('Failed to save daily goal to localStorage:', error);
  }
}
