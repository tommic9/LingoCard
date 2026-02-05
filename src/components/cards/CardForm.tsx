/**
 * CardForm component - Manual card entry form
 */

import { useState } from 'react';
import type { Card } from '../../types';
import { useCardManagement } from '../../hooks/useCardManagement';
import { translateEnglishToPolish } from '../../utils/translator';
import { DuplicateWarning } from './DuplicateWarning';

interface CardFormProps {
  onCardCreated?: (card: Card) => void;
  onCancel?: () => void;
}

interface FormData {
  front: string;
  back: string;
  example?: string;
}

export function CardForm({ onCardCreated, onCancel }: CardFormProps) {
  const { createCard, checkDuplicateCard } = useCardManagement();
  const [formData, setFormData] = useState<FormData>({
    front: '',
    back: '',
    example: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [duplicateCard, setDuplicateCard] = useState<Card | null>(null);
  const [allowDuplicate, setAllowDuplicate] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setDuplicateCard(null);
  };

  const handleTranslate = async () => {
    if (!formData.front.trim()) {
      setError('Please enter English text first');
      return;
    }

    setTranslating(true);
    setError(null);

    try {
      const result = await translateEnglishToPolish(formData.front);

      if ('error' in result) {
        setError(result.error);
      } else {
        setFormData((prev) => ({
          ...prev,
          back: result.translatedText,
        }));
      }
    } catch (err) {
      setError('Translation failed. Please try again or enter manually.');
    } finally {
      setTranslating(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.front.trim()) {
      setError('English text is required');
      return false;
    }

    if (!formData.back.trim()) {
      setError('Polish text is required');
      return false;
    }

    if (formData.front.trim().length > 500) {
      setError('English text is too long (max 500 characters)');
      return false;
    }

    if (formData.back.trim().length > 500) {
      setError('Polish text is too long (max 500 characters)');
      return false;
    }

    if (formData.example && formData.example.trim().length > 1000) {
      setError('Example is too long (max 1000 characters)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check for duplicates unless already allowed
    if (!allowDuplicate) {
      setLoading(true);
      const duplicate = await checkDuplicateCard(formData.front);
      setLoading(false);

      if (duplicate.isDuplicate && duplicate.existingCard) {
        setDuplicateCard(duplicate.existingCard);
        return;
      }
    }

    // Create the card
    setLoading(true);
    setError(null);

    try {
      const newCard = await createCard({
        front: formData.front.trim(),
        back: formData.back.trim(),
        example: formData.example && formData.example.trim().length > 0 ? formData.example.trim() : undefined,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReviewDate: new Date(),
      });

      setFormData({ front: '', back: '', example: '' });
      setSuccess(true);
      setAllowDuplicate(false);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

      onCardCreated?.(newCard);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create card');
    } finally {
      setLoading(false);
    }
  };

  // Show duplicate warning if detected
  if (duplicateCard) {
    return (
      <div className="space-y-4">
        <DuplicateWarning
          existingCard={duplicateCard}
          onCancel={() => {
            setDuplicateCard(null);
            setAllowDuplicate(false);
          }}
          onAddAnyway={() => {
            setDuplicateCard(null);
            setAllowDuplicate(true);
            // Re-submit the form after state updates
            setTimeout(() => {
              const form = document.querySelector('form') as HTMLFormElement;
              form?.dispatchEvent(new Event('submit', { bubbles: true }));
            }, 0);
          }}
          isLoading={loading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-green-700 dark:text-green-200">
          ✅ Card added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Front (English) */}
        <div>
          <label htmlFor="front" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            English Text *
          </label>
          <input
            type="text"
            id="front"
            name="front"
            value={formData.front}
            onChange={handleInputChange}
            placeholder="e.g., hello"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 transition"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formData.front.length}/500
          </p>
        </div>

        {/* Back (Polish) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="back" className="block text-sm font-semibold text-gray-900 dark:text-white">
              Polish Text *
            </label>
            <button
              type="button"
              onClick={handleTranslate}
              disabled={loading || translating || !formData.front.trim()}
              className="text-xs px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition disabled:opacity-50"
            >
              {translating ? 'Translating...' : '🌐 Translate'}
            </button>
          </div>
          <input
            type="text"
            id="back"
            name="back"
            value={formData.back}
            onChange={handleInputChange}
            placeholder="e.g., cześć"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 transition"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formData.back.length}/500
          </p>
        </div>

        {/* Example (Optional) */}
        <div>
          <label htmlFor="example" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Example (Optional)
          </label>
          <textarea
            id="example"
            name="example"
            value={formData.example}
            onChange={handleInputChange}
            placeholder="e.g., Hello, how are you?"
            disabled={loading}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 transition resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {(formData.example || '').length}/1000
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={loading || translating}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 font-semibold"
          >
            {loading ? 'Adding...' : 'Add Card'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
