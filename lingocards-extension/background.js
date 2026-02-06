/**
 * Background service worker
 * Handles context menu and card creation
 */

import { authManager } from './lib/auth-manager.js';
import { translator } from './lib/translator.js';
import { cardService } from './lib/card-service.js';
import { storage } from './utils/storage.js';

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
  if (info.menuItemId !== 'add-to-lingocards') {
    return;
  }

  const selectedText = info.selectionText?.trim();
  if (!selectedText) {
    showNotification('Błąd', 'Nie zaznaczono tekstu');
    return;
  }

  // Check authentication
  const user = await authManager.getUser();
  if (!user) {
    showNotification('Wymagane logowanie', 'Zaloguj się w rozszerzeniu aby dodać słówko');
    return;
  }

  // Show processing notification
  showNotification('LingoCards', 'Dodawanie słówka...', 'processing');

  try {
    // Get session for authenticated API calls
    const session = await authManager.getSession();
    if (!session) {
      throw new Error('Sesja wygasła. Zaloguj się ponownie.');
    }

    // Translate the selected text
    console.log('Translating:', selectedText);
    const translation = await translator.translate(selectedText, 'en', 'pl');
    console.log('Translation:', translation);

    // Open LingoCards app with pre-filled form
    const appUrl = new URL('https://lingocards.netlify.app/add');
    appUrl.searchParams.set('front', selectedText);
    appUrl.searchParams.set('back', translation);
    appUrl.searchParams.set('source', 'extension'); // Mark as coming from extension

    console.log('Opening app:', appUrl.toString());

    // Open in new tab
    await browser.tabs.create({ url: appUrl.toString() });

    // Show notification
    showNotification(
      'Otwarto LingoCards',
      `Dodaj: "${selectedText}" → "${translation}"`,
      'success'
    );

  } catch (error) {
    console.error('Error adding card:', error);

    // Show error notification with user-friendly message
    let errorMessage = error.message;

    if (error.message.includes('już istnieje')) {
      errorMessage = error.message; // Use the duplicate message as-is
    } else if (error.message.includes('połączenie')) {
      errorMessage = 'Brak połączenia z internetem';
    } else if (error.message.includes('Sesja wygasła')) {
      errorMessage = 'Sesja wygasła. Zaloguj się ponownie.';
    } else {
      errorMessage = 'Nie udało się dodać słówka. Spróbuj ponownie.';
    }

    showNotification('Błąd', errorMessage, 'error');
  }
});

/**
 * Show browser notification
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type (info, success, error, processing)
 */
function showNotification(title, message, type = 'info') {
  // Choose icon based on type
  let iconUrl = 'icons/icon-48.png';

  browser.notifications.create({
    type: 'basic',
    iconUrl: iconUrl,
    title: title,
    message: message
  });
}

console.log('LingoCards Helper: Background service worker loaded');
