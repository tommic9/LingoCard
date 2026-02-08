/**
 * Translation service
 * Primary: MyMemory API (50k chars/day)
 * Fallback: LibreTranslate
 */

export const translator = {
  /**
   * Translate text from source to target language
   * @param {string} text - Text to translate
   * @param {string} sourceLang - Source language code (default: 'en')
   * @param {string} targetLang - Target language code (default: 'pl')
   * @returns {Promise<string>} Translated text
   */
  async translate(text, sourceLang = 'en', targetLang = 'pl') {
    // Try MyMemory first
    try {
      const params = new URLSearchParams({
        q: text,
        langpair: `${sourceLang}|${targetLang}`
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(
        `https://api.mymemory.translated.net/get?${params}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('MyMemory API error');
      }

      const data = await response.json();

      if (data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
      }

      throw new Error('MyMemory failed');

    } catch (myMemoryError) {
      console.warn('MyMemory translation failed, trying LibreTranslate:', myMemoryError.message);

      // Fallback to LibreTranslate
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('https://libretranslate.com/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: targetLang,
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('LibreTranslate API error');
        }

        const data = await response.json();

        if (data.translatedText) {
          return data.translatedText;
        }

        throw new Error('LibreTranslate failed');

      } catch (libreError) {
        console.error('LibreTranslate translation failed:', libreError.message);
        throw new Error('Nie udało się przetłumaczyć słowa. Sprawdź połączenie internetowe.');
      }
    }
  }
};
