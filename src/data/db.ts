/**
 * Dexie.js database configuration for LingoCards
 */

import Dexie, { type Table } from 'dexie';
import type { Card, Deck, ReviewLog } from '../types';

export class LingoCardsDB extends Dexie {
  decks!: Table<Deck, string>;
  cards!: Table<Card, string>;
  reviewLogs!: Table<ReviewLog, string>;

  constructor() {
    super('LingoCardsDB');

    this.version(1).stores({
      decks: 'id, name, isBuiltIn, createdAt, updatedAt',
      cards: 'id, deckId, nextReviewDate, createdAt, updatedAt',
      reviewLogs: 'id, cardId, reviewedAt',
    });
  }
}

// Singleton instance
export const db = new LingoCardsDB();

/**
 * Helper to generate unique IDs
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Initialize database with seed data if empty
 */
export async function initializeDatabase(): Promise<void> {
  const deckCount = await db.decks.count();

  if (deckCount === 0) {
    console.log('Initializing database with seed data...');
    // Seed data will be imported from seed-data.ts
    const { seedDatabase } = await import('./seed-data');
    await seedDatabase();
  }
}
