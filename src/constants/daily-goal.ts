/**
 * Configuration for daily goal feature
 */
export const DAILY_GOAL_CONFIG = {
  storageKey: 'lingocards-daily-goal',
  defaultGoal: 20,
  minGoal: 5,
  maxGoal: 100,
  presets: [10, 15, 20, 30, 50],
} as const;
