/**
 * Home Page - Dashboard with deck list and stats
 */

import { useEffect, useState } from 'react';
import type { DeckWithStats } from '../types';
import { repository } from '../data/local-repository';
import { DeckList } from '../components/decks/DeckList';

export function HomePage() {
  const [decks, setDecks] = useState<DeckWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      const allDecks = await repository.getDecks();

      // Load stats for each deck
      const decksWithStats = await Promise.all(
        allDecks.map(async (deck) => {
          const stats = await repository.getDeckStats(deck.id);
          return { ...deck, stats };
        })
      );

      setDecks(decksWithStats);
    } catch (error) {
      console.error('Failed to load decks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Decks
        </h1>
      </div>

      <DeckList decks={decks} loading={loading} />
    </div>
  );
}
