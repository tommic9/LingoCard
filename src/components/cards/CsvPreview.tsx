/**
 * CsvPreview component - Preview table for CSV import
 */

import type { CSVCard } from '../../utils/csv-parser';
import type { Card } from '../../types';

interface CsvPreviewProps {
  cards: CSVCard[];
  errors: string[];
  duplicates: Map<string, Card | undefined>;
  onSkipDuplicates?: (skip: boolean) => void;
}

export function CsvPreview({
  cards,
  errors,
  duplicates,
  onSkipDuplicates,
}: CsvPreviewProps) {
  const validCards = cards.filter((card) => !errors.some((e) => e.includes(card.front)));
  const duplicateCount = Array.from(duplicates.values()).filter((v) => v).length;
  const validCount = validCards.length - duplicateCount;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {cards.length}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            Total Cards
          </div>
        </div>

        {duplicateCount > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {duplicateCount}
            </div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">
              Duplicates
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {errors.length}
            </div>
            <div className="text-sm text-red-700 dark:text-red-300">
              Errors
            </div>
          </div>
        )}

        {validCount > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {validCount}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Valid Cards
            </div>
          </div>
        )}
      </div>

      {/* Skip Duplicates Option */}
      {duplicateCount > 0 && onSkipDuplicates && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
              Duplicate cards found
            </h4>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              You can skip duplicates or add them anyway
            </p>
          </div>
          <button
            onClick={() => onSkipDuplicates(true)}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition whitespace-nowrap ml-2"
          >
            Skip Duplicates
          </button>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 max-h-48 overflow-y-auto">
          <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
            Import Errors:
          </h4>
          <ul className="space-y-1">
            {errors.map((error, i) => (
              <li key={i} className="text-sm text-red-700 dark:text-red-200">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Preview Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                English
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                Polish
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                Example
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {cards.slice(0, 50).map((card, i) => {
              const isDuplicate = duplicates.get(card.front);
              const isError = errors.some((e) => e.includes(card.front));

              return (
                <tr
                  key={i}
                  className={`border-b border-gray-200 dark:border-gray-700 ${
                    isDuplicate
                      ? 'bg-yellow-50 dark:bg-yellow-900/10'
                      : isError
                        ? 'bg-red-50 dark:bg-red-900/10'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <td className="px-4 py-2 text-gray-900 dark:text-white truncate">
                    {card.front}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-white truncate">
                    {card.back}
                  </td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400 truncate max-w-xs">
                    {card.example || '-'}
                  </td>
                  <td className="px-4 py-2">
                    {isDuplicate ? (
                      <span className="inline-block px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 text-xs rounded-full">
                        Duplicate
                      </span>
                    ) : isError ? (
                      <span className="inline-block px-2 py-1 bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 text-xs rounded-full">
                        Error
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 text-xs rounded-full">
                        Valid
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {cards.length > 50 && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing first 50 cards. {cards.length - 50} more cards not shown.
        </p>
      )}
    </div>
  );
}
