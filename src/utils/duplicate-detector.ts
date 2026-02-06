/**
 * Duplicate detection utility for flashcards
 * Uses normalized exact matching (case-insensitive, trimmed)
 */

import type { Card } from '../types';
import { repository } from '../data/hybrid-repository';

/**
 * Normalize text for comparison: lowercase, trim, remove diacritics
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics
}

export interface DuplicateCheck {
  isDuplicate: boolean;
  existingCard?: Card;
}

/**
 * Check if a card front text already exists in a deck (single check)
 */
export async function checkDuplicate(
  front: string,
  deckId: string
): Promise<DuplicateCheck> {
  try {
    const normalized = normalizeText(front);
    const cards = await repository.getCards(deckId);

    for (const card of cards) {
      if (normalizeText(card.front) === normalized) {
        return {
          isDuplicate: true,
          existingCard: card,
        };
      }
    }

    return { isDuplicate: false };
  } catch (error) {
    console.error('Error checking duplicate:', error);
    return { isDuplicate: false };
  }
}

/**
 * Check multiple card fronts for duplicates (bulk check, optimized for CSV)
 */
export async function checkDuplicates(
  fronts: string[],
  deckId: string
): Promise<Map<string, DuplicateCheck>> {
  try {
    const cards = await repository.getCards(deckId);
    const normalizedExisting = new Map<string, Card>();

    // Build map of normalized existing cards
    for (const card of cards) {
      const normalized = normalizeText(card.front);
      normalizedExisting.set(normalized, card);
    }

    // Check each input front
    const results = new Map<string, DuplicateCheck>();
    for (const front of fronts) {
      const normalized = normalizeText(front);
      const existingCard = normalizedExisting.get(normalized);

      results.set(front, {
        isDuplicate: !!existingCard,
        existingCard,
      });
    }

    return results;
  } catch (error) {
    console.error('Error checking duplicates:', error);
    return new Map();
  }
}
