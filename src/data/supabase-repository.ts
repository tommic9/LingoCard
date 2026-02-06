/**
 * Supabase implementation of IRepository
 * Handles all data operations with Supabase backend
 */

import type { IRepository } from './repository';
import type { Deck, Card, ReviewLog, DeckStats } from '../types';
import { supabase } from '../lib/supabase';
import { generateId } from './db';
import { createDefaultCardValues } from './repository';

export class SupabaseRepository implements IRepository {
  /**
   * Get current authenticated user ID
   */
  private async getCurrentUserId(): Promise<string> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    return user.id;
  }

  /**
   * Map database row to Deck
   */
  private mapDeckFromDB(row: any): Deck {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      description: row.description,
      isBuiltIn: row.is_built_in,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  /**
   * Map Deck to database row
   */
  private mapDeckToDB(deck: Deck & { userId: string }) {
    return {
      id: deck.id,
      user_id: deck.userId,
      name: deck.name,
      description: deck.description,
      is_built_in: deck.isBuiltIn,
      created_at: deck.createdAt.toISOString(),
      updated_at: deck.updatedAt.toISOString(),
    };
  }

  /**
   * Map database row to Card
   */
  private mapCardFromDB(row: any): Card {
    return {
      id: row.id,
      deckId: row.deck_id,
      userId: row.user_id,
      front: row.front,
      back: row.back,
      example: row.example,
      easeFactor: row.ease_factor,
      interval: row.interval,
      repetitions: row.repetitions,
      nextReviewDate: new Date(row.next_review_date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  /**
   * Map Card to database row
   */
  private mapCardToDB(card: Card & { userId: string }) {
    return {
      id: card.id,
      deck_id: card.deckId,
      user_id: card.userId,
      front: card.front,
      back: card.back,
      example: card.example,
      ease_factor: card.easeFactor,
      interval: card.interval,
      repetitions: card.repetitions,
      next_review_date: card.nextReviewDate.toISOString(),
      created_at: card.createdAt.toISOString(),
      updated_at: card.updatedAt.toISOString(),
    };
  }

  /**
   * Map database row to ReviewLog
   */
  private mapReviewLogFromDB(row: any): ReviewLog {
    return {
      id: row.id,
      cardId: row.card_id,
      userId: row.user_id,
      rating: row.rating,
      reviewedAt: new Date(row.reviewed_at),
    };
  }

  /**
   * Map ReviewLog to database row
   */
  private mapReviewLogToDB(log: ReviewLog & { userId: string }) {
    return {
      id: log.id,
      card_id: log.cardId,
      user_id: log.userId,
      rating: log.rating,
      reviewed_at: log.reviewedAt.toISOString(),
    };
  }

  // ==========================================
  // DECK OPERATIONS
  // ==========================================

  async getDecks(): Promise<Deck[]> {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(this.mapDeckFromDB);
  }

  async getDeck(id: string): Promise<Deck | undefined> {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      throw error;
    }
    return data ? this.mapDeckFromDB(data) : undefined;
  }

  async createDeck(deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deck> {
    const userId = await this.getCurrentUserId();
    const now = new Date();
    const newDeck: Deck & { userId: string } = {
      id: generateId(),
      userId,
      ...deck,
      createdAt: now,
      updatedAt: now,
    };

    const { error } = await supabase.from('decks').insert(this.mapDeckToDB(newDeck));

    if (error) throw error;
    return newDeck;
  }

  async updateDeck(id: string, updates: Partial<Omit<Deck, 'id'>>): Promise<void> {
    const userId = await this.getCurrentUserId();
    const dbUpdates: any = {};

    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.isBuiltIn !== undefined) dbUpdates.is_built_in = updates.isBuiltIn;
    // updated_at is handled by trigger

    const { error } = await supabase
      .from('decks')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async deleteDeck(id: string): Promise<void> {
    const userId = await this.getCurrentUserId();
    const { error } = await supabase
      .from('decks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getDeckStats(deckId: string): Promise<DeckStats> {
    const userId = await this.getCurrentUserId();
    const { data: cards, error } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', deckId)
      .eq('user_id', userId);

    if (error) throw error;

    const now = new Date();
    const mappedCards = (cards || []).map(this.mapCardFromDB);

    const dueCards = mappedCards.filter((card) => card.nextReviewDate <= now);
    const newCards = mappedCards.filter((card) => card.repetitions === 0);
    const learningCards = mappedCards.filter(
      (card) => card.repetitions > 0 && card.repetitions < 3
    );

    return {
      totalCards: mappedCards.length,
      dueCards: dueCards.length,
      newCards: newCards.length,
      learningCards: learningCards.length,
    };
  }

  // ==========================================
  // CARD OPERATIONS
  // ==========================================

  async getCards(deckId: string): Promise<Card[]> {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', deckId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(this.mapCardFromDB);
  }

  async getCard(id: string): Promise<Card | undefined> {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return data ? this.mapCardFromDB(data) : undefined;
  }

  async createCard(card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Promise<Card> {
    const userId = await this.getCurrentUserId();
    const now = new Date();
    const defaults = createDefaultCardValues();

    const newCard: Card & { userId: string } = {
      id: generateId(),
      userId,
      ...defaults,
      ...card,
      createdAt: now,
      updatedAt: now,
    };

    const { error } = await supabase.from('cards').insert(this.mapCardToDB(newCard));

    if (error) throw error;
    return newCard;
  }

  async createCards(cards: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Card[]> {
    const userId = await this.getCurrentUserId();
    const now = new Date();
    const defaults = createDefaultCardValues();

    const newCards: (Card & { userId: string })[] = cards.map((card) => ({
      id: generateId(),
      userId,
      ...defaults,
      ...card,
      createdAt: now,
      updatedAt: now,
    }));

    const { error } = await supabase
      .from('cards')
      .insert(newCards.map(this.mapCardToDB));

    if (error) throw error;
    return newCards;
  }

  async updateCard(id: string, updates: Partial<Omit<Card, 'id'>>): Promise<void> {
    const userId = await this.getCurrentUserId();
    const dbUpdates: any = {};

    if (updates.front !== undefined) dbUpdates.front = updates.front;
    if (updates.back !== undefined) dbUpdates.back = updates.back;
    if (updates.example !== undefined) dbUpdates.example = updates.example;
    if (updates.easeFactor !== undefined) dbUpdates.ease_factor = updates.easeFactor;
    if (updates.interval !== undefined) dbUpdates.interval = updates.interval;
    if (updates.repetitions !== undefined) dbUpdates.repetitions = updates.repetitions;
    if (updates.nextReviewDate !== undefined)
      dbUpdates.next_review_date = updates.nextReviewDate.toISOString();
    // updated_at is handled by trigger

    const { error } = await supabase
      .from('cards')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async deleteCard(id: string): Promise<void> {
    const userId = await this.getCurrentUserId();
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getDueCards(deckId: string): Promise<Card[]> {
    const userId = await this.getCurrentUserId();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', deckId)
      .eq('user_id', userId)
      .lte('next_review_date', now)
      .order('next_review_date', { ascending: true });

    if (error) throw error;
    return (data || []).map(this.mapCardFromDB);
  }

  async getAllDueCards(): Promise<Card[]> {
    const userId = await this.getCurrentUserId();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', now)
      .order('next_review_date', { ascending: true });

    if (error) throw error;
    return (data || []).map(this.mapCardFromDB);
  }

  // ==========================================
  // REVIEW LOG OPERATIONS
  // ==========================================

  async createReviewLog(log: Omit<ReviewLog, 'id'>): Promise<ReviewLog> {
    const userId = await this.getCurrentUserId();
    const newLog: ReviewLog & { userId: string } = {
      id: generateId(),
      userId,
      ...log,
    };

    const { error } = await supabase
      .from('review_logs')
      .insert(this.mapReviewLogToDB(newLog));

    if (error) throw error;
    return newLog;
  }

  async getReviewLogs(cardId: string): Promise<ReviewLog[]> {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('review_logs')
      .select('*')
      .eq('card_id', cardId)
      .eq('user_id', userId)
      .order('reviewed_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(this.mapReviewLogFromDB);
  }

  // ==========================================
  // UTILITY OPERATIONS
  // ==========================================

  async clearAllData(): Promise<void> {
    const userId = await this.getCurrentUserId();

    // Delete in order (due to foreign keys)
    await supabase.from('review_logs').delete().eq('user_id', userId);
    await supabase.from('cards').delete().eq('user_id', userId);
    await supabase.from('decks').delete().eq('user_id', userId);
  }

  async exportData(): Promise<{ decks: Deck[]; cards: Card[]; reviewLogs: ReviewLog[] }> {
    const decks = await this.getDecks();
    const allCards: Card[] = [];
    const allReviewLogs: ReviewLog[] = [];

    // Get all cards for all decks
    for (const deck of decks) {
      const cards = await this.getCards(deck.id);
      allCards.push(...cards);

      // Get review logs for each card
      for (const card of cards) {
        const logs = await this.getReviewLogs(card.id);
        allReviewLogs.push(...logs);
      }
    }

    return {
      decks,
      cards: allCards,
      reviewLogs: allReviewLogs,
    };
  }

  async importData(data: {
    decks: Deck[];
    cards: Card[];
    reviewLogs: ReviewLog[];
  }): Promise<void> {
    const userId = await this.getCurrentUserId();

    // Import decks
    if (data.decks.length > 0) {
      const decksToInsert = data.decks.map((deck) =>
        this.mapDeckToDB({ ...deck, userId })
      );
      const { error } = await supabase.from('decks').insert(decksToInsert);
      if (error) throw error;
    }

    // Import cards
    if (data.cards.length > 0) {
      const cardsToInsert = data.cards.map((card) =>
        this.mapCardToDB({ ...card, userId })
      );
      const { error } = await supabase.from('cards').insert(cardsToInsert);
      if (error) throw error;
    }

    // Import review logs
    if (data.reviewLogs.length > 0) {
      const logsToInsert = data.reviewLogs.map((log) =>
        this.mapReviewLogToDB({ ...log, userId })
      );
      const { error } = await supabase.from('review_logs').insert(logsToInsert);
      if (error) throw error;
    }
  }
}

export const supabaseRepository = new SupabaseRepository();
