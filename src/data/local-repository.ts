/**
 * Local repository implementation using Dexie.js (IndexedDB)
 */

import type { Card, Deck, ReviewLog, DeckStats } from '../types';
import type { IRepository } from './repository';
import { db, generateId } from './db';
import { createDefaultCardValues } from './repository';

export class LocalRepository implements IRepository {
  // Deck operations
  async getDecks(): Promise<Deck[]> {
    return await db.decks.toArray();
  }

  async getDeck(id: string): Promise<Deck | undefined> {
    return await db.decks.get(id);
  }

  async createDeck(
    deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Deck> {
    const now = new Date();
    const newDeck: Deck = {
      ...deck,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    await db.decks.add(newDeck);
    return newDeck;
  }

  async updateDeck(
    id: string,
    updates: Partial<Omit<Deck, 'id'>>
  ): Promise<void> {
    await db.decks.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  async deleteDeck(id: string): Promise<void> {
    // Delete all cards in the deck first
    const cards = await this.getCards(id);
    await Promise.all(cards.map((card) => this.deleteCard(card.id)));

    // Delete the deck
    await db.decks.delete(id);
  }

  async getDeckStats(deckId: string): Promise<DeckStats> {
    const cards = await this.getCards(deckId);
    const now = new Date();

    const dueCards = cards.filter(
      (card) => card.nextReviewDate <= now
    ).length;
    const newCards = cards.filter((card) => card.repetitions === 0).length;
    const learningCards = cards.filter(
      (card) => card.repetitions > 0 && card.repetitions < 3
    ).length;

    return {
      totalCards: cards.length,
      dueCards,
      newCards,
      learningCards,
    };
  }

  // Card operations
  async getCards(deckId: string): Promise<Card[]> {
    return await db.cards.where('deckId').equals(deckId).toArray();
  }

  async getCard(id: string): Promise<Card | undefined> {
    return await db.cards.get(id);
  }

  async createCard(
    card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Card> {
    const now = new Date();
    const defaults = createDefaultCardValues();

    const newCard: Card = {
      ...defaults,
      ...card,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    await db.cards.add(newCard);
    return newCard;
  }

  async createCards(
    cards: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>[]
  ): Promise<Card[]> {
    const now = new Date();
    const defaults = createDefaultCardValues();

    const newCards = cards.map((card) => ({
      ...defaults,
      ...card,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }));

    await db.cards.bulkAdd(newCards);
    return newCards;
  }

  async updateCard(
    id: string,
    updates: Partial<Omit<Card, 'id'>>
  ): Promise<void> {
    await db.cards.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  async deleteCard(id: string): Promise<void> {
    await db.cards.delete(id);
    // Also delete associated review logs
    const logs = await this.getReviewLogs(id);
    await Promise.all(logs.map((log) => db.reviewLogs.delete(log.id)));
  }

  async getDueCards(deckId: string): Promise<Card[]> {
    const now = new Date();
    return await db.cards
      .where('deckId')
      .equals(deckId)
      .and((card) => card.nextReviewDate <= now)
      .toArray();
  }

  async getAllDueCards(): Promise<Card[]> {
    const now = new Date();
    return await db.cards
      .where('nextReviewDate')
      .belowOrEqual(now)
      .toArray();
  }

  // Review operations
  async createReviewLog(log: Omit<ReviewLog, 'id'>): Promise<ReviewLog> {
    const newLog: ReviewLog = {
      ...log,
      id: generateId(),
    };
    await db.reviewLogs.add(newLog);
    return newLog;
  }

  async getReviewLogs(cardId: string): Promise<ReviewLog[]> {
    return await db.reviewLogs.where('cardId').equals(cardId).toArray();
  }

  // Utility operations
  async clearAllData(): Promise<void> {
    await db.decks.clear();
    await db.cards.clear();
    await db.reviewLogs.clear();
  }

  async exportData(): Promise<{
    decks: Deck[];
    cards: Card[];
    reviewLogs: ReviewLog[];
  }> {
    const decks = await db.decks.toArray();
    const cards = await db.cards.toArray();
    const reviewLogs = await db.reviewLogs.toArray();

    return { decks, cards, reviewLogs };
  }

  async importData(data: {
    decks: Deck[];
    cards: Card[];
    reviewLogs: ReviewLog[];
  }): Promise<void> {
    await this.clearAllData();
    await db.decks.bulkAdd(data.decks);
    await db.cards.bulkAdd(data.cards);
    await db.reviewLogs.bulkAdd(data.reviewLogs);
  }
}

// Singleton instance
export const repository = new LocalRepository();
