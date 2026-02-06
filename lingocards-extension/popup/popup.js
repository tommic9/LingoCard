/**
 * Popup script - handles login/logout and dashboard display
 */

import { authManager } from '../lib/auth-manager.js';
import { storage } from '../utils/storage.js';

// DOM elements
let loginScreen;
let dashboardScreen;
let loadingScreen;
let loginForm;
let emailInput;
let passwordInput;
let loginButton;
let errorMessage;
let userEmailText;
let cardsCount;
let logoutButton;

// Debug: Check if Supabase is loaded
console.log('[Popup] window.supabase:', window.supabase);
console.log('[Popup] window.supabase.createClient:', window.supabase?.createClient);

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[Popup] DOMContentLoaded fired');

  // Get DOM elements
  loginScreen = document.getElementById('login-screen');
  dashboardScreen = document.getElementById('dashboard-screen');
  loadingScreen = document.getElementById('loading-screen');
  loginForm = document.getElementById('login-form');
  emailInput = document.getElementById('email');
  passwordInput = document.getElementById('password');
  loginButton = document.getElementById('login-button');
  errorMessage = document.getElementById('error-message');
  userEmailText = document.getElementById('user-email-text');
  cardsCount = document.getElementById('cards-count');
  logoutButton = document.getElementById('logout-button');

  // Set up event listeners
  loginForm.addEventListener('submit', handleLogin);
  logoutButton.addEventListener('click', handleLogout);

  // Check authentication and show appropriate screen
  await checkAuthAndShowScreen();
});

/**
 * Check authentication status and show appropriate screen
 */
async function checkAuthAndShowScreen() {
  showScreen('loading');

  try {
    const user = await authManager.getUser();

    if (user) {
      // User is logged in, show dashboard
      await showDashboard(user);
    } else {
      // User is not logged in, show login form
      showScreen('login');
    }
  } catch (error) {
    console.error('Error checking auth:', error);
    showScreen('login');
  }
}

/**
 * Handle login form submission
 */
async function handleLogin(event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Validate inputs
  if (!email || !password) {
    showError('Wprowadź email i hasło');
    return;
  }

  // Disable form
  setFormLoading(true);
  hideError();

  try {
    // Sign in with Supabase
    const { session, user } = await authManager.signIn(email, password);

    if (!session || !user) {
      throw new Error('Nie udało się zalogować');
    }

    // Store session
    await authManager.setSession(session);

    // Show dashboard
    await showDashboard(user);

  } catch (error) {
    console.error('Login error:', error);
    showError(error.message || 'Nie udało się zalogować. Spróbuj ponownie.');
    setFormLoading(false);
  }
}

/**
 * Handle logout
 */
async function handleLogout() {
  try {
    await authManager.signOut();

    // Clear form
    loginForm.reset();
    hideError();

    // Show login screen
    showScreen('login');

  } catch (error) {
    console.error('Logout error:', error);
  }
}

/**
 * Show dashboard with user data
 */
async function showDashboard(user) {
  // Set user email
  userEmailText.textContent = user.email;

  // Get and display stats
  const stats = await storage.getStats();
  cardsCount.textContent = stats.cardsAdded || 0;

  // Show dashboard screen
  showScreen('dashboard');
}

/**
 * Show specific screen
 */
function showScreen(screenName) {
  loginScreen.style.display = 'none';
  dashboardScreen.style.display = 'none';
  loadingScreen.style.display = 'none';

  switch (screenName) {
    case 'login':
      loginScreen.style.display = 'block';
      break;
    case 'dashboard':
      dashboardScreen.style.display = 'block';
      break;
    case 'loading':
      loadingScreen.style.display = 'flex';
      break;
  }
}

/**
 * Show error message
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
}

/**
 * Hide error message
 */
function hideError() {
  errorMessage.textContent = '';
  errorMessage.classList.remove('show');
}

/**
 * Set form loading state
 */
function setFormLoading(loading) {
  loginButton.disabled = loading;
  emailInput.disabled = loading;
  passwordInput.disabled = loading;
  loginButton.textContent = loading ? 'Logowanie...' : 'Zaloguj się';
}
