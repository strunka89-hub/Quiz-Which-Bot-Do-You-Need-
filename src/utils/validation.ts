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

const PHONE_RE = /^[+]?\d[\d\s\-()]{7,19}$/;

export function validateContact(value: string): string | undefined {
  const v = value.trim();
  if (!v) return 'Укажите номер телефона';
  if (!PHONE_RE.test(v)) {
    return 'Например: +7 999 000-00-00';
  }
  const digits = v.replace(/\D/g, '');
  if (digits.length < 10) return 'Слишком короткий номер';
  if (digits.length > 15) return 'Слишком длинный номер';
  return undefined;
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
