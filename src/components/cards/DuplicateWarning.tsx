/**
 * DuplicateWarning component - Alerts user about existing cards
 */

import type { Card } from '../../types';

interface DuplicateWarningProps {
  existingCard: Card;
  onCancel: () => void;
  onAddAnyway: () => void;
  isLoading?: boolean;
}

export function DuplicateWarning({
  existingCard,
  onCancel,
  onAddAnyway,
  isLoading = false,
}: DuplicateWarningProps) {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
        ⚠️ Duplicate Card Detected
      </h3>
      <p className="text-sm text-yellow-800 dark:text-yellow-200">
        A card with this English text already exists:
      </p>
      <div className="bg-yellow-100 dark:bg-yellow-800/30 rounded p-3 space-y-2">
        <div>
          <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">
            English:
          </span>
          <p className="text-sm text-yellow-900 dark:text-yellow-100 break-words">
            {existingCard.front}
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">
            Polish:
          </span>
          <p className="text-sm text-yellow-900 dark:text-yellow-100 break-words">
            {existingCard.back}
          </p>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onAddAnyway}
          disabled={isLoading}
          className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
        >
          Add Anyway
        </button>
      </div>
    </div>
  );
}
