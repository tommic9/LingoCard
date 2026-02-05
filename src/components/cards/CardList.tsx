/**
 * CardList - List of cards in a deck
 */

import type { Card } from '../../types';

interface CardListProps {
  cards: Card[];
  loading?: boolean;
}

export function CardList({ cards, loading = false }: CardListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading cards...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          No cards in this deck
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {cards.map((card) => (
        <div
          key={card.id}
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white">
                {card.front}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {card.back}
              </div>
              {card.example && (
                <div className="text-gray-500 dark:text-gray-500 text-xs mt-2 italic">
                  "{card.example}"
                </div>
              )}
            </div>

            {/* Card stats */}
            <div className="ml-4 flex flex-col items-end text-xs text-gray-500 dark:text-gray-500">
              <div>Rep: {card.repetitions}</div>
              <div>EF: {card.easeFactor.toFixed(1)}</div>
              {card.interval > 0 && (
                <div className="mt-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded">
                  {card.interval}d
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
