export interface LeadFormErrors {
  name?: string;
  contact?: string;
}

export function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length < 2) return 'Укажите имя (минимум 2 символа)';
  if (trimmed.length > 60) return 'Слишком длинное имя';
  return undefined;
}

const TG_USERNAME_RE = /^@?[a-zA-Z][a-zA-Z0-9_]{3,31}$/;
const TG_LINK_RE = /^https?:\/\/(t\.me|telegram\.me)\/[a-zA-Z][a-zA-Z0-9_]{3,31}$/;
const PHONE_RE = /^[+]?\d[\d\s\-()]{7,19}$/;
const WA_LINK_RE = /^https?:\/\/(wa\.me|api\.whatsapp\.com)\/.+/;

export function validateContact(value: string): string | undefined {
  const v = value.trim();
  if (!v) return 'Укажите Telegram или WhatsApp';

  if (
    TG_USERNAME_RE.test(v) ||
    TG_LINK_RE.test(v) ||
    PHONE_RE.test(v) ||
    WA_LINK_RE.test(v)
  ) {
    return undefined;
  }
  return 'Например: @username или +7 999 000-00-00';
}

export function validateLeadForm(name: string, contact: string): LeadFormErrors {
  const errors: LeadFormErrors = {};
  const n = validateName(name);
  const c = validateContact(contact);
  if (n) errors.name = n;
  if (c) errors.contact = c;
  return errors;
}

export function hasErrors(errors: LeadFormErrors): boolean {
  return Boolean(errors.name || errors.contact);
}
