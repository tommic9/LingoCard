/**
 * Translation utility for English to Polish
 * Uses MyMemory API (primary) with LibreTranslate fallback
 * Includes local LRU caching (max 100 entries)
 */

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';
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
  source: 'mymemory' | 'libretranslate' | 'cache' | 'mock';
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
 * Tries: Cache → Mock Mode → MyMemory API → LibreTranslate API → Error
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
      source: 'cache',
    };
  }

  // Use mock mode for testing
  if (USE_MOCK_MODE) {
    return getMockTranslation(text);
  }

  // Try MyMemory API (primary - free, 50k chars/day)
  try {
    const result = await translateViaMyMemory(text);
    if (result) {
      translationCache.set(text, result);
      return {
        translatedText: result,
        source: 'mymemory',
      };
    }
  } catch (error) {
    console.warn('MyMemory translation failed, trying LibreTranslate fallback:', error);
  }

  // Fallback to LibreTranslate
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
    console.error('LibreTranslate translation also failed:', error);
  }

  return { error: 'Translation failed. Please try again or enter manually.' };
}

/**
 * Call MyMemory API with timeout
 * Free translation service, 50k chars/day limit (without email)
 */
async function translateViaMyMemory(text: string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const params = new URLSearchParams({
      q: text,
      langpair: 'en|pl',
    });

    const response = await fetch(`${MYMEMORY_API}?${params}`, {
      method: 'GET',
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    interface MyMemoryResponse {
      responseStatus: number;
      quotaFinished?: boolean;
      responseData?: {
        translatedText?: string;
      };
    }

    const data = await response.json() as MyMemoryResponse;

    if (data.quotaFinished) {
      throw new Error('MyMemory daily quota exceeded');
    }

    if (data.responseStatus !== 200) {
      throw new Error(`MyMemory error: status ${data.responseStatus}`);
    }

    return data.responseData?.translatedText || null;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Translation timeout');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
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
