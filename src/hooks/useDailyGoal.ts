/**
 * Hook for managing daily goal and tracking progress
 */

import { useState, useEffect, useCallback } from 'react';
import { repository } from '../data/hybrid-repository';
import { getStoredDailyGoal, setStoredDailyGoal } from '../utils/daily-goal';
import { getStartOfToday, getEndOfToday } from '../utils/date';

interface DailyGoalState {
  goal: number;
  todayReviewed: number;
  remaining: number;
  goalMet: boolean;
  loading: boolean;
}

export function useDailyGoal() {
  const [state, setState] = useState<DailyGoalState>({
    goal: getStoredDailyGoal(),
    todayReviewed: 0,
    remaining: 0,
    goalMet: false,
    loading: true,
  });

  const refreshProgress = useCallback(async () => {
    try {
      const start = getStartOfToday();
      const end = getEndOfToday();

      // Get all review logs from today
      const logs = await repository.getReviewLogsByDateRange(start, end);

      // Count unique cards reviewed today (using Set to avoid double-counting)
      const uniqueCards = new Set(logs.map((log) => log.cardId));
      const todayReviewed = uniqueCards.size;

      const goal = getStoredDailyGoal();
      const remaining = Math.max(0, goal - todayReviewed);
      const goalMet = todayReviewed >= goal;

      setState({
        goal,
        todayReviewed,
        remaining,
        goalMet,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to refresh daily goal progress:', error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const updateGoal = useCallback(
    (newGoal: number) => {
      setStoredDailyGoal(newGoal);
      const remaining = Math.max(0, newGoal - state.todayReviewed);
      const goalMet = state.todayReviewed >= newGoal;

      setState((prev) => ({
        ...prev,
        goal: newGoal,
        remaining,
        goalMet,
      }));
    },
    [state.todayReviewed]
  );

  // Load progress on mount
  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  return {
    ...state,
    updateGoal,
    refreshProgress,
  };
}
