/**
 * Deck Page - View deck details and card list
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Deck, Card } from '../types';
import { repository } from '../data/local-repository';
import { CardList } from '../components/cards/CardList';

export function DeckPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (deckId) {
      loadDeck(deckId);
    }
  }, [deckId]);

  const loadDeck = async (id: string) => {
    try {
      const deckData = await repository.getDeck(id);
      const cardsData = await repository.getCards(id);
      setDeck(deckData || null);
      setCards(cardsData);
    } catch (error) {
      console.error('Failed to load deck:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Deck not found</p>
        <Link
          to="/"
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          Go back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {deck.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {deck.description}
          </p>
        </div>
        <Link
          to={`/study/${deck.id}`}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          Study Now
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Cards ({cards.length})
        </h2>

        <CardList cards={cards} loading={loading} />
      </div>
    </div>
  );
}
