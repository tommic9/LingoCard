/**
 * Hybrid Repository - Auto-switches between Local and Supabase
 * Uses LocalRepository when offline, SupabaseRepository when authenticated
 */

import type { IRepository } from './repository';
import type { Deck, Card, ReviewLog, DeckStats } from '../types';
import { LocalRepository } from './local-repository';
import { SupabaseRepository } from './supabase-repository';
import { supabase } from '../lib/supabase';

export class HybridRepository implements IRepository {
  private local = new LocalRepository();
  private supabase = new SupabaseRepository();
  private isAuthenticated = false;

  constructor() {
    // Initialize auth state
    this.updateAuthState();

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      this.isAuthenticated = !!session?.user;
    });
  }

  private async updateAuthState() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    this.isAuthenticated = !!session?.user;
  }

  private get repo(): IRepository {
    return this.isAuthenticated ? this.supabase : this.local;
  }

  // Delegate all methods to the active repository
  async getDecks(): Promise<Deck[]> {
    return this.repo.getDecks();
  }

  async getDeck(id: string): Promise<Deck | undefined> {
    return this.repo.getDeck(id);
  }

  async createDeck(deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deck> {
    return this.repo.createDeck(deck);
  }

  async updateDeck(id: string, updates: Partial<Omit<Deck, 'id'>>): Promise<void> {
    return this.repo.updateDeck(id, updates);
  }

  async deleteDeck(id: string): Promise<void> {
    return this.repo.deleteDeck(id);
  }

  async getDeckStats(deckId: string): Promise<DeckStats> {
    return this.repo.getDeckStats(deckId);
  }

  async getCards(deckId: string): Promise<Card[]> {
    return this.repo.getCards(deckId);
  }

  async getCard(id: string): Promise<Card | undefined> {
    return this.repo.getCard(id);
  }

  async createCard(card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Promise<Card> {
    return this.repo.createCard(card);
  }

  async createCards(cards: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Card[]> {
    return this.repo.createCards(cards);
  }

  async updateCard(id: string, updates: Partial<Omit<Card, 'id'>>): Promise<void> {
    return this.repo.updateCard(id, updates);
  }

  async deleteCard(id: string): Promise<void> {
    return this.repo.deleteCard(id);
  }

  async getDueCards(deckId: string): Promise<Card[]> {
    return this.repo.getDueCards(deckId);
  }

  async getAllDueCards(): Promise<Card[]> {
    return this.repo.getAllDueCards();
  }

  async createReviewLog(log: Omit<ReviewLog, 'id'>): Promise<ReviewLog> {
    return this.repo.createReviewLog(log);
  }

  async getReviewLogs(cardId: string): Promise<ReviewLog[]> {
    return this.repo.getReviewLogs(cardId);
  }

  async clearAllData(): Promise<void> {
    return this.repo.clearAllData();
  }

  async exportData(): Promise<{ decks: Deck[]; cards: Card[]; reviewLogs: ReviewLog[] }> {
    return this.repo.exportData();
  }

  async importData(data: {
    decks: Deck[];
    cards: Card[];
    reviewLogs: ReviewLog[];
  }): Promise<void> {
    return this.repo.importData(data);
  }
}

// Export singleton instance
export const repository = new HybridRepository();
