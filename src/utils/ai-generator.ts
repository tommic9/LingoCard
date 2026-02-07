/**
 * AI Example Generator using Hugging Face Inference API
 *
 * Features:
 * - LRU cache (200 entries) with localStorage persistence
 * - Primary model: Mistral-7B-Instruct-v0.2 (instruction following, multilingual)
 * - Fallback model: Flan-T5-Base (faster, more reliable)
 * - Hybrid API key: Shared env key + optional user custom key
 * - 10s timeout (text generation slower than translation)
 * - Comprehensive error handling (rate limits, cold starts, network errors)
 */

// Configuration
const HF_API_BASE = 'https://api-inference.huggingface.co/models';
const PRIMARY_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2';
const FALLBACK_MODEL = 'google/flan-t5-base';
const TIMEOUT_MS = 10000; // 10 seconds
const MAX_CACHE_SIZE = 200;
const USE_MOCK_MODE = false; // Set to true for testing without API calls

// localStorage keys
const STORAGE_KEY_API_KEY = 'lingocards-hf-api-key';
const STORAGE_KEY_CACHE = 'lingocards-example-cache';

// Types
export interface GenerateResult {
  example: string;
  source: 'mistral' | 'flan-t5' | 'cache' | 'mock';
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

  /**
   * Get example from cache
   */
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

  /**
   * Store example in cache
   */
  set(key: string, value: string): void {
    const normalized = this.normalizeKey(key);

    // Remove if exists (to update position)
    if (this.cache.has(normalized)) {
      this.cache.delete(normalized);
    }

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    // Add new entry
    this.cache.set(normalized, {
      example: value,
      timestamp: Date.now(),
    });

    // Persist to localStorage
    this.saveToStorage();
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    return this.cache.has(this.normalizeKey(key));
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.saveToStorage();
  }

  /**
   * Normalize cache key (lowercase, trim)
   */
  private normalizeKey(key: string): string {
    return key.toLowerCase().trim();
  }

  /**
   * Load cache from localStorage
   */
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

  /**
   * Save cache to localStorage
   */
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
  // Check for custom user key first
  const customKey = localStorage.getItem(STORAGE_KEY_API_KEY);
  if (customKey) {
    return customKey;
  }

  // Fallback to shared env key
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
 * Build prompt for Mistral model (instruction-following)
 */
function buildMistralPrompt(word: string, translation?: string): string {
  const contextNote = translation ? ` (Polish: ${translation})` : '';

  return `[INST] Create a simple English example sentence using the word "${word}"${contextNote}.
The sentence should:
- Be 1 sentence only
- Use natural, conversational English
- Include the word in a clear context
- Be appropriate for language learners (A1-B2 level)

Example sentence: [/INST]`;
}

/**
 * Build prompt for Flan-T5 model (task-based)
 */
function buildFlanT5Prompt(word: string): string {
  return `Write a simple example sentence using the word "${word}". Sentence:`;
}

/**
 * Call Hugging Face Inference API
 */
async function callHuggingFaceAPI(
  model: string,
  prompt: string,
  apiKey: string,
  signal: AbortSignal
): Promise<string> {
  const response = await fetch(`${HF_API_BASE}/${model}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_length: 100,
        temperature: 0.7,
        do_sample: true,
      },
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

  // Handle different response formats
  if (Array.isArray(data) && data.length > 0) {
    return data[0].generated_text || '';
  }

  if (typeof data === 'object' && data.generated_text) {
    return data.generated_text;
  }

  throw new Error('Unexpected API response format');
}

/**
 * Generate example using Mistral model (primary)
 */
async function generateViaMistral(
  word: string,
  translation?: string,
  signal?: AbortSignal
): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  try {
    const prompt = buildMistralPrompt(word, translation);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const combinedSignal = signal || controller.signal;

    try {
      const result = await callHuggingFaceAPI(
        PRIMARY_MODEL,
        prompt,
        apiKey,
        combinedSignal
      );

      clearTimeout(timeoutId);

      // Extract sentence from response (Mistral includes prompt in output)
      const sentence = result.split('[/INST]').pop()?.trim() || result.trim();

      // Clean up any remaining artifacts
      return sentence
        .replace(/^(Example sentence:|Sentence:)\s*/i, '')
        .trim();
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Mistral generation failed:', error);
    return null;
  }
}

/**
 * Generate example using Flan-T5 model (fallback)
 */
async function generateViaFlanT5(
  word: string,
  signal?: AbortSignal
): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  try {
    const prompt = buildFlanT5Prompt(word);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const combinedSignal = signal || controller.signal;

    try {
      const result = await callHuggingFaceAPI(
        FALLBACK_MODEL,
        prompt,
        apiKey,
        combinedSignal
      );

      clearTimeout(timeoutId);

      // Clean up Flan-T5 response
      return result
        .replace(/^(Sentence:|Write a simple example sentence.*?:)\s*/i, '')
        .trim();
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Flan-T5 generation failed:', error);
    return null;
  }
}

/**
 * Handle Hugging Face API errors and return user-friendly messages
 */
function handleHuggingFaceError(error: unknown): GenerateError {
  // Timeout/abort errors
  if (error instanceof Error && error.name === 'AbortError') {
    return {
      error: 'Request timed out. The AI model may be loading. Please try again.',
    };
  }

  // HTTP errors
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status: number }).status;

    switch (status) {
      case 401:
      case 403:
        return {
          error: 'Invalid API key. Please check your settings.',
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

  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      error: 'Network error. Please check your connection.',
    };
  }

  // Generic error
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
  // Validate input
  if (!word || !word.trim()) {
    return { error: 'Please enter a word first.' };
  }

  const trimmedWord = word.trim();

  // Mock mode for testing
  if (USE_MOCK_MODE) {
    console.log('[Mock Mode] Generating example for:', trimmedWord);
    return getMockExample(trimmedWord);
  }

  // Check cache first
  const cached = cache.get(trimmedWord);
  if (cached) {
    console.log('[Cache Hit] Using cached example for:', trimmedWord);
    return {
      example: cached,
      source: 'cache',
    };
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

    // Try primary model (Mistral)
    let example = await generateViaMistral(trimmedWord, translation);
    let source: 'mistral' | 'flan-t5' = 'mistral';

    // Fallback to secondary model (Flan-T5) if primary fails
    if (!example) {
      console.log('[Fallback] Trying Flan-T5 model...');
      example = await generateViaFlanT5(trimmedWord);
      source = 'flan-t5';
    }

    // If both models fail, return error
    if (!example) {
      return {
        error: 'Failed to generate example. Please try again or write one manually.',
      };
    }

    // Store in cache
    cache.set(trimmedWord, example);

    console.log(`[Success] Generated via ${source}:`, example);

    return {
      example,
      source,
    };
  } catch (error) {
    console.error('[AI Generation Error]', error);
    return handleHuggingFaceError(error);
  }
}
