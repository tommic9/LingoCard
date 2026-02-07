/**
 * AI Example Generator using Hugging Face Inference Providers (Chat Completions API)
 *
 * Features:
 * - Uses OpenAI-compatible chat completions endpoint (router.huggingface.co/v1)
 * - LRU cache (200 entries) with localStorage persistence
 * - Primary model: Llama-3.2-1B-Instruct (fast, free tier)
 * - Fallback model: Qwen2.5-1.5B-Instruct
 * - Hybrid API key: Shared env key + optional user custom key
 * - 10s timeout with comprehensive error handling
 */

// Configuration
const HF_CHAT_API = 'https://router.huggingface.co/v1/chat/completions';
const PRIMARY_MODEL = 'meta-llama/Llama-3.2-1B-Instruct';
const FALLBACK_MODEL = 'Qwen/Qwen2.5-1.5B-Instruct';
const TIMEOUT_MS = 10000; // 10 seconds
const MAX_CACHE_SIZE = 200;
const USE_MOCK_MODE = false; // Set to true for testing without API calls

// localStorage keys
const STORAGE_KEY_API_KEY = 'lingocards-hf-api-key';
const STORAGE_KEY_CACHE = 'lingocards-example-cache';

// Types
export interface GenerateResult {
  example: string;
  source: 'primary' | 'fallback' | 'cache' | 'mock';
}

export interface GenerateError {
  error: string;
}

interface CacheEntry {
  example: string;
  timestamp: number;
}

/**
 * LRU Cache for generated examples with localStorage persistence
 */
class ExampleCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = MAX_CACHE_SIZE;

  constructor() {
    this.loadFromStorage();
  }

  get(key: string): string | null {
    const normalized = this.normalizeKey(key);
    const entry = this.cache.get(normalized);

    if (!entry) {
      return null;
    }

    // Move to end (most recently used)
    this.cache.delete(normalized);
    this.cache.set(normalized, entry);

    return entry.example;
  }

  set(key: string, value: string): void {
    const normalized = this.normalizeKey(key);

    if (this.cache.has(normalized)) {
      this.cache.delete(normalized);
    }

    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(normalized, {
      example: value,
      timestamp: Date.now(),
    });

    this.saveToStorage();
  }

  clear(): void {
    this.cache.clear();
    this.saveToStorage();
  }

  private normalizeKey(key: string): string {
    return key.toLowerCase().trim();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CACHE);
      if (!stored) return;

      const data = JSON.parse(stored) as Array<[string, CacheEntry]>;
      this.cache = new Map(data);
    } catch (error) {
      console.error('Failed to load example cache from localStorage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = Array.from(this.cache.entries());
      localStorage.setItem(STORAGE_KEY_CACHE, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save example cache to localStorage:', error);
    }
  }
}

// Global cache instance
const cache = new ExampleCache();

/**
 * Get API key (custom user key or shared env key)
 */
function getApiKey(): string | null {
  const customKey = localStorage.getItem(STORAGE_KEY_API_KEY);
  if (customKey) {
    return customKey;
  }

  const sharedKey = import.meta.env.VITE_HF_API_KEY;
  return sharedKey || null;
}

/**
 * Check if using custom API key
 */
export function isUsingCustomKey(): boolean {
  return localStorage.getItem(STORAGE_KEY_API_KEY) !== null;
}

/**
 * Save custom API key to localStorage
 */
export function saveCustomApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
}

/**
 * Clear custom API key from localStorage
 */
export function clearCustomApiKey(): void {
  localStorage.removeItem(STORAGE_KEY_API_KEY);
}

/**
 * Clear example cache
 */
export function clearExampleCache(): void {
  cache.clear();
}

/**
 * Build chat message for example generation
 */
function buildUserMessage(word: string, translation?: string): string {
  const contextNote = translation ? ` (Polish: ${translation})` : '';
  return `Write one simple English example sentence using the word "${word}"${contextNote}. The sentence should use natural, conversational English appropriate for language learners. Only output the sentence, nothing else.`;
}

