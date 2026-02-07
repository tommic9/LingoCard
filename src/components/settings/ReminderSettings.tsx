/**
 * Reminder Settings Component
 */

import { useState, useEffect } from 'react';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendStudyReminder,
} from '../../utils/notifications';
import {
  getReminderPreferences,
  saveReminderPreferences,
  type ReminderPreferences,
} from '../../utils/reminders';

export function ReminderSettings() {
  const [preferences, setPreferences] = useState<ReminderPreferences>(
    getReminderPreferences()
  );
  const [notificationPermission, setNotificationPermission] = useState(
    getNotificationPermission()
  );
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    setPreferences(getReminderPreferences());
  }, []);

  const handleEnabledChange = async (enabled: boolean) => {
    if (enabled && notificationPermission !== 'granted') {
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission);

      if (permission !== 'granted') {
        setTestMessage('Please allow notifications in your browser settings.');
        return;
      }
    }

    const newPreferences: ReminderPreferences = {
      ...preferences,
      enabled,
    };

    setPreferences(newPreferences);
    saveReminderPreferences(newPreferences);

    if (enabled) {
      setTestMessage('Daily reminders enabled! You\'ll be notified at ' + preferences.time);
    } else {
      setTestMessage('Daily reminders disabled.');
    }

    setTimeout(() => setTestMessage(''), 3000);
  };

  const handleTimeChange = (time: string) => {
    const newPreferences: ReminderPreferences = {
      ...preferences,
      time,
    };

    setPreferences(newPreferences);
    saveReminderPreferences(newPreferences);
    setTestMessage('Reminder time updated to ' + time);
    setTimeout(() => setTestMessage(''), 3000);
  };

  const handleTestNotification = () => {
    if (notificationPermission !== 'granted') {
      setTestMessage('Please enable notifications first.');
      setTimeout(() => setTestMessage(''), 3000);
      return;
    }

    sendStudyReminder();
    setTestMessage('Test notification sent!');
    setTimeout(() => setTestMessage(''), 3000);
  };

  if (!isNotificationSupported()) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          Your browser does not support notifications. Please use a modern browser (Chrome,
          Firefox, Edge, Safari) to enable study reminders.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Daily Reminders
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get notified to study at your preferred time
          </p>
        </div>
        <button
          onClick={() => handleEnabledChange(!preferences.enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            preferences.enabled
              ? 'bg-primary-600 dark:bg-primary-500'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              preferences.enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Time Picker */}
      {preferences.enabled && (
        <div>
          <label
            htmlFor="reminder-time"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Reminder Time
          </label>
          <input
            id="reminder-time"
            type="time"
            value={preferences.time}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      )}

      {/* Permission Status */}
      {notificationPermission !== 'granted' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
            Notifications are currently <strong>{notificationPermission}</strong>.
            {notificationPermission === 'denied' &&
              ' Please enable notifications in your browser settings.'}
          </p>
          {notificationPermission === 'default' && (
            <button
              onClick={async () => {
                const permission = await requestNotificationPermission();
                setNotificationPermission(permission);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              Allow Notifications
            </button>
          )}
        </div>
      )}

      {/* Test Notification Button */}
      {preferences.enabled && notificationPermission === 'granted' && (
        <button
          onClick={handleTestNotification}
          className="w-full px-4 py-2 border-2 border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition font-semibold"
        >
          Send Test Notification
        </button>
      )}

      {/* Status Message */}
      {testMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-sm text-green-700 dark:text-green-300">{testMessage}</p>
        </div>
      )}

      {/* Info */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          How it works
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
          <li>You'll receive a notification at your chosen time each day</li>
          <li>No notification if you've already studied that day</li>
          <li>Click the notification to start studying</li>
          <li>Works even when the app is closed (if browser supports it)</li>
        </ul>
      </div>
    </div>
  );
}
