/**
 * DeckCard - Individual deck card component
 */

import { Link } from 'react-router-dom';
import type { DeckWithStats } from '../../types';

interface DeckCardProps {
  deck: DeckWithStats;
}

export function DeckCard({ deck }: DeckCardProps) {
  return (
    <Link
      to={`/deck/${deck.id}`}
      className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {deck.name}
        </h2>
        {deck.isBuiltIn && (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded">
            Built-in
          </span>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        {deck.description}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {deck.stats.totalCards}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {deck.stats.dueCards}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">Due</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {deck.stats.newCards}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">New</div>
        </div>
      </div>
    </Link>
  );
}
