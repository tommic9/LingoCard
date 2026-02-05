/**
 * Custom hook for managing study sessions
 */

import { useState, useCallback, useEffect } from 'react';
import type { Card, StudySession } from '../types';
import { repository } from '../data/local-repository';
import { calculateSM2 } from '../algorithms/sm2';

export function useStudySession() {
  const [session, setSession] = useState<StudySession | null>(null);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize study session
  const startSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all due cards (no deck filtering)
      const dueCards = await repository.getAllDueCards();

      if (dueCards.length === 0) {
        setError('No cards due for review');
        setLoading(false);
        return;
      }

      // Shuffle cards
      const shuffled = shuffleArray([...dueCards]);

      const newSession: StudySession = {
        deckId: 'all', // No longer using specific deck IDs
        cards: shuffled,
        currentIndex: 0,
        reviewedCount: 0,
        startedAt: new Date(),
      };

      setSession(newSession);
      setCurrentCard(shuffled[0]);
      setIsFlipped(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session');
      console.error('Failed to start session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    startSession();
  }, [startSession]);

  // Flip the current card
  const flipCard = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Rate the current card and move to next
  const rateCard = useCallback(
    async (rating: 0 | 4) => {
      if (!session || !currentCard) return;

      try {
        // Calculate new SM-2 values
        const sm2Result = calculateSM2({
          easeFactor: currentCard.easeFactor,
          interval: currentCard.interval,
          repetitions: currentCard.repetitions,
          rating,
        });

        // Update card in database
        await repository.updateCard(currentCard.id, sm2Result);

        // Create review log
        await repository.createReviewLog({
          cardId: currentCard.id,
          rating,
          reviewedAt: new Date(),
        });

        // Move to next card
        const nextIndex = session.currentIndex + 1;
        const reviewedCount = session.reviewedCount + 1;

        if (nextIndex >= session.cards.length) {
          // Session complete
          setSession({
            ...session,
            currentIndex: nextIndex,
            reviewedCount,
          });
          setCurrentCard(null);
        } else {
          // Move to next card
          setSession({
            ...session,
            currentIndex: nextIndex,
            reviewedCount,
          });
          setCurrentCard(session.cards[nextIndex]);
          setIsFlipped(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to rate card');
        console.error('Failed to rate card:', err);
      }
    },
    [session, currentCard]
  );

  // Skip current card (for later review)
  const skipCard = useCallback(() => {
    if (!session || !currentCard) return;

    const nextIndex = session.currentIndex + 1;

    if (nextIndex >= session.cards.length) {
      // Session complete
      setSession({
        ...session,
        currentIndex: nextIndex,
      });
      setCurrentCard(null);
    } else {
      // Move to next card
      setSession({
        ...session,
        currentIndex: nextIndex,
      });
      setCurrentCard(session.cards[nextIndex]);
      setIsFlipped(false);
    }
  }, [session, currentCard]);

  // Get session progress
  const progress = session
    ? {
        current: session.currentIndex + 1,
        total: session.cards.length,
        reviewed: session.reviewedCount,
        remaining: session.cards.length - session.currentIndex - 1,
        percentage: Math.round(
          ((session.currentIndex + 1) / session.cards.length) * 100
        ),
      }
    : null;

  // Check if session is complete
  const isComplete = session
    ? session.currentIndex >= session.cards.length
    : false;

  return {
    session,
    currentCard,
    isFlipped,
    loading,
    error,
    progress,
    isComplete,
    startSession,
    flipCard,
    rateCard,
    skipCard,
  };
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
