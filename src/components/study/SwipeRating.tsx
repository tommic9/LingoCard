/**
 * SwipeRating - Rating buttons with swipe feedback
 * Updated for 2-button system: left swipe = Don't Know, right swipe = Know
 */

import { RatingButtons } from './RatingButtons';
import type { Card } from '../../types';

interface SwipeRatingProps {
  card: Card;
  onRate: (rating: 0 | 4) => void;
  swipeDirection?: 'left' | 'right' | null;
  swipeProgress?: number;
}

export function SwipeRating({
  card,
  onRate,
  swipeDirection,
  swipeProgress = 0,
}: SwipeRatingProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Swipe hint */}
      {swipeProgress > 0 && swipeDirection && (
        <div className="mb-5 text-center animate-fadeIn">
          <div className={`inline-block px-5 py-2.5 backdrop-blur-md rounded-full text-sm font-semibold shadow-lg border ${
            swipeDirection === 'left'
              ? 'bg-red-100/80 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700'
              : 'bg-green-100/80 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700'
          }`}>
            {swipeDirection === 'left' ? "← Swipe left for \"Don't Know\"" : 'Swipe right for "Know" →'}
          </div>
        </div>
      )}

      {/* Rating buttons */}
      <RatingButtons card={card} onRate={onRate} />
    </div>
  );
}
