import type { Lead, LeadPayload } from '../types';
import { getTelegramUser } from './telegram';

export interface SendLeadResult {
  ok: boolean;
  mock?: boolean;
  error?: string;
}

export async function sendLead(lead: Lead): Promise<SendLeadResult> {
  const url = import.meta.env.VITE_WEBHOOK_URL as string | undefined;

  const payload: LeadPayload = {
    ...lead,
    source: 'quiz-which-bot',
    ts: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    telegramUser: getTelegramUser(),
  };

  if (!url) {
    // Без webhook — просто логируем и возвращаем ok (dev / локальный просмотр).
    // eslint-disable-next-line no-console
    console.info('[quiz] VITE_WEBHOOK_URL не задан, лид не отправлен:', payload);
    return { ok: true, mock: true };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'cors',
      keepalive: true,
    });
    return { ok: res.ok, error: res.ok ? undefined : `HTTP ${res.status}` };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return { ok: false, error: message };
  }
}
