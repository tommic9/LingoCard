/**
 * Daily Streak Bar - Shows 5-day progress visualization (2 back, today, 2 forward)
 */

import { useDailyProgress } from '../../hooks/useDailyProgress';
import type { DayProgress } from '../../hooks/useDailyProgress';

export function DailyStreakBar() {
  const { days, loading } = useDailyProgress();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center mb-4">
          Your Progress
        </h2>
        <div className="grid grid-cols-5 gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="w-10 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="w-12 h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
      <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center mb-4">
        Your Progress
      </h2>
      <div className="grid grid-cols-5 gap-2">
        {days.map((day) => (
          <DayItem key={day.date.toISOString()} day={day} />
        ))}
      </div>
    </div>
  );
}

interface DayItemProps {
  day: DayProgress;
}

function DayItem({ day }: DayItemProps) {
  const isPast = !day.isToday && !day.isFuture;

  // Today - Progress ring
  if (day.isToday) {
    const percentage = Math.min((day.reviewed / day.goal) * 100, 100);
    const circumference = 2 * Math.PI * 24; // radius = 24
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-12 h-12 md:w-14 md:h-14">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 56 56">
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-primary-500 dark:text-primary-400 transition-all duration-500"
            />
          </svg>
          {/* Text in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-900 dark:text-white leading-none">
              {day.reviewed}/{day.goal}
            </span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs font-bold text-primary-600 dark:text-primary-400">
            {day.dayLabel}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{day.dateLabel}</div>
        </div>
      </div>
    );
  }

  // Past days
  if (isPast) {
    let bgColor = 'bg-gray-100 dark:bg-gray-700';
    let textColor = 'text-gray-400 dark:text-gray-400';
    let borderColor = '';

    if (day.goalMet) {
      bgColor = 'bg-green-500 dark:bg-green-600';
      textColor = 'text-white';
    } else if (day.reviewed > 0) {
      bgColor = 'bg-orange-100 dark:bg-orange-900/30';
      textColor = 'text-orange-600 dark:text-orange-400';
      borderColor = 'border-2 border-orange-300 dark:border-orange-600';
    }

    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${bgColor} ${borderColor} flex items-center justify-center transition-all hover:scale-110`}
        >
          <span className={`text-sm font-bold ${textColor}`}>
            {day.reviewed > 0 ? day.reviewed : ''}
          </span>
        </div>
        <div className="text-center">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {day.dayLabel}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{day.dateLabel}</div>
        </div>
      </div>
    );
  }

  // Future days
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center transition-all hover:scale-110">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {day.dueCards || 0}
        </span>
      </div>
      <div className="text-center">
        <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {day.dayLabel}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{day.dateLabel}</div>
      </div>
    </div>
  );
}
