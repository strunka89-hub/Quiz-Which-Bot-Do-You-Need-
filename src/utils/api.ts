import {
  LEAD_SOURCE,
  REQUEST_TIMEOUT_MS,
  STORAGE_KEY_LEADS,
  VK_COMMUNITY_URL,
} from '../constants';
import type { Lead, LeadPayload } from '../types';

export interface SendLeadResult {
  ok: boolean;
  fallback?: 'local' | null;
  error?: string;
}

function readUtm(): Record<string, string> | null {
  if (typeof window === 'undefined') return null;
  try {
    const sp = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const [key, value] of sp.entries()) {
      if (key.toLowerCase().startsWith('utm_')) utm[key.toLowerCase()] = value;
    }
    return Object.keys(utm).length ? utm : null;
  } catch {
    return null;
  }
}

function saveLeadLocally(payload: LeadPayload): void {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_LEADS);
    const list = raw ? (JSON.parse(raw) as LeadPayload[]) : [];
    list.push(payload);
    window.localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(list));
  } catch {
    /* noop */
  }
}

function buildPayload(lead: Lead): LeadPayload {
  return {
    ...lead,
    source: LEAD_SOURCE,
    source_url: VK_COMMUNITY_URL,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    referrer: typeof document !== 'undefined' ? document.referrer || null : null,
    utm: readUtm(),
  };
}

const DEFAULT_WEBHOOK_URL = '/api/lead';

export async function sendLead(lead: Lead): Promise<SendLeadResult> {
  const envUrl = import.meta.env.VITE_WEBHOOK_URL as string | undefined;
  const url = envUrl && envUrl.trim() ? envUrl.trim() : DEFAULT_WEBHOOK_URL;
  const payload = buildPayload(lead);

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    saveLeadLocally(payload);
    return { ok: false, fallback: 'local', error: 'offline' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'cors',
      keepalive: true,
      signal: controller.signal,
    });

    if (!res.ok) {
      saveLeadLocally(payload);
      return { ok: false, fallback: 'local', error: `HTTP ${res.status}` };
    }

    return { ok: true };
  } catch (e) {
    saveLeadLocally(payload);
    const name = e instanceof Error ? e.name : '';
    if (name === 'AbortError') {
      return { ok: false, fallback: 'local', error: 'timeout' };
    }
    const message = e instanceof Error ? e.message : 'network';
    return { ok: false, fallback: 'local', error: message };
  } finally {
    clearTimeout(timer);
  }
}

export function humanizeSendError(error: string | undefined): string {
  if (!error) return 'Не удалось отправить. Попробуйте ещё раз.';
  if (error === 'offline') return 'Нет интернета. Проверьте соединение и попробуйте снова.';
  if (error === 'timeout') return 'Сервер не отвечает. Попробуйте ещё раз.';
  if (error.startsWith('HTTP ')) return 'Не удалось отправить. Попробуйте ещё раз через минуту.';
  return 'Не удалось отправить. Попробуйте ещё раз.';
}
