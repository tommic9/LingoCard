/**
 * Storage wrapper for browser.storage.local
 * Manages session and stats persistence
 */

import { browser } from './browser-polyfill.js';

const STORAGE_KEYS = {
  SESSION: 'lingocards_session',
  STATS: 'lingocards_stats'
};

export const storage = {
  /**
   * Get stored session
   * @returns {Promise<Object|null>} Session object or null
   */
  async getSession() {
    const result = await browser.storage.local.get(STORAGE_KEYS.SESSION);
    return result[STORAGE_KEYS.SESSION] || null;
  },

  /**
   * Store session
   * @param {Object} session - Supabase session object
   */
  async setSession(session) {
    await browser.storage.local.set({
      [STORAGE_KEYS.SESSION]: session
    });
  },

  /**
   * Clear stored session
   */
  async clearSession() {
    await browser.storage.local.remove(STORAGE_KEYS.SESSION);
  },

  /**
   * Increment cards added counter
   */
  async incrementCardsAdded() {
    const stats = await this.getStats();
    stats.cardsAdded = (stats.cardsAdded || 0) + 1;
    await browser.storage.local.set({
      [STORAGE_KEYS.STATS]: stats
    });
  },

  /**
   * Get stats
   * @returns {Promise<Object>} Stats object with cardsAdded count
   */
  async getStats() {
    const result = await browser.storage.local.get(STORAGE_KEYS.STATS);
    return result[STORAGE_KEYS.STATS] || { cardsAdded: 0 };
  }
};
