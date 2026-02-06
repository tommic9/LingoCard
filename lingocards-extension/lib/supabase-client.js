/**
 * Supabase client for Firefox extension
 * Uses the same Supabase project as the web app
 */

// Import from CDN (will be loaded in HTML)
// Using dynamic import to avoid loading issues
let supabaseInstance = null;

/**
 * Initialize and get Supabase client
 * @returns {Object} Supabase client instance
 */
export async function getSupabase() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Wait for Supabase to load if not ready yet
  let retries = 0;
  while ((!window.supabase || !window.supabase.createClient) && retries < 10) {
    await new Promise(resolve => setTimeout(resolve, 100));
    retries++;
  }

  // Check if Supabase is loaded
  if (!window.supabase || !window.supabase.createClient) {
    console.error('window.supabase:', window.supabase);
    throw new Error('Supabase client not loaded. Make sure supabase-js CDN script is included in HTML.');
  }

  const SUPABASE_URL = 'https://qhnyqajcijojpuufxyrn.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobnlxYWpjaWpvanB1dWZ4eXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTQyOTYsImV4cCI6MjA4NTg5MDI5Nn0.Eu2KX_yRkFqROZLUXg3Z012AG9eJk3Vk1EFXD_Q2vOw';

  supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,  // Extension manages session manually
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  return supabaseInstance;
}
