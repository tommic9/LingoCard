/**
 * Background service worker
 * Handles context menu and card creation
 */

import { browser } from './utils/browser-polyfill.js';
import { authManager } from './lib/auth-manager.js';
import { translator } from './lib/translator.js';
import { cardService } from './lib/card-service.js';
import { storage } from './utils/storage.js';

const NOTIFICATION_ID = 'lingocards-status'; // Stałe ID zapobiega duplikatom

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
  if (info.menuItemId !== 'add-to-lingocards') return;

  const selectedText = info.selectionText?.trim();
  if (!selectedText) {
    showNotification('Błąd', 'Nie zaznaczono tekstu', 'error');
    return;
  }

  // Check authentication
  const user = await authManager.getUser();
  if (!user) {
    showNotification('Wymagane logowanie', 'Zaloguj się w rozszerzeniu', 'error');
    return;
  }

  // Pierwsze powiadomienie
  showNotification('LingoCards', 'Tłumaczenie i przygotowanie...', 'processing');

  try {
    const session = await authManager.getSession();
    if (!session) throw new Error('Sesja wygasła. Zaloguj się ponownie.');

    const translation = await translator.translate(selectedText, 'en', 'pl');

    const appUrl = new URL('https://lingocards.netlify.app/add');
    appUrl.searchParams.set('front', selectedText);
    appUrl.searchParams.set('back', translation);
    appUrl.searchParams.set('source', 'extension');

    await browser.tabs.create({ url: appUrl.toString() });

    // To powiadomienie NADPISZE poprzednie dzięki użyciu NOTIFICATION_ID
    showNotification(
      'Gotowe!', 
      `Przygotowano: "${selectedText}" → "${translation}"`, 
      'success'
    );

  } catch (error) {
    console.error('Error:', error);
    showNotification('Błąd', error.message || 'Spróbuj ponownie.', 'error');
  }
});

function showNotification(title, message, type = 'info') {
  browser.notifications.create(NOTIFICATION_ID, {
    type: 'basic',
    iconUrl: 'icons/icon-48.png',
    title: title,
    message: message,
    priority: 2 // Wysoki priorytet, aby powiadomienie było widoczne
  });
}