/**
 * Background service worker for Chrome (Manifest V3)
 * Bundled version without ES modules
 */

// Browser polyfill
const browser = globalThis.chrome;

// Constants
const NOTIFICATION_ID = 'lingocards-status';
const SUPABASE_URL = 'https://qhnyqajcijojpuufxyrn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobnlxYWpjaWpvanB1dWZ4eXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTQyOTYsImV4cCI6MjA4NTg5MDI5Nn0.Eu2KX_yRkFqROZLUXg3Z012AG9eJk3Vk1EFXD_Q2vOw';

// Import Supabase from local file using importScripts
importScripts('../lib/supabase.umd.js');

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Storage utilities
const storage = {
  async getSession() {
    const result = await browser.storage.local.get('lingocards_session');
    return result.lingocards_session || null;
  },

  async setSession(session) {
    await browser.storage.local.set({ lingocards_session: session });
  },

  async clearSession() {
    await browser.storage.local.remove('lingocards_session');
  }
};

// Auth manager
const authManager = {
  async getUser() {
    console.log('[Auth] Getting user...');
    const session = await storage.getSession();
    console.log('[Auth] Session from storage:', session);

    if (!session) {
      console.log('[Auth] No session found');
      return null;
    }

    const expiresAt = session.expires_at * 1000;
    console.log('[Auth] Session expires at:', new Date(expiresAt));
    console.log('[Auth] Current time:', new Date(Date.now()));

    if (Date.now() > expiresAt) {
      console.log('[Auth] Session expired');
      await this.signOut();
      return null;
    }

    console.log('[Auth] User:', session.user);
    return session.user;
  },

  async getSession() {
    const session = await storage.getSession();
    if (!session) return null;

    const expiresAt = session.expires_at * 1000;
    if (Date.now() > expiresAt) {
      await this.signOut();
      return null;
    }

    return session;
  },

  async signOut() {
    await supabaseClient.auth.signOut();
    await storage.clearSession();
  }
};

// Translator
const translator = {
  async translate(text, sourceLang = 'en', targetLang = 'pl') {
    try {
      // Try MyMemory API first
      const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
      const response = await fetch(myMemoryUrl);
      const data = await response.json();

      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        return data.responseData.translatedText;
      }

      // Fallback to LibreTranslate
      const libreResponse = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text'
        })
      });

      const libreData = await libreResponse.json();
      if (libreData.translatedText) {
        return libreData.translatedText;
      }

      throw new Error('Translation failed');
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Nie udało się przetłumaczyć tekstu');
    }
  }
};

// Notification helper
function showNotification(title, message) {
  browser.notifications.create(NOTIFICATION_ID, {
    type: 'basic',
    iconUrl: '../icons/icon-48.png',
    title: title,
    message: message,
    priority: 2
  });
}

// Create context menu on install
browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: 'add-to-lingocards',
    title: 'Dodaj do LingoCards',
    contexts: ['selection']
  });
  console.log('LingoCards Helper: Context menu created');
});

// Handle context menu click
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log('[Context Menu] Clicked!', info);

  if (info.menuItemId !== 'add-to-lingocards') return;

  const selectedText = info.selectionText?.trim();
  console.log('[Context Menu] Selected text:', selectedText);

  if (!selectedText) {
    showNotification('Błąd', 'Nie zaznaczono tekstu');
    return;
  }

  // Check authentication
  const user = await authManager.getUser();
  console.log('[Context Menu] User:', user);

  if (!user) {
    showNotification('Wymagane logowanie', 'Zaloguj się w rozszerzeniu');
    return;
  }

  showNotification('LingoCards', 'Tłumaczenie i przygotowanie...');

  try {
    const session = await authManager.getSession();
    if (!session) throw new Error('Sesja wygasła. Zaloguj się ponownie.');

    console.log('[Context Menu] Translating...');
    const translation = await translator.translate(selectedText, 'en', 'pl');
    console.log('[Context Menu] Translation:', translation);

    const appUrl = new URL('https://lingocards.netlify.app/add');
    appUrl.searchParams.set('front', selectedText);
    appUrl.searchParams.set('back', translation);
    appUrl.searchParams.set('source', 'extension');

    console.log('[Context Menu] Opening URL:', appUrl.toString());
    await browser.tabs.create({ url: appUrl.toString() });

    showNotification('Gotowe!', `Przygotowano: "${selectedText}" → "${translation}"`);
  } catch (error) {
    console.error('[Context Menu] Error:', error);
    showNotification('Błąd', error.message || 'Spróbuj ponownie.');
  }
});
