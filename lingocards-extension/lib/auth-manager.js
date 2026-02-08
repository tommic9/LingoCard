/**
 * Authentication manager for Supabase
 * Handles sign in, sign out, and session management
 */

import { browser } from '../utils/browser-polyfill.js';
import { getSupabase } from './supabase-client.js';
import { storage } from '../utils/storage.js';

export const authManager = {
  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Session data
   */
  async signIn(email, password) {
    const supabase = await getSupabase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // Parse errors like in LoginPage.tsx
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Nieprawidłowy email lub hasło');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Potwierdź swój adres email. Sprawdź skrzynkę pocztową.');
      }
      throw new Error(error.message);
    }

    return data; // { session, user }
  },

  /**
   * Sign out current user
   */
  async signOut() {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
    await storage.clearSession();
  },

  /**
   * Get current user from stored session
   * Checks if token is still valid
   * @returns {Promise<Object|null>} User object or null
   */
  async getUser() {
    const session = await storage.getSession();
    if (!session) return null;

    // Check if token expired
    const expiresAt = session.expires_at * 1000; // Convert to ms
    if (Date.now() > expiresAt) {
      // Token expired, sign out
      await this.signOut();
      return null;
    }

    return session.user;
  },

  /**
   * Get current session with token
   * @returns {Promise<Object|null>} Session or null
   */
  async getSession() {
    const session = await storage.getSession();
    if (!session) return null;

    // Check if token expired
    const expiresAt = session.expires_at * 1000;
    if (Date.now() > expiresAt) {
      await this.signOut();
      return null;
    }

    return session;
  },

  /**
   * Set session in Supabase client and storage
   * @param {Object} session - Session object
   */
  async setSession(session) {
    const supabase = await getSupabase();

    // Set session in Supabase client for authenticated requests
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token
    });

    // Store in extension storage
    await storage.setSession(session);
  }
};
