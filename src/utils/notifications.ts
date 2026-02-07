/**
 * Browser Notification API utilities
 */

export type NotificationPermission = 'granted' | 'denied' | 'default';

/**
 * Check if browser supports notifications
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return 'denied';
  }
}

/**
 * Send a browser notification
 */
export function sendNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  try {
    const notification = new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      ...options,
    });

    // Auto-close after 10 seconds
    setTimeout(() => notification.close(), 10000);

    return notification;
  } catch (error) {
    console.error('Failed to send notification:', error);
    return null;
  }
}

/**
 * Send study reminder notification
 */
export function sendStudyReminder(cardsRemaining?: number): void {
  const title = '📚 Time to study!';
  const body = cardsRemaining
    ? `You have ${cardsRemaining} cards waiting to be reviewed.`
    : "Don't forget your daily study session!";

  const notification = sendNotification(title, {
    body,
    tag: 'study-reminder',
    requireInteraction: false,
    data: {
      url: window.location.origin + '/study',
    },
  });

  // Click handler to open study page
  if (notification) {
    notification.onclick = () => {
      window.focus();
      window.location.href = '/study';
      notification.close();
    };
  }
}
