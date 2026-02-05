/**
 * Custom hook for managing user cards
 * Handles CRUD operations, user deck management, and duplicate checking
 */

import { useState, useEffect, useCallback } from 'react';
import type { Card, Deck } from '../types';
import { repository } from '../data/local-repository';
import { USER_DECK_CONFIG } from '../constants/user-deck';
import { checkDuplicate, checkDuplicates } from '../utils/duplicate-detector';

export function useCardManagement() {
  const [cards, setCards] = useState<Card[]>([]);
  const [userDeck, setUserDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Ensure user deck exists, create if needed
   */
  const ensureUserDeck = useCallback(async (): Promise<Deck> => {
    try {
      let deck = await repository.getDeck(USER_DECK_CONFIG.id);

      if (!deck) {
        deck = await repository.createDeck({
          name: USER_DECK_CONFIG.name,
          description: USER_DECK_CONFIG.description,
          isBuiltIn: USER_DECK_CONFIG.isBuiltIn,
        });
      }

      setUserDeck(deck);
      return deck;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to setup user deck';
      setError(msg);
      throw err;
    }
  }, []);

  /**
   * Load user deck and cards
   */
  const loadUserCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const deck = await ensureUserDeck();
      const userCards = await repository.getCards(deck.id);
      setCards(userCards);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load cards';
      setError(msg);
      console.error('Failed to load user cards:', err);
    } finally {
      setLoading(false);
    }
  }, [ensureUserDeck]);

  // Load on mount
  useEffect(() => {
    loadUserCards();
  }, [loadUserCards]);

  /**
   * Create a single card
   */
  const createCard = useCallback(
    async (cardData: Omit<Card, 'id' | 'deckId' | 'createdAt' | 'updatedAt'>) => {
      try {
        const deck = await ensureUserDeck();

        const newCard: Omit<Card, 'id' | 'createdAt' | 'updatedAt'> = {
          ...cardData,
          deckId: deck.id,
        };

        const created = await repository.createCard(newCard);
        setCards((prev) => [...prev, created]);
        return created;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to create card';
        setError(msg);
        console.error('Failed to create card:', err);
        throw err;
      }
    },
    [ensureUserDeck]
  );

  /**
   * Create multiple cards (bulk insert for CSV)
   */
  const createCards = useCallback(
    async (cardsData: Omit<Card, 'id' | 'deckId' | 'createdAt' | 'updatedAt'>[]) => {
      try {
        const deck = await ensureUserDeck();

        const newCards = cardsData.map((card) => ({
          ...card,
          deckId: deck.id,
        }));

        const created = await repository.createCards(newCards);
        setCards((prev) => [...prev, ...created]);
        return created;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to create cards';
        setError(msg);
        console.error('Failed to create cards:', err);
        throw err;
      }
    },
    [ensureUserDeck]
  );

  /**
   * Update a card
   */
  const updateCard = useCallback(
    async (id: string, updates: Partial<Omit<Card, 'id' | 'deckId' | 'createdAt'>>) => {
      try {
        await repository.updateCard(id, updates);
        setCards((prev) =>
          prev.map((card) => (card.id === id ? { ...card, ...updates } : card))
        );
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to update card';
        setError(msg);
        console.error('Failed to update card:', err);
        return false;
      }
    },
    []
  );

  /**
   * Delete a card
   */
  const deleteCard = useCallback(async (id: string) => {
    try {
      await repository.deleteCard(id);
      setCards((prev) => prev.filter((card) => card.id !== id));
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete card';
      setError(msg);
      console.error('Failed to delete card:', err);
      return false;
    }
  }, []);

  /**
   * Check if a single card front already exists
   */
  const checkDuplicateCard = useCallback(
    async (front: string) => {
      try {
        if (!userDeck) {
          await ensureUserDeck();
        }
        return await checkDuplicate(front, userDeck?.id || USER_DECK_CONFIG.id);
      } catch (err) {
        console.error('Error checking duplicate:', err);
        return { isDuplicate: false };
      }
    },
    [userDeck, ensureUserDeck]
  );

  /**
   * Check multiple card fronts for duplicates
   */
  const checkDuplicateCards = useCallback(
    async (fronts: string[]) => {
      try {
        if (!userDeck) {
          await ensureUserDeck();
        }
        return await checkDuplicates(fronts, userDeck?.id || USER_DECK_CONFIG.id);
      } catch (err) {
        console.error('Error checking duplicates:', err);
        return new Map();
      }
    },
    [userDeck, ensureUserDeck]
  );

  return {
    cards,
    userDeck,
    loading,
    error,
    loadUserCards,
    createCard,
    createCards,
    updateCard,
    deleteCard,
    checkDuplicateCard,
    checkDuplicateCards,
    ensureUserDeck,
  };
}
