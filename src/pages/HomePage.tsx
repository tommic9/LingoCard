/**
 * Home Page - Simple dashboard with study button and stats
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { repository } from '../data/local-repository';

interface Stats {
  totalCards: number;
  dueCards: number;
  newCards: number;
}

export function HomePage() {
  const [stats, setStats] = useState<Stats>({ totalCards: 0, dueCards: 0, newCards: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const allCards = await repository.getAllDueCards();
      const now = new Date();

      // Get all cards for total count
      const allDecks = await repository.getDecks();
      let totalCards = 0;
      for (const deck of allDecks) {
        const cards = await repository.getCards(deck.id);
        totalCards += cards.length;
      }

      const dueCards = allCards.filter(card => card.nextReviewDate <= now).length;
      const newCards = allCards.filter(card => card.repetitions === 0).length;

      setStats({ totalCards, dueCards, newCards });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          LingoCards
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Master your vocabulary with spaced repetition
        </p>
      </div>

      {/* Stats Cards */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stats.totalCards}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total Cards
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.dueCards}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Due Today
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.newCards}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              New Cards
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 max-w-md mx-auto">
        <Link
          to="/study"
          className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition font-semibold text-lg text-center shadow-lg"
        >
          {stats.dueCards > 0 ? `Study Now (${stats.dueCards} cards)` : 'Study Now'}
        </Link>
        <Link
          to="/add"
          className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-lg transition font-semibold text-center"
        >
          + Add Cards
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
        </div>
      )}
    </div>
  );
}
