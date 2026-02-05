/**
 * Study Page - Flashcard study session
 */

import { Link } from 'react-router-dom';
import { useStudySession } from '../hooks/useStudySession';
import { StudySession } from '../components/study/StudySession';
import { StudyComplete } from '../components/study/StudyComplete';

export function StudyPage() {
  const {
    session,
    currentCard,
    isFlipped,
    loading,
    error,
    progress,
    isComplete,
    flipCard,
    rateCard,
    startSession,
  } = useStudySession();

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading study session...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-red-900 dark:text-red-200 mb-2">
            {error === 'No cards due for review' ? 'All Caught Up!' : 'Error'}
          </h2>
          <p className="text-red-700 dark:text-red-300 mb-4">
            {error === 'No cards due for review'
              ? "Great job! You don't have any cards due for review right now. Come back later!"
              : error}
          </p>
        </div>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // Session complete
  if (isComplete && progress && session) {
    return (
      <StudyComplete
        totalCards={progress.total}
        reviewedCards={progress.reviewed}
        startedAt={session.startedAt}
        onRestart={startSession}
      />
    );
  }

  // Active study session
  if (currentCard && progress) {
    return (
      <div className="py-6">
        <StudySession
          currentCard={currentCard}
          isFlipped={isFlipped}
          onFlip={flipCard}
          onRate={(rating: 0 | 2 | 4 | 5) => rateCard(rating)}
          progress={progress}
        />
      </div>
    );
  }

  // Fallback
  return null;
}
