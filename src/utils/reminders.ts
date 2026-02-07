/**
 * Study reminders logic and preferences
 */

const REMINDER_STORAGE_KEY = 'lingocards-reminders';

export interface ReminderPreferences {
  enabled: boolean;
  time: string; // Format: "HH:MM" (24-hour)
  lastChecked?: string; // ISO date string
}

const DEFAULT_PREFERENCES: ReminderPreferences = {
  enabled: false,
  time: '20:00', // 8 PM default
};

/**
 * Get reminder preferences from localStorage
 */
export function getReminderPreferences(): ReminderPreferences {
  try {
    const stored = localStorage.getItem(REMINDER_STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PREFERENCES;
    }
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
  } catch (error) {
    console.error('Failed to load reminder preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save reminder preferences to localStorage
 */
export function saveReminderPreferences(preferences: ReminderPreferences): void {
  try {
    localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save reminder preferences:', error);
  }
}

/**
 * Calculate next reminder time based on preferences
 */
export function getNextReminderTime(time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const reminderDate = new Date();

  reminderDate.setHours(hours, minutes, 0, 0);

  // If time has passed today, schedule for tomorrow
  if (reminderDate <= now) {
    reminderDate.setDate(reminderDate.getDate() + 1);
  }

  return reminderDate;
}

/**
 * Check if we should send a reminder now
 * (Called periodically by app)
 */
export function shouldSendReminder(
  preferences: ReminderPreferences,
  studiedToday: boolean
): boolean {
  if (!preferences.enabled) {
    return false;
  }

  // Don't remind if already studied today
  if (studiedToday) {
    return false;
  }

  // Check if we already sent reminder today
  const lastChecked = preferences.lastChecked
    ? new Date(preferences.lastChecked)
    : null;

  const today = new Date().toDateString();
  if (lastChecked && lastChecked.toDateString() === today) {
    return false; // Already checked today
  }

  // Check if current time matches reminder time (within 1 hour window)
  const now = new Date();
  const [hours, minutes] = preferences.time.split(':').map(Number);
  const reminderTime = new Date();
  reminderTime.setHours(hours, minutes, 0, 0);

  const hourDiff = Math.abs(now.getTime() - reminderTime.getTime()) / (1000 * 60 * 60);

  return hourDiff < 1; // Within 1 hour of reminder time
}

/**
 * Mark that reminder check was performed today
 */
export function markReminderChecked(): void {
  const preferences = getReminderPreferences();
  preferences.lastChecked = new Date().toISOString();
  saveReminderPreferences(preferences);
}
