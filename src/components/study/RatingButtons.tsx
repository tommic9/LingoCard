/**
 * Rating buttons for SM-2 algorithm (Again, Hard, Good, Easy)
 */

import { previewIntervals, formatInterval } from '../../algorithms/sm2';
import type { Card } from '../../types';

interface RatingButtonsProps {
  card: Card;
  onRate: (rating: 0 | 2 | 4 | 5) => void;
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
      label: 'Again',
      rating: 0 as const,
      color: 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700',
      interval: intervals.again,
      description: 'Incorrect',
    },
    {
      label: 'Hard',
      rating: 2 as const,
      color: 'bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700',
      interval: intervals.hard,
      description: 'Difficult',
    },
    {
      label: 'Good',
      rating: 4 as const,
      color: 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700',
      interval: intervals.good,
      description: 'Correct',
    },
    {
      label: 'Easy',
      rating: 5 as const,
      color: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
      interval: intervals.easy,
      description: 'Perfect',
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          How well did you know this?
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {buttons.map((button) => (
          <button
            key={button.label}
            onClick={() => onRate(button.rating)}
            disabled={disabled}
            className={`${button.color} text-white px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex flex-col items-center justify-center`}
          >
            <span className="text-lg mb-1">{button.label}</span>
            <span className="text-xs opacity-90">{button.description}</span>
            <span className="text-xs opacity-75 mt-1">
              {formatInterval(button.interval)}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-500">
          The interval shown is when you'll see this card next
        </p>
      </div>
    </div>
  );
}
