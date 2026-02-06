/**
 * Repository abstraction layer for data access
 * This interface allows easy migration to Supabase in the future
 */

import type { Card, Deck, ReviewLog, DeckStats } from '../types';

export interface IRepository {
  // Deck operations
  getDecks(): Promise<Deck[]>;
  getDeck(id: string): Promise<Deck | undefined>;
  createDeck(deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deck>;
  updateDeck(id: string, updates: Partial<Omit<Deck, 'id'>>): Promise<void>;
  deleteDeck(id: string): Promise<void>;
  getDeckStats(deckId: string): Promise<DeckStats>;

  // Card operations
  getCards(deckId: string): Promise<Card[]>;
  getCard(id: string): Promise<Card | undefined>;
  createCard(card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Promise<Card>;
  createCards(cards: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Card[]>;
  updateCard(id: string, updates: Partial<Omit<Card, 'id'>>): Promise<void>;
  deleteCard(id: string): Promise<void>;
  getDueCards(deckId: string): Promise<Card[]>;
  getAllDueCards(): Promise<Card[]>;

  // Review operations
  createReviewLog(log: Omit<ReviewLog, 'id'>): Promise<ReviewLog>;
  getReviewLogs(cardId: string): Promise<ReviewLog[]>;
  getReviewLogsByDateRange(start: Date, end: Date): Promise<ReviewLog[]>;

  // Utility operations
  clearAllData(): Promise<void>;
  exportData(): Promise<{ decks: Deck[]; cards: Card[]; reviewLogs: ReviewLog[] }>;
  importData(data: {
    decks: Deck[];
    cards: Card[];
    reviewLogs: ReviewLog[];
  }): Promise<void>;
}

/**
 * Create default card values for SM-2 algorithm
 */
export function createDefaultCardValues(): Pick<
  Card,
  'easeFactor' | 'interval' | 'repetitions' | 'nextReviewDate'
> {
  return {
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: new Date(),
  };
}
