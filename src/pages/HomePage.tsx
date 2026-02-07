/**
 * Home Page - Simple dashboard with study button and stats
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStatistics } from '../hooks/useStatistics';
import { DailyStreakBar } from '../components/home/DailyStreakBar';

export function HomePage() {
  const { statistics, loading } = useStatistics();
  const [showDetailedStats, setShowDetailedStats] = useState(false);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center pt-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 dark:from-primary-400 dark:via-primary-500 dark:to-primary-600 bg-clip-text text-transparent mb-3">
          LingoCards
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Master your vocabulary with spaced repetition
        </p>
      </div>

      {/* Daily Streak Bar */}
      <div className="max-w-2xl mx-auto px-2">
        <DailyStreakBar />
      </div>

      {/* Stats Cards */}
      {!loading && statistics && (
        <div className="grid grid-cols-3 gap-3 md:gap-5 max-w-2xl mx-auto px-2">
          {/* Total Cards - Blue gradient */}
          <div className="group relative bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-5 md:p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fadeIn">
                {statistics.totalCards}
              </div>
              <div className="text-xs md:text-sm text-blue-50 font-medium uppercase tracking-wide">
                Total Cards
              </div>
            </div>
          </div>

          {/* Due Cards - Orange gradient */}
          <div className="group relative bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-5 md:p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fadeIn">
                {statistics.cardsRemainingToday}
              </div>
              <div className="text-xs md:text-sm text-orange-50 font-medium uppercase tracking-wide">
                Due Today
              </div>
            </div>
          </div>

          {/* New Cards - Green gradient */}
          <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-5 md:p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fadeIn">
                {statistics.newCards}
              </div>
              <div className="text-xs md:text-sm text-green-50 font-medium uppercase tracking-wide">
                New Cards
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 max-w-md mx-auto px-4">
        <Link
          to="/study"
          className="group relative px-8 py-5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-700 dark:to-primary-800 dark:hover:from-primary-600 dark:hover:to-primary-700 text-white rounded-xl transition-all duration-300 font-bold text-lg text-center shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <span className="relative">
            {statistics && statistics.cardsRemainingToday > 0
              ? `Study Now (${statistics.cardsRemainingToday} cards)`
              : 'Study Now'}
          </span>
        </Link>
        <Link
          to="/add"
          className="group relative px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 rounded-xl transition-all duration-300 font-semibold text-center shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
        >
          <span className="text-primary-600 dark:text-primary-400 mr-2 text-xl font-bold">+</span>
          Add Cards
        </Link>
      </div>

      {/* Detailed Statistics (collapsible) */}
      {!loading && statistics && (
        <div className="max-w-2xl mx-auto px-2 space-y-4">
          <button
            onClick={() => setShowDetailedStats(!showDetailedStats)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition text-gray-900 dark:text-white"
          >
            <span className="font-semibold text-sm">Detailed Statistics</span>
            <svg
              className={`w-5 h-5 transition-transform ${showDetailedStats ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDetailedStats && (
            <div className="space-y-4">
              {/* Today's Progress */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                  Today's Progress
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/50 rounded-xl">
                    <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                      {statistics.reviewedToday}
                    </div>
                    <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase">
                      Reviewed
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/50 rounded-xl">
                    <div className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">
                      {statistics.cardsRemainingToday}
                    </div>
                    <div className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase">
                      Remaining
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/50 rounded-xl">
                    <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
                      {statistics.estimatedTimeRemaining}m
                    </div>
                    <div className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase">
                      Time Left
                    </div>
                  </div>
                </div>
              </div>

              {/* Cards by Status */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                  Cards by Status
                </h3>
                <div className="space-y-3">
                  <HomeStatusBar label="New" count={statistics.newCards} total={statistics.totalCards} color="blue" />
                  <HomeStatusBar label="Learning" count={statistics.learningCards} total={statistics.totalCards} color="orange" />
                  <HomeStatusBar label="Mature" count={statistics.matureCards} total={statistics.totalCards} color="green" />
                </div>
              </div>

              {/* Streaks */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                  Study Streaks
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 rounded-xl">
                    <div className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">
                      {statistics.currentStreak}
                    </div>
                    <div className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase">
                      Current Streak
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/50 rounded-xl">
                    <div className="text-2xl font-extrabold text-yellow-600 dark:text-yellow-400">
                      {statistics.longestStreak}
                    </div>
                    <div className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 uppercase">
                      Longest Streak
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick stats row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
                  <div className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">
                    {statistics.recentAccuracy}%
                  </div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Recent Accuracy
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
                  <div className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">
                    {statistics.reviewedThisWeek}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    This Week
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-14 w-14 border-4 border-primary-400 dark:border-primary-600 opacity-20"></div>
          </div>
        </div>
      )}
    </div>
  );
}

function HomeStatusBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: 'blue' | 'orange' | 'green';
}) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  const colorClasses = {
    blue: 'bg-blue-500 dark:bg-blue-600',
    orange: 'bg-orange-500 dark:bg-orange-600',
    green: 'bg-green-500 dark:bg-green-600',
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {count} ({percentage}%)
        </span>
      </div>
      <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 ${colorClasses[color]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
