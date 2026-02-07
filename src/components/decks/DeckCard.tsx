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
      className="group block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 transform hover:scale-105"
    >
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {deck.name}
        </h2>
        {deck.isBuiltIn && (
          <span className="inline-block px-3 py-1 text-xs font-bold bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900 dark:to-primary-800 text-primary-700 dark:text-primary-300 rounded-full border border-primary-200 dark:border-primary-700">
            Built-in
          </span>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-5 leading-relaxed">
        {deck.description}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 pt-5 border-t-2 border-gray-100 dark:border-gray-700">
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/50 rounded-xl">
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
            {deck.stats.totalCards}
          </div>
          <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mt-1">Total</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/50 rounded-xl">
          <div className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">
            {deck.stats.dueCards}
          </div>
          <div className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide mt-1">Due</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/50 rounded-xl">
          <div className="text-2xl font-extrabold text-green-600 dark:text-green-400">
            {deck.stats.newCards}
          </div>
          <div className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide mt-1">New</div>
        </div>
      </div>
    </Link>
  );
}
