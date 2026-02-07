/**
 * Study Session component - main study interface
 */

import { useState } from 'react';
import { Flashcard } from '../cards/Flashcard';
import { SwipeableCard } from '../cards/SwipeableCard';
import { SwipeRating } from './SwipeRating';
import type { Card } from '../../types';

interface StudySessionProps {
  currentCard: Card;
  isFlipped: boolean;
  onFlip: () => void;
  onRate: (rating: 0 | 4) => void;
  progress: {
    current: number;
    total: number;
    reviewed: number;
    remaining: number;
    percentage: number;
  };
}

export function StudySession({
  currentCard,
  isFlipped,
  onFlip,
  onRate,
  progress,
}: StudySessionProps) {
  // State for swipe feedback
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Progress bar */}
      <div className="w-full max-w-2xl mx-auto px-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm md:text-base font-bold text-gray-800 dark:text-gray-200">
            Progress
          </span>
          <span className="text-sm md:text-base font-bold text-primary-600 dark:text-primary-400">
            {progress.current} / {progress.total}
          </span>
        </div>
        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 md:h-4 shadow-inner overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 dark:from-primary-600 dark:via-primary-700 dark:to-primary-800 rounded-full transition-all duration-500 ease-out shadow-lg"
            style={{ width: `${progress.percentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse" />
          </div>
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10 dark:ring-white/10" />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs md:text-sm font-medium">
          <span className="text-green-600 dark:text-green-400">
            Reviewed: {progress.reviewed}
          </span>
          <span className="text-orange-600 dark:text-orange-400">
            Remaining: {progress.remaining}
          </span>
        </div>
      </div>

      {/* Flashcard wrapped with SwipeableCard */}
      <SwipeableCard
        key={currentCard.id}
        onSwipeLeft={() => onRate(0)}
        onSwipeRight={() => onRate(4)}
        disabled={!isFlipped}
        onSwipeProgress={(direction, progress) => {
          setSwipeDirection(direction);
          setSwipeProgress(progress);
        }}
      >
        <Flashcard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={onFlip}
        />
      </SwipeableCard>

      {/* Rating system - only show when card is flipped */}
      {isFlipped && (
        <div className="animate-fadeIn">
          <SwipeRating
            card={currentCard}
            onRate={onRate}
            swipeDirection={swipeDirection}
            swipeProgress={swipeProgress}
          />
        </div>
      )}

      {/* Instructions when card is not flipped */}
      {!isFlipped && (
        <div className="text-center animate-fadeIn pb-safe">
          <div className="inline-block bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 px-4 py-2 md:px-6 md:py-3 rounded-full shadow-md">
            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base font-medium">
              Think of the answer, then tap the card to reveal
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
