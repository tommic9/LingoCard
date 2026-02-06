/**
 * Custom hook for managing decks
 */

import { useState, useEffect, useCallback } from 'react';
import type { Deck, DeckStats, DeckWithStats } from '../types';
import { repository } from '../data/hybrid-repository';

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDecks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allDecks = await repository.getDecks();
      setDecks(allDecks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load decks');
      console.error('Failed to load decks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDecks();
  }, [loadDecks]);

  const createDeck = async (
    deckData: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Deck | null> => {
    try {
      const newDeck = await repository.createDeck(deckData);
      setDecks((prev) => [...prev, newDeck]);
      return newDeck;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deck');
      console.error('Failed to create deck:', err);
      return null;
    }
  };

  const updateDeck = async (
    id: string,
    updates: Partial<Omit<Deck, 'id'>>
  ): Promise<boolean> => {
    try {
      await repository.updateDeck(id, updates);
      setDecks((prev) =>
        prev.map((deck) =>
          deck.id === id ? { ...deck, ...updates, updatedAt: new Date() } : deck
        )
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update deck');
      console.error('Failed to update deck:', err);
      return false;
    }
  };

  const deleteDeck = async (id: string): Promise<boolean> => {
    try {
      await repository.deleteDeck(id);
      setDecks((prev) => prev.filter((deck) => deck.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete deck');
      console.error('Failed to delete deck:', err);
      return false;
    }
  };

  const getDeckWithStats = async (id: string): Promise<DeckWithStats | null> => {
    try {
      const deck = await repository.getDeck(id);
      if (!deck) return null;

      const stats = await repository.getDeckStats(id);
      return { ...deck, stats };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deck stats');
      console.error('Failed to load deck stats:', err);
      return null;
    }
  };

  return {
    decks,
    loading,
    error,
    loadDecks,
    createDeck,
    updateDeck,
    deleteDeck,
    getDeckWithStats,
  };
}

/**
 * Hook for getting a single deck by ID
 */
export function useDeck(deckId: string | undefined) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [stats, setStats] = useState<DeckStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDeck = useCallback(async () => {
    if (!deckId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const deckData = await repository.getDeck(deckId);
      const statsData = await repository.getDeckStats(deckId);

      setDeck(deckData || null);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deck');
      console.error('Failed to load deck:', err);
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    loadDeck();
  }, [loadDeck]);

  return {
    deck,
    stats,
    loading,
    error,
    reload: loadDeck,
  };
}
