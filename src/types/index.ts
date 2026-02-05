/**
 * Data models for LingoCards application
 */

export interface Deck {
  id: string;
  name: string;
  description: string;
  isBuiltIn: boolean; // true = built-in deck
  createdAt: Date;
  updatedAt: Date;
}

export interface Card {
  id: string;
  deckId: string;
  front: string; // English (or question)
  back: string; // Polish (or answer)
  example?: string; // Example sentence
  // SM-2 fields
  easeFactor: number; // default 2.5
  interval: number; // in days
  repetitions: number; // number of repetitions
  nextReviewDate: Date; // when to review next
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewLog {
  id: string;
  cardId: string;
  rating: 0 | 1 | 2 | 3 | 4 | 5; // SM-2 rating
  reviewedAt: Date;
}

/**
 * SM-2 Algorithm types
 */

export interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
}

export const ReviewRating = {
  Again: 0, // Complete blackout
  Hard: 2, // Incorrect response; correct one remembered
  Good: 4, // Correct response with hesitation
  Easy: 5, // Perfect response
} as const;

/**
 * Repository types
 */

export interface DeckStats {
  totalCards: number;
  dueCards: number;
  newCards: number;
  learningCards: number;
}

export interface StudySession {
  deckId: string;
  cards: Card[];
  currentIndex: number;
  reviewedCount: number;
  startedAt: Date;
}

/**
 * UI types
 */

export interface DeckWithStats extends Deck {
  stats: DeckStats;
}
