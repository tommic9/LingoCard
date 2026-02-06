/**
 * Settings Page - App settings and data management (placeholder)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { repository } from '../data/hybrid-repository';
import { seedDatabase } from '../data/seed-data';
import { ThemeToggle } from '../components/settings/ThemeToggle';
import { DailyGoalSettings } from '../components/settings/DailyGoalSettings';
import { useAuth } from '../contexts/AuthContext';

export function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      setMessage('Signed out successfully!');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Failed to sign out:', error);
      setMessage('Error signing out. Please try again.');
    }
  };

  const handleLoadSeedData = async () => {
    if (
      !confirm(
        'This will clear all existing data and load built-in flash cards. Continue?'
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await repository.clearAllData();
      await seedDatabase();
      setMessage('Built-in flash cards loaded successfully!');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      console.error('Failed to load seed data:', error);
      setMessage('Error loading data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await repository.exportData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lingocards-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('Data exported successfully!');
    } catch (error) {
      console.error('Failed to export data:', error);
      setMessage('Error exporting data. Please try again.');
    }
  };

  const handleClearData = async () => {
    if (
      !confirm(
        'This will permanently delete all your flash cards. This action cannot be undone. Continue?'
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await repository.clearAllData();
      setMessage('All flash cards cleared successfully!');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      console.error('Failed to clear data:', error);
      setMessage('Error clearing data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your app settings and data
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes('Error')
              ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
          }`}
        >
          {message}
        </div>
      )}

      {/* Account & Sync section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Account & Sync
        </h2>
        {user ? (
          <>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Signed in as: <span className="font-medium">{user.email}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Sign Out
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Your data is automatically synced to the cloud
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Sign in to sync your cards across devices
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Sign In
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Currently using offline mode (local storage only)
            </p>
          </>
        )}
      </div>

      {/* Theme section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Appearance
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Choose your preferred theme or match your system settings
        </p>
        <ThemeToggle />
      </div>

      {/* Daily Goal section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Daily Goal
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Set how many cards you want to review each day
        </p>
        <DailyGoalSettings />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Built-in Flash Cards
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Load pre-made English-Polish flash cards (150 cards in 3 decks)
          </p>
          <button
            onClick={handleLoadSeedData}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load Built-in Flash Cards'}
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Export Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Download all your decks and cards as JSON
          </p>
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition"
          >
            Export Data
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Clear All Flash Cards
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Permanently delete all flash cards and progress
          </p>
          <button
            onClick={handleClearData}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Clearing...' : 'Clear All Flash Cards'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Coming in Future Phases:
        </h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li>- Language preferences</li>
          <li>- Study reminders</li>
          <li>- Statistics and progress tracking</li>
          <li>- Import data from JSON/CSV</li>
        </ul>
      </div>
    </div>
  );
}
