/**
 * Statistics Page - Comprehensive study statistics and progress tracking
 */

import { useStatistics } from '../hooks/useStatistics';

export function StatisticsPage() {
  const { statistics, loading, error } = useStatistics();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Statistics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your study progress...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300">
            {error || 'Failed to load statistics'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Statistics & Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cards */}
        <StatCard
          title="Total Cards"
          value={statistics.totalCards}
          icon="📚"
          color="blue"
        />

        {/* Total Reviews */}
        <StatCard
          title="Total Reviews"
          value={statistics.totalReviews}
          icon="✓"
          color="green"
        />

        {/* Current Streak */}
        <StatCard
          title="Current Streak"
          value={statistics.currentStreak}
          suffix=" days"
          icon="🔥"
          color="orange"
        />

        {/* Accuracy */}
        <StatCard
          title="Recent Accuracy"
          value={statistics.recentAccuracy}
          suffix="%"
          icon="🎯"
          color="purple"
        />
      </div>

      {/* Today's Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Today's Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/50 rounded-xl">
            <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">
              {statistics.reviewedToday}
            </div>
            <div className="text-sm font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
              Reviewed Today
            </div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/50 rounded-xl">
            <div className="text-3xl font-extrabold text-orange-600 dark:text-orange-400 mb-2">
              {statistics.cardsRemainingToday}
            </div>
            <div className="text-sm font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide">
              Cards Remaining
            </div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/50 rounded-xl">
            <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mb-2">
              {statistics.estimatedTimeRemaining} min
            </div>
            <div className="text-sm font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
              Time Remaining
            </div>
          </div>
        </div>
      </div>

      {/* Cards by Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Cards by Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusCard
            label="New"
            count={statistics.newCards}
            total={statistics.totalCards}
            color="blue"
          />
          <StatusCard
            label="Learning"
            count={statistics.learningCards}
            total={statistics.totalCards}
            color="orange"
          />
          <StatusCard
            label="Mature"
            count={statistics.matureCards}
            total={statistics.totalCards}
            color="green"
          />
        </div>
      </div>

      {/* Study Streaks */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Study Streaks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 rounded-2xl border-2 border-orange-300 dark:border-orange-700">
            <div className="text-6xl mb-3">🔥</div>
            <div className="text-4xl font-extrabold text-orange-600 dark:text-orange-400 mb-2">
              {statistics.currentStreak}
            </div>
            <div className="text-sm font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide">
              Current Streak (Days)
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/50 rounded-2xl border-2 border-yellow-300 dark:border-yellow-700">
            <div className="text-6xl mb-3">🏆</div>
            <div className="text-4xl font-extrabold text-yellow-600 dark:text-yellow-400 mb-2">
              {statistics.longestStreak}
            </div>
            <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 uppercase tracking-wide">
              Longest Streak (Days)
            </div>
          </div>
        </div>
      </div>

      {/* This Week Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          This Week
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📅</div>
            <div>
              <div className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">
                {statistics.reviewedThisWeek}
              </div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Cards Reviewed
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-4xl">📊</div>
            <div>
              <div className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">
                {statistics.totalDecks}
              </div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Active Decks
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

function StatCard({ title, value, suffix = '', icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/50 text-blue-600 dark:text-blue-400',
    green:
      'from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/50 text-green-600 dark:text-green-400',
    orange:
      'from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/50 text-orange-600 dark:text-orange-400',
    purple:
      'from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/50 text-purple-600 dark:text-purple-400',
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg shadow p-6 transform hover:scale-105 transition-transform`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">
          {title}
        </h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-4xl font-extrabold">
        {value}
        {suffix && <span className="text-2xl ml-1">{suffix}</span>}
      </div>
    </div>
  );
}

// Status Card Component
interface StatusCardProps {
  label: string;
  count: number;
  total: number;
  color: 'blue' | 'orange' | 'green';
}

function StatusCard({ label, count, total, color }: StatusCardProps) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  const colorClasses = {
    blue: 'bg-blue-500 dark:bg-blue-600',
    orange: 'bg-orange-500 dark:bg-orange-600',
    green: 'bg-green-500 dark:bg-green-600',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {count} ({percentage}%)
        </span>
      </div>
      <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 ${colorClasses[color]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
