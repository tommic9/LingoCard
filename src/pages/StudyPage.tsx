/**
 * Study Page - Flashcard study session
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudySession } from '../hooks/useStudySession';
import { useDailyGoal } from '../hooks/useDailyGoal';
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
    isGoalLimited,
    totalDueCount,
    flipCard,
    rateCard,
    startSession,
  } = useStudySession();

  const dailyGoal = useDailyGoal();
  const [showGoalMetScreen, setShowGoalMetScreen] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Start session after daily goal is loaded
  useEffect(() => {
    if (!dailyGoal.loading && !sessionStarted) {
      setSessionStarted(true);

      if (dailyGoal.goalMet && dailyGoal.remaining === 0) {
        // Goal already met, show "goal met" screen
        setShowGoalMetScreen(true);
      } else {
        // Start session with remaining cards as limit
        startSession({ maxCards: dailyGoal.remaining });
      }
    }
  }, [dailyGoal.loading, sessionStarted, dailyGoal.goalMet, dailyGoal.remaining, startSession]);

  const handleLearnMore = () => {
    setShowGoalMetScreen(false);
    startSession({ unlimited: true });
  };

  const handleRestart = async () => {
    await dailyGoal.refreshProgress();
    startSession({ unlimited: true });
  };

  // Goal met screen
  if (showGoalMetScreen) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 mb-6">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-200 mb-2">
            Daily Goal Reached!
          </h2>
          <p className="text-green-700 dark:text-green-300 mb-4">
            You've completed {dailyGoal.goal} cards today. Great job!
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-2 bg-green-200 dark:bg-green-800 rounded-full w-48">
              <div
                className="h-2 bg-green-500 dark:bg-green-400 rounded-full transition-all"
                style={{ width: '100%' }}
              />
            </div>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              {dailyGoal.todayReviewed}/{dailyGoal.goal}
            </span>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Back to Home
          </Link>
          <button
            onClick={handleLearnMore}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Learn More Anyway
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading || dailyGoal.loading) {
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
        onRestart={handleRestart}
        dailyGoal={dailyGoal.goal}
        dailyProgress={dailyGoal.todayReviewed}
        isGoalLimited={isGoalLimited}
        remainingDueCards={totalDueCount - progress.total}
        onLearnMore={
          isGoalLimited && dailyGoal.goalMet && totalDueCount > progress.total
            ? handleLearnMore
            : undefined
        }
      />
    );
  }

  // Active study session
  if (currentCard && progress) {
    return (
      <div className="py-4 md:py-6">
        <StudySession
          currentCard={currentCard}
          isFlipped={isFlipped}
          onFlip={flipCard}
          onRate={(rating: 0 | 4) => rateCard(rating)}
          progress={progress}
        />
      </div>
    );
  }

  // Fallback
  return null;
}
