/**
 * Generate unique ID in LingoCards format
 * Format: timestamp-random (e.g., 1234567890123-abc123def)
 * @returns {string} Unique ID
 */
export function generateId() {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 11); // 9 chars
  return `${timestamp}-${randomStr}`;
}
