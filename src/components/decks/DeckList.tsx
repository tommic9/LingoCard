/**
 * DeckList - List of decks with stats
 */

import { DeckCard } from './DeckCard';
import type { DeckWithStats } from '../../types';

interface DeckListProps {
  decks: DeckWithStats[];
  loading?: boolean;
}

export function DeckList({ decks, loading = false }: DeckListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading decks...</p>
        </div>
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No decks available. The app will load built-in decks on first use.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {decks.map((deck) => (
        <DeckCard key={deck.id} deck={deck} />
      ))}
    </div>
  );
}