/**
 * Call HF Chat Completions API (OpenAI-compatible)
 */
async function callChatAPI(
  model: string,
  word: string,
  translation: string | undefined,
  apiKey: string,
  signal: AbortSignal
): Promise<string> {
  const response = await fetch(HF_CHAT_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: buildUserMessage(word, translation),
        },
      ],
      max_tokens: 60,
      temperature: 0.7,
    }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      statusText: response.statusText,
      data: errorData,
    };
  }

  const data = await response.json();

  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('Unexpected API response format');
  }

  // Clean up: remove quotes, trailing whitespace
  return text.replace(/^["']|["']$/g, '').trim();
}

/**
 * Generate example using a specific model with timeout
 */
async function generateWithModel(
  model: string,
  word: string,
  translation?: string
): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const result = await callChatAPI(
      model,
      word,
      translation,
      apiKey,
      controller.signal
    );
    return result;
  } catch (error) {
    console.error(`${model} generation failed:`, error);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Handle Hugging Face API errors and return user-friendly messages
 */
function handleHuggingFaceError(error: unknown): GenerateError {
  if (error instanceof Error && error.name === 'AbortError') {
    return {
      error: 'Request timed out. The AI model may be loading. Please try again.',
    };
  }

  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status: number }).status;

    switch (status) {
      case 401:
      case 403:
        return {
          error: 'Invalid API key or missing permissions. Check your HuggingFace token has "Inference Providers" permission enabled.',
        };
      case 429:
        return {
          error: 'Rate limit exceeded. Try again in a few minutes or use your own API key in Settings.',
        };
      case 503:
        return {
          error: 'AI model is loading (this can take 20-30 seconds). Please try again.',
        };
      default:
        return {
          error: 'Failed to generate example. Please try again or write one manually.',
        };
    }
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      error: 'Network error. Please check your connection.',
    };
  }

  return {
    error: 'Failed to generate example. Please try again or write one manually.',
  };
}

/**
 * Get mock example for testing
 */
function getMockExample(word: string): GenerateResult {
  const examples = [
    `I love eating ${word} for breakfast.`,
    `The ${word} was delicious and fresh.`,
    `She bought a ${word} at the market.`,
    `Can you pass me the ${word}, please?`,
    `This ${word} is my favorite.`,
  ];

  const randomExample = examples[Math.floor(Math.random() * examples.length)];

  return {
    example: randomExample,
    source: 'mock',
  };
}

/**
 * Generate example sentence for a word
 *
 * @param word - English word to generate example for
 * @param translation - Optional Polish translation (helps with context)
 * @returns Generated example or error
 */
export async function generateExample(
  word: string,
  translation?: string
): Promise<GenerateResult | GenerateError> {
  if (!word || !word.trim()) {
    return { error: 'Please enter a word first.' };
  }

  const trimmedWord = word.trim();

  if (USE_MOCK_MODE) {
    return getMockExample(trimmedWord);
  }

  // Check cache first
  const cached = cache.get(trimmedWord);
  if (cached) {
    console.log('[Cache Hit] Example for:', trimmedWord);
    return { example: cached, source: 'cache' };
  }

  // Check API key
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      error: 'AI example generation requires an API key. Add one in Settings.',
    };
  }

  try {
    console.log('[AI Generation] Generating example for:', trimmedWord);

    // Try primary model
    let example = await generateWithModel(PRIMARY_MODEL, trimmedWord, translation);
    let source: 'primary' | 'fallback' = 'primary';

    // Fallback to secondary model
    if (!example) {
      console.log('[Fallback] Trying fallback model...');
      example = await generateWithModel(FALLBACK_MODEL, trimmedWord, translation);
      source = 'fallback';
    }

    if (!example) {
      return {
        error: 'Failed to generate example. Please try again or write one manually.',
      };
    }

    // Store in cache
    cache.set(trimmedWord, example);
    console.log(`[Success] Generated via ${source}:`, example);

    return { example, source };
  } catch (error) {
    console.error('[AI Generation Error]', error);
    return handleHuggingFaceError(error);
  }
}
