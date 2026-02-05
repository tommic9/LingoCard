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
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center pt-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 dark:from-primary-400 dark:via-primary-500 dark:to-primary-600 bg-clip-text text-transparent mb-3">
          LingoCards
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Master your vocabulary with spaced repetition
        </p>
      </div>

      {/* Stats Cards */}
      {!loading && (
        <div className="grid grid-cols-3 gap-3 md:gap-5 max-w-2xl mx-auto px-2">
          {/* Total Cards - Blue gradient */}
          <div className="group relative bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-5 md:p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fadeIn">
                {stats.totalCards}
              </div>
              <div className="text-xs md:text-sm text-blue-50 font-medium uppercase tracking-wide">
                Total Cards
              </div>
            </div>
          </div>

          {/* Due Cards - Orange gradient */}
          <div className="group relative bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-5 md:p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fadeIn">
                {stats.dueCards}
              </div>
              <div className="text-xs md:text-sm text-orange-50 font-medium uppercase tracking-wide">
                Due Today
              </div>
            </div>
          </div>

          {/* New Cards - Green gradient */}
          <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-5 md:p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fadeIn">
                {stats.newCards}
              </div>
              <div className="text-xs md:text-sm text-green-50 font-medium uppercase tracking-wide">
                New Cards
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 max-w-md mx-auto px-4">
        <Link
          to="/study"
          className="group relative px-8 py-5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-700 dark:to-primary-800 dark:hover:from-primary-600 dark:hover:to-primary-700 text-white rounded-xl transition-all duration-300 font-bold text-lg text-center shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <span className="relative">
            {stats.dueCards > 0 ? `Study Now (${stats.dueCards} cards)` : 'Study Now'}
          </span>
        </Link>
        <Link
          to="/add"
          className="group relative px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 rounded-xl transition-all duration-300 font-semibold text-center shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
        >
          <span className="text-primary-600 dark:text-primary-400 mr-2 text-xl font-bold">+</span>
          Add Cards
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-14 w-14 border-4 border-primary-400 dark:border-primary-600 opacity-20"></div>
          </div>
        </div>
      )}
    </div>
  );
}
