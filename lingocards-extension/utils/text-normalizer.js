/**
 * Normalize text for duplicate detection
 * Removes diacritics, converts to lowercase, trims whitespace
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
export function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')                    // Unicode decomposition
    .replace(/[\u0300-\u036f]/g, '');   // Remove diacritics
}
