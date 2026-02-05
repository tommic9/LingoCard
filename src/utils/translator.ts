/**
 * Translation utility for English to Polish
 * Uses LibreTranslate API with local caching
 */

const LIBRETRANSLATE_API = 'https://libretranslate.com/translate';
const CACHE_MAX_SIZE = 100;
const TIMEOUT_MS = 5000;
const USE_MOCK_MODE = false; // Set to true for testing without API

interface CacheEntry {
  translatedText: string;
  timestamp: number;
}

interface TranslateResult {
  translatedText: string;
  source: 'libretranslate' | 'mock';
}

// LRU cache for translations
class TranslationCache {
  private cache = new Map<string, CacheEntry>();

  get(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Move to end (most recent)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.translatedText;
  }

  set(key: string, value: string): void {
    // Remove oldest if at capacity
    if (this.cache.size >= CACHE_MAX_SIZE) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      translatedText: value,
      timestamp: Date.now(),
    });
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}

let translationCache = new TranslationCache();

/**
 * Translate English text to Polish
 */
export async function translateEnglishToPolish(
  text: string
): Promise<TranslateResult | { error: string }> {
  if (!text || text.trim().length === 0) {
    return { error: 'Text is empty' };
  }

  // Check cache first
  const cached = translationCache.get(text);
  if (cached) {
    return {
      translatedText: cached,
      source: 'libretranslate',
    };
  }

  // Use mock mode for testing
  if (USE_MOCK_MODE) {
    return getMockTranslation(text);
  }

  try {
    const result = await translateViaLibreTranslate(text);
    if (result) {
      translationCache.set(text, result);
      return {
        translatedText: result,
        source: 'libretranslate',
      };
    }
  } catch (error) {
    console.error('Translation error:', error);
  }

  return { error: 'Translation failed. Please try again or enter manually.' };
}

/**
 * Call LibreTranslate API with timeout
 */
async function translateViaLibreTranslate(text: string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(LIBRETRANSLATE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: 'pl',
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json() as { translatedText?: string };
    return data.translatedText || null;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Translation timeout (network might be slow)');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Mock translation for testing
 */
function getMockTranslation(text: string): TranslateResult {
  // Simple mock mapping
  const mockTranslations: Record<string, string> = {
    hello: 'cześć',
    goodbye: 'do widzenia',
    'thank you': 'dziękuję',
    please: 'proszę',
    yes: 'tak',
    no: 'nie',
    water: 'woda',
    food: 'jedzenie',
    good: 'dobry',
    bad: 'zły',
  };

  const normalized = text.toLowerCase().trim();
  const translated = mockTranslations[normalized] || `[Polish: ${text}]`;

  return {
    translatedText: translated,
    source: 'mock',
  };
}

/**
 * Clear translation cache
 */
export function clearTranslationCache(): void {
  translationCache = new TranslationCache();
}
