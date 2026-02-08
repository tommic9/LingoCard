/**
 * CardForm component - Manual card entry form
 */

import { useState, useEffect, useRef } from 'react';
import type { Card } from '../../types';
import { useCardManagement } from '../../hooks/useCardManagement';
import { translateEnglishToPolish } from '../../utils/translator';
import { generateExample, generateDefinition } from '../../utils/ai-generator';
import { DuplicateWarning } from './DuplicateWarning';
import { SynonymActionModal } from './SynonymActionModal';

interface CardFormProps {
  onCardCreated?: (card: Card) => void;
  onCancel?: () => void;
  initialValues?: Partial<FormData>;
}

interface FormData {
  front: string;
  back: string;
  example?: string;
}

export function CardForm({ onCardCreated, onCancel, initialValues }: CardFormProps) {
  const { createCard, checkDuplicateCard } = useCardManagement();
  const [formData, setFormData] = useState<FormData>({
    front: initialValues?.front || '',
    back: initialValues?.back || '',
    example: initialValues?.example || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingDefinition, setGeneratingDefinition] = useState(false);
  const [definition, setDefinition] = useState<string | null>(null);
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [selectedSynonym, setSelectedSynonym] = useState<string | null>(null);
  const [duplicateCard, setDuplicateCard] = useState<Card | null>(null);
  const [allowDuplicate, setAllowDuplicate] = useState(false);

  // Ref for example textarea (auto-focus when from extension)
  const exampleRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on example field if initial values are provided
  useEffect(() => {
    if (initialValues?.front && initialValues?.back && exampleRef.current) {
      // Small delay to ensure rendering is complete
      setTimeout(() => {
        exampleRef.current?.focus();
      }, 100);
    }
  }, [initialValues]);

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

  const handleGenerateExample = async () => {
    if (!formData.front.trim()) {
      setError('Please enter English text first');
      return;
    }

    if (generating || generatingDefinition) {
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const result = await generateExample(
        formData.front,
        formData.back || undefined
      );

      if ('error' in result) {
        setError(result.error);
      } else {
        setFormData((prev) => ({
          ...prev,
          example: result.example,
        }));
      }
    } catch (err) {
      setError('Failed to generate example. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateDefinition = async () => {
    if (!formData.front.trim()) {
      setError('Please enter English text first');
      return;
    }

    if (generating || generatingDefinition) {
      return;
    }

    setGeneratingDefinition(true);
    setError(null);

    try {
      const result = await generateDefinition(
        formData.front,
        formData.back || undefined
      );

      if ('error' in result) {
        setError(result.error);
      } else {
        setDefinition(result.definition);
        setSynonyms(result.synonyms);
      }
    } catch (err) {
      setError('Failed to generate definition. Please try again.');
    } finally {
      setGeneratingDefinition(false);
    }
  };

  const handleSaveAndAddNew = async () => {
    if (!selectedSynonym) return;

    // Check if form is valid before saving
    if (!validateForm()) {
      setSelectedSynonym(null);
      return;
    }

    // Create current card
    setLoading(true);
    setError(null);

    try {
      await createCard({
        front: formData.front.trim(),
        back: formData.back.trim(),
        example: formData.example && formData.example.trim().length > 0 ? formData.example.trim() : undefined,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReviewDate: new Date(),
      });

      // Load synonym in fresh form
      setFormData({ front: selectedSynonym, back: '', example: '' });
      setDefinition(null);
      setSynonyms([]);
      setSelectedSynonym(null);
      setAllowDuplicate(false);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create card');
    } finally {
      setLoading(false);
    }
  };

  const handleReplace = () => {
    if (!selectedSynonym) return;

    // Replace current form with synonym
    setFormData({ front: selectedSynonym, back: '', example: '' });
    setDefinition(null);
    setSynonyms([]);
    setSelectedSynonym(null);
  };

  const handleCopy = () => {
    if (!selectedSynonym) return;

    navigator.clipboard.writeText(selectedSynonym);
    setSelectedSynonym(null);
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
      setDefinition(null);
      setSynonyms([]);
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
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="example" className="block text-sm font-semibold text-gray-900 dark:text-white">
              Example (Optional)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleGenerateExample}
                disabled={loading || generating || !formData.front.trim()}
                className="text-xs px-3 py-1 bg-accent-600 text-white rounded hover:bg-accent-700 transition disabled:opacity-50"
              >
                {generating ? 'Generating...' : '✨ Example'}
              </button>
              <button
                type="button"
                onClick={handleGenerateDefinition}
                disabled={loading || generatingDefinition || !formData.front.trim()}
                className="text-xs px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition disabled:opacity-50"
              >
                {generatingDefinition ? 'Loading...' : '📖 Definition'}
              </button>
            </div>
          </div>
          <textarea
            ref={exampleRef}
            id="example"
            name="example"
            value={formData.example}
            onChange={handleInputChange}
            placeholder="e.g., Hello, how are you?"
            disabled={loading || generating}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 transition resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {(formData.example || '').length}/1000
          </p>

          {/* Definition & Synonyms Display */}
          {(definition || synonyms.length > 0) && (
            <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg space-y-2">
              {definition && (
                <p className="text-sm text-purple-900 dark:text-purple-200">
                  <span className="font-semibold">📖 Definition:</span> {definition}
                </p>
              )}
              {synonyms.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-purple-900 dark:text-purple-200">🔗 Synonyms:</span>
                  {synonyms.map((synonym) => (
                    <button
                      key={synonym}
                      type="button"
                      onClick={() => setSelectedSynonym(synonym)}
                      title="Click to add as new card"
                      className="text-xs px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full hover:bg-purple-300 dark:hover:bg-purple-700 transition cursor-pointer"
                    >
                      {synonym}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={loading || translating || generating}
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

      {/* Synonym Action Modal */}
      {selectedSynonym && (
        <SynonymActionModal
          synonym={selectedSynonym}
          currentWord={formData.front}
          isCurrentFormValid={formData.front.trim() !== '' && formData.back.trim() !== ''}
          onSaveAndAddNew={handleSaveAndAddNew}
          onReplace={handleReplace}
          onCopy={handleCopy}
          onClose={() => setSelectedSynonym(null)}
        />
      )}
    </div>
  );
}
