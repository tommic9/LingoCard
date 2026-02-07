/**
 * Story Generator Page - AI creates short stories using vocabulary words
 */

import { useState, useMemo } from 'react';
import { useAllCards } from '../hooks/useAllCards';
import { generateStory } from '../utils/ai-generator';
import type { StoryResult, GenerateError } from '../utils/ai-generator';

type Level = 'A1' | 'A2' | 'B1' | 'B2';

export function StoryGeneratorPage() {
  const { cards, loading: cardsLoading } = useAllCards();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [level, setLevel] = useState<Level>('B1');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<StoryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get unique words from all cards
  const availableWords = useMemo(() => {
    const words = cards.map((card) => card.front);
    return [...new Set(words)].sort();
  }, [cards]);

  const toggleWord = (word: string) => {
    setSelectedWords((prev) =>
      prev.includes(word)
        ? prev.filter((w) => w !== word)
        : prev.length < 15
          ? [...prev, word]
          : prev
    );
  };

  const selectRandom = () => {
    const count = Math.min(8, availableWords.length);
    const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
    setSelectedWords(shuffled.slice(0, count));
  };

  const handleGenerate = async () => {
    if (selectedWords.length === 0) {
      setError('Please select at least one word.');
      return;
    }

    if (generating) {
      return;
    }

    setGenerating(true);
    setError(null);
    setResult(null);

    try {
      const res = await generateStory(selectedWords, level);

      if ('error' in res) {
        setError((res as GenerateError).error);
      } else {
        setResult(res as StoryResult);
      }
    } catch {
      setError('Failed to generate story. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  /**
   * Highlight vocabulary words in the story text
   */
  const highlightWords = (text: string, words: string[]) => {
    if (words.length === 0) return text;

    // Create regex matching any of the selected words (case-insensitive, word boundaries)
    const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');

    const parts = text.split(regex);

    return parts.map((part, i) => {
      const isMatch = words.some(
        (w) => w.toLowerCase() === part.toLowerCase()
      );
      if (isMatch) {
        return (
          <span
            key={i}
            className="font-bold text-primary-700 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-1 rounded"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const levels: Level[] = ['A1', 'A2', 'B1', 'B2'];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Story Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create a short story using your vocabulary words
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
        {/* Level selector + Random button */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Level:
            </span>
            <div className="flex gap-1">
              {levels.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-3 py-1 text-sm font-semibold rounded transition ${
                    level === l
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={selectRandom}
            disabled={availableWords.length === 0}
            className="text-sm px-3 py-1 bg-accent-600 text-white rounded hover:bg-accent-700 transition disabled:opacity-50"
          >
            Select Random 8
          </button>
        </div>

        {/* Selected words */}
        {selectedWords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedWords.map((word) => (
              <button
                key={word}
                onClick={() => toggleWord(word)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800/40 transition"
              >
                {word}
                <span className="text-primary-500">×</span>
              </button>
            ))}
          </div>
        )}

        {/* Word list */}
        {cardsLoading ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            Loading your vocabulary...
          </div>
        ) : availableWords.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            No cards found. Add some vocabulary first!
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2">
            <div className="flex flex-wrap gap-1.5">
              {availableWords.map((word) => {
                const isSelected = selectedWords.includes(word);
                return (
                  <button
                    key={word}
                    onClick={() => toggleWord(word)}
                    className={`px-2.5 py-1 text-sm rounded-full transition ${
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={generating || selectedWords.length === 0}
          className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
        >
          {generating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating Story...
            </span>
          ) : (
            'Generate Story'
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Story result */}
      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Story
            </h2>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
            >
              Regenerate
            </button>
          </div>

          <div className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
            {highlightWords(result.story, selectedWords)}
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Generated via {result.source} model
          </div>
        </div>
      )}
    </div>
  );
}
