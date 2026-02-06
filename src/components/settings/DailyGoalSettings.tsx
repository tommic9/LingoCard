/**
 * Daily Goal Settings Component
 * Allows users to set their daily review goal
 */

import { useState } from 'react';
import { useDailyGoal } from '../../hooks/useDailyGoal';
import { DAILY_GOAL_CONFIG } from '../../constants/daily-goal';

export function DailyGoalSettings() {
  const { goal, updateGoal } = useDailyGoal();
  const [customValue, setCustomValue] = useState<string>(goal.toString());
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handlePresetClick = (presetGoal: number) => {
    updateGoal(presetGoal);
    setShowCustomInput(false);
    setCustomValue(presetGoal.toString());
  };

  const handleCustomClick = () => {
    setShowCustomInput(true);
    setCustomValue(goal.toString());
  };

  const handleCustomSubmit = () => {
    const parsed = parseInt(customValue, 10);
    if (
      !isNaN(parsed) &&
      parsed >= DAILY_GOAL_CONFIG.minGoal &&
      parsed <= DAILY_GOAL_CONFIG.maxGoal
    ) {
      updateGoal(parsed);
      setShowCustomInput(false);
    } else {
      // Reset to current goal if invalid
      setCustomValue(goal.toString());
    }
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomSubmit();
    } else if (e.key === 'Escape') {
      setShowCustomInput(false);
      setCustomValue(goal.toString());
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {DAILY_GOAL_CONFIG.presets.map((preset) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              goal === preset && !showCustomInput
                ? 'bg-white dark:bg-gray-800 shadow-md text-primary-600 dark:text-primary-400 ring-2 ring-primary-500'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {preset} cards
          </button>
        ))}

        {showCustomInput ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={handleCustomKeyDown}
              onBlur={handleCustomSubmit}
              min={DAILY_GOAL_CONFIG.minGoal}
              max={DAILY_GOAL_CONFIG.maxGoal}
              className="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              autoFocus
            />
            <span className="text-gray-700 dark:text-gray-300">cards</span>
          </div>
        ) : (
          <button
            onClick={handleCustomClick}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              !(DAILY_GOAL_CONFIG.presets as readonly number[]).includes(goal)
                ? 'bg-white dark:bg-gray-800 shadow-md text-primary-600 dark:text-primary-400 ring-2 ring-primary-500'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Custom
            {!(DAILY_GOAL_CONFIG.presets as readonly number[]).includes(goal) && ` (${goal})`}
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Choose between {DAILY_GOAL_CONFIG.minGoal} and {DAILY_GOAL_CONFIG.maxGoal}{' '}
        cards per day
      </p>
    </div>
  );
}
