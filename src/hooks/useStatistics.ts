/**
 * Hook for loading comprehensive study statistics
 */

import { useState, useEffect, useCallback } from 'react';
import { repository } from '../data/hybrid-repository';
import { getStartOfToday, addDays } from '../utils/date';

export interface StudyStatistics {
  // Overall stats
  totalCards: number;
  totalReviews: number;
  totalDecks: number;

  // Cards by status
  newCards: number;
  learningCards: number; // repetitions > 0, interval < 21 days
  matureCards: number;   // interval >= 21 days

  // Study streak
  currentStreak: number;
  longestStreak: number;

  // Today's stats
  reviewedToday: number;
  cardsRemainingToday: number;

  // This week stats
  reviewedThisWeek: number;

  // Accuracy (last 100 reviews)
  recentAccuracy: number; // percentage of ratings >= 3

  // Time estimates (based on average review time)
  estimatedTimeRemaining: number; // minutes
}

export function useStatistics() {
  const [statistics, setStatistics] = useState<StudyStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all decks and cards
      const decks = await repository.getDecks();
      const allCardsPromises = decks.map((deck) => repository.getCards(deck.id));
      const allCardsArrays = await Promise.all(allCardsPromises);
      const allCards = allCardsArrays.flat();

      // Get review logs for calculations
      const today = getStartOfToday();
      const weekAgo = addDays(today, -7);
      const reviewLogs = await repository.getReviewLogsByDateRange(weekAgo, addDays(today, 1));

      // Calculate overall stats
      const totalCards = allCards.length;
      const totalReviews = reviewLogs.length;
      const totalDecks = decks.length;

      // Calculate cards by status
      const now = new Date();
      const newCards = allCards.filter((card) => card.repetitions === 0).length;
      const learningCards = allCards.filter(
        (card) => card.repetitions > 0 && card.interval < 21
      ).length;
      const matureCards = allCards.filter((card) => card.interval >= 21).length;

      // Calculate cards remaining today
      const cardsRemainingToday = allCards.filter(
        (card) => card.nextReviewDate <= now
      ).length;

      // Calculate today's reviews (unique cards)
      const todayReviews = reviewLogs.filter((log) => {
        const logDate = log.reviewedAt.toDateString();
        return logDate === today.toDateString();
      });
      const reviewedTodaySet = new Set(todayReviews.map((log) => log.cardId));
      const reviewedToday = reviewedTodaySet.size;

      // Calculate this week's reviews (unique cards)
      const reviewedThisWeekSet = new Set(reviewLogs.map((log) => log.cardId));
      const reviewedThisWeek = reviewedThisWeekSet.size;

      // Calculate study streak
      const { currentStreak, longestStreak } = calculateStreaks(reviewLogs);

      // Calculate recent accuracy (last 100 reviews)
      const recentReviews = reviewLogs.slice(-100);
      const goodReviews = recentReviews.filter((log) => log.rating >= 3).length;
      const recentAccuracy = recentReviews.length > 0
        ? Math.round((goodReviews / recentReviews.length) * 100)
        : 0;

      // Estimate time remaining (assume 10 seconds per card)
      const estimatedTimeRemaining = Math.ceil((cardsRemainingToday * 10) / 60);

      setStatistics({
        totalCards,
        totalReviews,
        totalDecks,
        newCards,
        learningCards,
        matureCards,
        currentStreak,
        longestStreak,
        reviewedToday,
        cardsRemainingToday,
        reviewedThisWeek,
        recentAccuracy,
        estimatedTimeRemaining,
      });
      setLoading(false);
    } catch (err) {
      console.error('Failed to load statistics:', err);
      setError('Failed to load statistics');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  return {
    statistics,
    loading,
    error,
    refresh: loadStatistics,
  };
}

/**
 * Calculate current and longest study streaks
 */
function calculateStreaks(reviewLogs: any[]): { currentStreak: number; longestStreak: number } {
  if (reviewLogs.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Group reviews by date
  const reviewsByDate = new Map<string, boolean>();
  for (const log of reviewLogs) {
    const dateKey = log.reviewedAt.toDateString();
    reviewsByDate.set(dateKey, true);
  }

  // Sort dates
  const sortedDates = Array.from(reviewsByDate.keys()).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Calculate current streak (from today backwards)
  const today = getStartOfToday();
  let currentStreak = 0;
  let checkDate = today;

  while (reviewsByDate.has(checkDate.toDateString())) {
    currentStreak++;
    checkDate = addDays(checkDate, -1);
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const dayDiff = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayDiff === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return { currentStreak, longestStreak };
}
