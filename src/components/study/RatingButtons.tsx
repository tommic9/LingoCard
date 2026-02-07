/**
 * Rating buttons for simplified 2-button system (Don't Know / Know)
 * Maps to SM-2 ratings: 0 (Don't Know) and 4 (Know)
 */

import { previewIntervals, formatInterval } from '../../algorithms/sm2';
import type { Card } from '../../types';

interface RatingButtonsProps {
  card: Card;
  onRate: (rating: 0 | 4) => void;
  disabled?: boolean;
}

export function RatingButtons({ card, onRate, disabled = false }: RatingButtonsProps) {
  // Preview what the next interval will be for each rating
  const intervals = previewIntervals({
    easeFactor: card.easeFactor,
    interval: card.interval,
    repetitions: card.repetitions,
  });

  const buttons = [
    {
      label: "❌ Don't Know",
      rating: 0 as const,
      color: 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700',
      interval: intervals.again, // Always 1 day for rating 0
    },
    {
      label: '✓ Know',
      rating: 4 as const,
      color: 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700',
      interval: intervals.good,
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-3 md:mb-4 text-center">
        <p className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
          Did you know the answer?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 px-2">
        {buttons.map((button) => (
          <button
            key={button.rating}
            onClick={() => onRate(button.rating)}
            disabled={disabled}
            className={`group relative ${button.color} text-white px-4 py-3.5 md:px-6 md:py-5 rounded-xl md:rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex flex-col items-center justify-center gap-1.5 md:gap-2 overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative text-base md:text-xl">{button.label}</span>
            <span className="relative text-xs md:text-sm opacity-90 font-medium bg-white/20 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full">
              {formatInterval(button.interval)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
