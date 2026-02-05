/**
 * Study Complete component - shown when study session is finished
 */

import { Link } from 'react-router-dom';
import { useMemo } from 'react';

interface StudyCompleteProps {
  deckId: string;
  totalCards: number;
  reviewedCards: number;
  startedAt: Date;
  onRestart?: () => void;
}

export function StudyComplete({
  deckId,
  totalCards,
  reviewedCards,
  startedAt,
  onRestart,
}: StudyCompleteProps) {
  // Calculate session duration
  const duration = useMemo(() => {
    const now = new Date();
    const diff = now.getTime() - startedAt.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { minutes, seconds };
  }, [startedAt]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 text-center">
        {/* Success icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Great Job!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You've completed your study session
        </p>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {reviewedCards}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Cards Reviewed
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {duration.minutes}:{duration.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Time Spent
            </div>
          </div>
        </div>

        {/* Completion rate */}
        <div className="mb-8">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Completion Rate
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(reviewedCards / totalCards) * 100}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {reviewedCards} of {totalCards} cards
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={`/deck/${deckId}`}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Back to Deck
          </Link>

          {onRestart && (
            <button
              onClick={onRestart}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Study Again
            </button>
          )}

          <Link
            to="/"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Home
          </Link>
        </div>

        {/* Motivational message */}
        <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <p className="text-sm text-primary-800 dark:text-primary-200">
            Keep up the great work! Consistent practice is the key to mastering a language.
          </p>
        </div>
      </div>
    </div>
  );
}
