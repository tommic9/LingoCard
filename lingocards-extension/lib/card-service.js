/**
 * Card service for managing flashcards
 * Handles CRUD operations, duplicate detection, and user deck management
 */

import { getSupabase } from './supabase-client.js';
import { generateId } from '../utils/id-generator.js';
import { normalizeText } from '../utils/text-normalizer.js';

const USER_DECK_ID = 'user-deck-default';

export const cardService = {
  /**
   * Ensure user deck exists, create if not
   * @param {string} userId - User ID
   */
  async ensureUserDeck(userId) {
    const supabase = await getSupabase();

    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('id', USER_DECK_ID)
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!data) {
      // Deck doesn't exist, create it
      const now = new Date().toISOString();
      const { error: insertError } = await supabase.from('decks').insert({
        id: USER_DECK_ID,
        user_id: userId,
        name: 'My Cards',
        description: 'Your custom flashcards',
        is_built_in: false,
        created_at: now,
        updated_at: now,
      });

      if (insertError) {
        throw insertError;
      }
    }
  },

  /**
   * Check if card with same front text already exists
   * @param {string} front - Front text to check
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} True if duplicate exists
   */
  async checkDuplicate(front, userId) {
    const supabase = await getSupabase();

    const { data, error } = await supabase
      .from('cards')
      .select('front')
      .eq('deck_id', USER_DECK_ID)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return false;
    }

    const normalized = normalizeText(front);
    return data.some(card => normalizeText(card.front) === normalized);
  },

  /**
   * Create a new flashcard
   * @param {Object} params - Card parameters
   * @param {string} params.front - Front text (English)
   * @param {string} params.back - Back text (Polish)
   * @param {string} params.userId - User ID
   * @param {string} [params.example] - Optional example sentence
   * @returns {Promise<Object>} Created card with id
   */
  async createCard({ front, back, userId, example }) {
    const supabase = await getSupabase();

    // 1. Ensure deck exists
    await this.ensureUserDeck(userId);

    // 2. Check duplicate
    const isDuplicate = await this.checkDuplicate(front, userId);
    if (isDuplicate) {
      throw new Error(`Słówko "${front}" już istnieje w Twoich fiszkach`);
    }

    // 3. Create card
    const cardId = generateId();
    const now = new Date().toISOString();

    const { error } = await supabase.from('cards').insert({
      id: cardId,
      deck_id: USER_DECK_ID,
      user_id: userId,
      front: front.trim(),
      back: back.trim(),
      example: example?.trim() || null,
      ease_factor: 2.5,
      interval: 0,
      repetitions: 0,
      next_review_date: now,
      created_at: now,
      updated_at: now,
    });

    if (error) {
      throw error;
    }

    return { id: cardId };
  }
};
