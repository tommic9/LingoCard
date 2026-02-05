/**
 * SM-2 (SuperMemo 2) Spaced Repetition Algorithm
 *
 * This algorithm calculates the optimal time interval for reviewing flashcards
 * based on the user's performance rating.
 *
 * Ratings:
 * - 0 (Again): Complete blackout, incorrect response
 * - 1: Incorrect response, but correct one remembered
 * - 2 (Hard): Correct response with difficulty
 * - 3: Correct response with hesitation
 * - 4 (Good): Correct response after some thought
 * - 5 (Easy): Perfect response, immediate recall
 *
 * Algorithm:
 * - EF (Ease Factor) starts at 2.5
 * - EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
 * - EF' is constrained to minimum 1.3
 * - If rating < 3: reset repetitions to 0, interval = 1 day
 * - If rating >= 3:
 *   - First repetition: 1 day
 *   - Second repetition: 6 days
 *   - Subsequent: previous interval * EF
 */

import type { SM2Result } from '../types';

export interface SM2Input {
  easeFactor: number;
  interval: number;
  repetitions: number;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
}

/**
 * Calculate the next review date and updated card parameters using SM-2 algorithm
 */
export function calculateSM2(input: SM2Input): SM2Result {
  const { easeFactor, interval, repetitions, rating } = input;

  // Calculate new ease factor
  let newEaseFactor =
    easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));

  // Ensure ease factor doesn't go below 1.3
  newEaseFactor = Math.max(1.3, newEaseFactor);

  let newInterval: number;
  let newRepetitions: number;

  // If rating is less than 3, reset the card
  if (rating < 3) {
    newRepetitions = 0;
    newInterval = 1;
  } else {
    // Rating is 3 or higher - card was remembered correctly
    newRepetitions = repetitions + 1;

    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEaseFactor);
    }
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate,
  };
}

/**
 * Helper function to get rating from button text
 */
export function getRatingFromButton(button: 'again' | 'hard' | 'good' | 'easy'): 0 | 2 | 4 | 5 {
  switch (button) {
    case 'again':
      return 0;
    case 'hard':
      return 2;
    case 'good':
      return 4;
    case 'easy':
      return 5;
  }
}

/**
 * Helper function to preview next review intervals for each rating
 */
export function previewIntervals(input: Omit<SM2Input, 'rating'>): {
  again: number;
  hard: number;
  good: number;
  easy: number;
} {
  const again = calculateSM2({ ...input, rating: 0 }).interval;
  const hard = calculateSM2({ ...input, rating: 2 }).interval;
  const good = calculateSM2({ ...input, rating: 4 }).interval;
  const easy = calculateSM2({ ...input, rating: 5 }).interval;

  return { again, hard, good, easy };
}

/**
 * Format interval for display
 */
export function formatInterval(days: number): string {
  if (days < 1) {
    return '< 1 day';
  } else if (days === 1) {
    return '1 day';
  } else if (days < 30) {
    return `${days} days`;
  } else if (days < 365) {
    const months = Math.round(days / 30);
    return months === 1 ? '1 month' : `${months} months`;
  } else {
    const years = Math.round(days / 365);
    return years === 1 ? '1 year' : `${years} years`;
  }
}
