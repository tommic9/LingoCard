/**
 * Study Complete component - shown when study session is finished
 */

import { Link } from 'react-router-dom';
import { useMemo } from 'react';

interface StudyCompleteProps {
  totalCards: number;
  reviewedCards: number;
  startedAt: Date;
  onRestart?: () => void;
  dailyGoal?: number;
  dailyProgress?: number;
  isGoalLimited?: boolean;
  remainingDueCards?: number;
  onLearnMore?: () => void;
}

export function StudyComplete({
  totalCards,
  reviewedCards,
  startedAt,
  onRestart,
  dailyGoal,
  dailyProgress,
  isGoalLimited,
  remainingDueCards,
  onLearnMore,
}: StudyCompleteProps) {
  // Calculate session duration
  const duration = useMemo(() => {
    const now = new Date();
    const diff = now.getTime() - startedAt.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { minutes, seconds };
  }, [startedAt]);

  // Check if daily goal is reached
  const goalReached =
    dailyGoal !== undefined &&
    dailyProgress !== undefined &&
    dailyProgress >= dailyGoal;

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 text-center border-2 border-gray-100 dark:border-gray-700">
        {/* Success icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 dark:from-green-500 dark:to-emerald-700 rounded-full flex items-center justify-center shadow-xl animate-bounce-slow">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 dark:from-green-400 dark:via-emerald-400 dark:to-green-500 bg-clip-text text-transparent mb-3">
          {isGoalLimited && goalReached ? 'Daily Goal Reached!' : 'Great Job!'}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
          You've completed your study session
        </p>

        {/* Daily goal progress (if applicable) */}
        {isGoalLimited && goalReached && dailyGoal && dailyProgress && (
          <div className="mb-8 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm">
            <div className="text-sm font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide mb-3">
              Daily Progress
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="flex-1 h-3 bg-green-200 dark:bg-green-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-full transition-all"
                  style={{ width: `${Math.min((dailyProgress / dailyGoal) * 100, 100)}%` }}
                />
              </div>
              <span className="text-lg font-bold text-green-700 dark:text-green-300">
                {dailyProgress}/{dailyGoal}
              </span>
            </div>
            {remainingDueCards !== undefined && remainingDueCards > 0 && (
              <p className="text-sm text-green-700 dark:text-green-400">
                {remainingDueCards} more cards available if you want to keep learning!
              </p>
            )}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-5 mb-10">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-2xl p-7 shadow-md">
            <div className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-3">
              {reviewedCards}
            </div>
            <div className="text-sm font-semibold text-blue-700 dark:text-blue-500 uppercase tracking-wide">
              Cards Reviewed
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-2xl p-7 shadow-md">
            <div className="text-5xl font-extrabold text-purple-600 dark:text-purple-400 mb-3">
              {duration.minutes}:{duration.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm font-semibold text-purple-700 dark:text-purple-500 uppercase tracking-wide">
              Time Spent
            </div>
          </div>
        </div>

        {/* Completion rate */}
        <div className="mb-10">
          <div className="text-base font-bold text-gray-700 dark:text-gray-300 mb-3">
            Completion Rate
          </div>
          <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 shadow-inner overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 via-emerald-600 to-green-600 dark:from-green-600 dark:via-emerald-700 dark:to-green-700 rounded-full transition-all duration-700 shadow-lg"
              style={{ width: `${(reviewedCards / totalCards) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse" />
            </div>
          </div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-3">
            {reviewedCards} of {totalCards} cards
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {onLearnMore && (
            <button
              onClick={onLearnMore}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-green-600 dark:to-emerald-700 dark:hover:from-green-500 dark:hover:to-emerald-600 text-white rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              Learn More
            </button>
          )}

          {onRestart && (
            <button
              onClick={onRestart}
              className="px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              Study Again
            </button>
          )}

          <Link
            to="/"
            className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-700 dark:to-primary-800 dark:hover:from-primary-600 dark:hover:to-primary-700 text-white rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
          >
            Back to Home
          </Link>
        </div>

        {/* Motivational message */}
        <div className="mt-8 p-5 bg-gradient-to-r from-primary-50 via-primary-100/50 to-primary-50 dark:from-primary-950/30 dark:via-primary-900/20 dark:to-primary-950/30 rounded-2xl border border-primary-200 dark:border-primary-800 shadow-sm">
          <p className="text-base font-medium text-primary-800 dark:text-primary-200 leading-relaxed">
            Keep up the great work! Consistent practice is the key to mastering a language.
          </p>
        </div>
      </div>
    </div>
  );
}
