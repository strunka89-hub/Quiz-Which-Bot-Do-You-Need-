interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  initDataUnsafe?: { user?: TelegramUser };
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    selectionChanged: () => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
  };
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

function getTG(): TelegramWebApp | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.Telegram?.WebApp;
}

export function initTelegram(): void {
  if (typeof window === 'undefined') return;

  const run = () => {
    const tg = getTG();
    if (!tg) return;
    try {
      tg.ready();
      tg.expand();
      tg.setBackgroundColor?.('#FAFBFD');
      tg.setHeaderColor?.('#FAFBFD');
    } catch {
      /* noop */
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
}

export function hapticSelect(): void {
  try {
    getTG()?.HapticFeedback?.selectionChanged();
  } catch {
    /* noop */
  }
}

export function hapticImpact(
  style: 'light' | 'medium' | 'heavy' | 'soft' | 'rigid' = 'light',
): void {
  try {
    getTG()?.HapticFeedback?.impactOccurred(style);
  } catch {
    /* noop */
  }
}

export function hapticNotify(
  type: 'error' | 'success' | 'warning' = 'success',
): void {
  try {
    getTG()?.HapticFeedback?.notificationOccurred(type);
  } catch {
    /* noop */
  }
}

export function getTelegramUser(): LeadTelegramUser | null {
  const user = getTG()?.initDataUnsafe?.user;
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
  };
}

export interface LeadTelegramUser {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
}
