/**
 * Custom hook for loading ALL cards from all decks
 * Used for Browse page to show complete card collection
 */

import { useState, useEffect, useCallback } from 'react';
import type { Card } from '../types';
import { repository } from '../data/hybrid-repository';

export function useAllCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load ALL cards from all decks
   */
  const loadAllCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all decks
      const allDecks = await repository.getDecks();

      // Get cards from all decks
      const allCardsPromises = allDecks.map((deck) => repository.getCards(deck.id));
      const cardsArrays = await Promise.all(allCardsPromises);

      // Flatten into single array
      const allCards = cardsArrays.flat();

      setCards(allCards);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load cards';
      setError(msg);
      console.error('Failed to load all cards:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadAllCards();
  }, [loadAllCards]);

  /**
   * Update a card
   */
  const updateCard = useCallback(
    async (cardId: string, updates: Partial<Card>) => {
      try {
        await repository.updateCard(cardId, updates);
        // Reload all cards to reflect changes
        await loadAllCards();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to update card';
        setError(msg);
        console.error('Failed to update card:', err);
        throw err;
      }
    },
    [loadAllCards]
  );

  /**
   * Delete a card
   */
  const deleteCard = useCallback(
    async (cardId: string) => {
      try {
        await repository.deleteCard(cardId);
        // Remove from local state
        setCards((prev) => prev.filter((card) => card.id !== cardId));
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to delete card';
        setError(msg);
        console.error('Failed to delete card:', err);
        throw err;
      }
    },
    []
  );

  return {
    cards,
    loading,
    error,
    updateCard,
    deleteCard,
    reload: loadAllCards,
  };
}
