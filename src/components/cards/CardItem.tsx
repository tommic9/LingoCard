/**
 * CardItem - Single card display in card browser
 * Shows front, back, example, next review date
 * Actions: Edit, Delete
 */

import type { Card } from '../../types';
import { formatShortDate } from '../../utils/date';

interface CardItemProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (cardId: string) => void;
}

export function CardItem({ card, onEdit, onDelete }: CardItemProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Card content */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Front (English) */}
          <div>
            <span className="inline-block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              EN
            </span>
            <div className="text-base font-semibold text-gray-900 dark:text-white break-words">
              {card.front}
            </div>
          </div>

          {/* Back (Polish) */}
          <div>
            <span className="inline-block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              PL
            </span>
            <div className="text-base text-gray-700 dark:text-gray-300 break-words">
              {card.back}
            </div>
          </div>

          {/* Example if present */}
          {card.example && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">
                Example
              </span>
              <div className="text-sm text-gray-600 dark:text-gray-400 italic break-words">
                "{card.example}"
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div>
              <span className="font-medium">Reviews:</span> {card.repetitions}
            </div>
            <div>
              <span className="font-medium">Ease Factor:</span> {card.easeFactor.toFixed(2)}
            </div>
            <div>
              <span className="font-medium">Next Review:</span> {formatShortDate(card.nextReviewDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onEdit(card)}
          className="flex-1 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(card.id)}
          className="px-3 py-2 border border-red-500 text-red-600 dark:text-red-400 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium rounded-md transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
