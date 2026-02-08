/**
 * SynonymActionModal - Modal for choosing action when clicking a synonym
 */

import { useEffect } from 'react';

interface SynonymActionModalProps {
  synonym: string;
  currentWord: string;
  isCurrentFormValid: boolean;
  onSaveAndAddNew: () => void;
  onReplace: () => void;
  onCopy: () => void;
  onClose: () => void;
}

export function SynonymActionModal({
  synonym,
  currentWord,
  isCurrentFormValid,
  onSaveAndAddNew,
  onReplace,
  onCopy,
  onClose,
}: SynonymActionModalProps) {
  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Add "{synonym}" to your cards?
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Current word context */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current: <span className="font-semibold text-gray-900 dark:text-white">"{currentWord}"</span>
          </p>

          {/* Action buttons */}
          <div className="space-y-3">
            {/* Save & Add New */}
            <button
              onClick={onSaveAndAddNew}
              disabled={!isCurrentFormValid}
              title={!isCurrentFormValid ? 'Complete current card first (fill English & Polish text)' : ''}
              className="w-full p-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg transition text-left disabled:cursor-not-allowed group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">💾</span>
                <div className="flex-1">
                  <div className="font-semibold mb-1">Save & Add New</div>
                  <div className="text-sm opacity-90">
                    Save "{currentWord}", then add "{synonym}" as new card
                  </div>
                  {!isCurrentFormValid && (
                    <div className="text-xs mt-1 opacity-75 italic">
                      ⚠️ Complete current card first
                    </div>
                  )}
                </div>
              </div>
            </button>

            {/* Replace */}
            <button
              onClick={onReplace}
              className="w-full p-4 bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 text-white rounded-lg transition text-left"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔄</span>
                <div className="flex-1">
                  <div className="font-semibold mb-1">Replace</div>
                  <div className="text-sm opacity-90">
                    Discard "{currentWord}", start fresh with "{synonym}"
                  </div>
                </div>
              </div>
            </button>

            {/* Copy */}
            <button
              onClick={onCopy}
              className="w-full p-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition text-left"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">📋</span>
                <div className="flex-1">
                  <div className="font-semibold mb-1">Copy to Clipboard</div>
                  <div className="text-sm opacity-75">
                    Copy "{synonym}" and keep current form
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
