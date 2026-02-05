/**
 * SwipeRating - Rating buttons with swipe feedback
 */

import { RatingButtons } from './RatingButtons';
import type { Card } from '../../types';

interface SwipeRatingProps {
  card: Card;
  onRate: (rating: 0 | 2 | 4 | 5) => void;
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
        <div className="mb-4 text-center">
          <div className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300">
            {swipeDirection === 'left' ? '← Swipe left for "Again"' : 'Swipe right for "Good" →'}
          </div>
        </div>
      )}

      {/* Rating buttons */}
      <RatingButtons card={card} onRate={onRate} />
    </div>
  );
}
