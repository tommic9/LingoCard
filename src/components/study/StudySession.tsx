/**
 * Study Session component - main study interface
 */

import { Flashcard } from '../cards/Flashcard';
import { RatingButtons } from './RatingButtons';
import type { Card } from '../../types';

interface StudySessionProps {
  currentCard: Card;
  isFlipped: boolean;
  onFlip: () => void;
  onRate: (rating: 0 | 2 | 4 | 5) => void;
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
  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {progress.current} / {progress.total}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-500">
          <span>Reviewed: {progress.reviewed}</span>
          <span>Remaining: {progress.remaining}</span>
        </div>
      </div>

      {/* Flashcard */}
      <Flashcard
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={onFlip}
      />

      {/* Rating buttons - only show when card is flipped */}
      {isFlipped && (
        <div className="animate-fadeIn">
          <RatingButtons
            card={currentCard}
            onRate={onRate}
          />
        </div>
      )}

      {/* Instructions when card is not flipped */}
      {!isFlipped && (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Think of the answer, then tap the card to reveal
          </p>
        </div>
      )}
    </div>
  );
}
