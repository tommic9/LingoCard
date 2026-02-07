/**
 * Hook for tracking daily progress across a week
 */

import { useState, useEffect, useCallback } from 'react';
import { repository } from '../data/hybrid-repository';
import { getStoredDailyGoal } from '../utils/daily-goal';
import { addDays, getStartOfToday, isToday } from '../utils/date';

export interface DayProgress {
  date: Date;
  dayLabel: string; // "Mon", "Tue" or "Today"
  dateLabel: string; // "3 Feb"
  reviewed: number; // unique cards reviewed this day
  goal: number; // daily goal
  goalMet: boolean; // reviewed >= goal
  isToday: boolean;
  isFuture: boolean;
  dueCards?: number; // for future days: how many cards due
}

export function useDailyProgress() {
  const [days, setDays] = useState<DayProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    try {
      const goal = getStoredDailyGoal();
      const today = getStartOfToday();

      // Calculate date range: 2 days back to today
      const startDate = addDays(today, -2);

      // Get review logs for past days (including today)
      const reviewLogs = await repository.getReviewLogsByDateRange(
        startDate,
        addDays(today, 1) // Include all of today
      );

      // Group review logs by date and count unique cards
      const reviewsByDate = new Map<string, Set<string>>();
      for (const log of reviewLogs) {
        const dateKey = log.reviewedAt.toDateString();
        if (!reviewsByDate.has(dateKey)) {
          reviewsByDate.set(dateKey, new Set());
        }
        reviewsByDate.get(dateKey)!.add(log.cardId);
      }

      // Get all cards to calculate future due counts
      const allDecks = await repository.getDecks();
      const allCardsPromises = allDecks.map((deck) => repository.getCards(deck.id));
      const allCardsArrays = await Promise.all(allCardsPromises);
      const allCards = allCardsArrays.flat();

      // Build progress data for 5 days (2 back, today, 2 forward)
      const progressDays: DayProgress[] = [];

      for (let offset = -2; offset <= 2; offset++) {
        const date = addDays(today, offset);
        const dateKey = date.toDateString();
        const isTodayDate = isToday(date);
        const isFutureDate = date > today;

        // Count reviewed cards for this day
        const reviewedSet = reviewsByDate.get(dateKey);
        const reviewed = reviewedSet ? reviewedSet.size : 0;

        // For future days, count due cards
        let dueCards: number | undefined;
        if (isFutureDate) {
          const startOfDay = new Date(date);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);

          dueCards = allCards.filter(
            (card) => card.nextReviewDate >= startOfDay && card.nextReviewDate <= endOfDay
          ).length;
        }

        // Format labels
        const dayLabel = isTodayDate
          ? 'Today'
          : date.toLocaleDateString('en-US', { weekday: 'short' });

        const dateLabel = date.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
        });

        progressDays.push({
          date,
          dayLabel,
          dateLabel,
          reviewed,
          goal,
          goalMet: reviewed >= goal,
          isToday: isTodayDate,
          isFuture: isFutureDate,
          dueCards,
        });
      }

      setDays(progressDays);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load daily progress:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    days,
    loading,
    refresh: loadProgress,
  };
}
