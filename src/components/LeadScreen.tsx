import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScreenShell } from './ScreenShell';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  onBack: () => void;
  onSubmit: (data: { name: string; contact: string }) => Promise<void>;
}

function validate(name: string, contact: string) {
  const errors: { name?: string; contact?: string } = {};
  if (name.trim().length < 2) {
    errors.name = 'Укажите имя';
  }
  const c = contact.trim();
  // Telegram @user / t.me / телефон в любом формате
  const tg = /^@?[a-zA-Z0-9_]{3,}$/.test(c);
  const tgLink = /^https?:\/\/(t\.me|telegram\.me)\/[a-zA-Z0-9_]{3,}$/.test(c);
  const phone = /^[+]?\d[\d\s\-()]{7,}$/.test(c);
  if (!tg && !tgLink && !phone) {
    errors.contact = 'Telegram @username или номер телефона';
  }
  return errors;
}

export function LeadScreen({ onBack, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; contact?: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(name, contact);
    setErrors(v);
    setTouched({ name: true, contact: true });
    if (v.name || v.contact) return;

    setLoading(true);
    setSubmitError(null);
    try {
      await onSubmit({ name: name.trim(), contact: contact.trim() });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Не удалось отправить');
    } finally {
      setLoading(false);
    }
  };

  const nameError = touched.name ? errors.name : undefined;
  const contactError = touched.contact ? errors.contact : undefined;

  return (
    <ScreenShell variant="slide" direction="forward">
      <form onSubmit={handleSubmit} className="flex h-full flex-col" noValidate>
        <button
          type="button"
          onClick={onBack}
          className="-ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-white hover:text-ink active:scale-95"
          aria-label="Назад"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-3 text-h1 text-ink"
        >
          Куда отправить разбор?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
          className="mt-3 text-sub text-ink-muted"
        >
          Пришлём персональный разбор и предложение, как это исправить.
        </motion.p>

        <div className="mt-7 flex flex-col gap-4">
          <Field
            label="Имя"
            placeholder="Как к вам обращаться"
            value={name}
            onChange={setName}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            error={nameError}
            autoComplete="given-name"
          />
          <Field
            label="Telegram / WhatsApp"
            placeholder="@username или +7 999 000-00-00"
            value={contact}
            onChange={setContact}
            onBlur={() => setTouched((t) => ({ ...t, contact: true }))}
            error={contactError}
            autoComplete="tel"
            inputMode="text"
          />
        </div>

        {submitError && (
          <div className="mt-4 rounded-xl2 border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
            {submitError}. Попробуйте ещё раз.
          </div>
        )}

        <div className="mt-auto pt-6">
          <PrimaryButton type="submit" loading={loading}>
            Получить разбор
          </PrimaryButton>
          <p className="mt-3 text-center text-meta text-ink-subtle">
            Не звоним без предупреждения · только по делу
          </p>
        </div>
      </form>
    </ScreenShell>
  );
}

interface FieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}

function Field({
  label,
  value,
  placeholder,
  onChange,
  onBlur,
  error,
  autoComplete,
  inputMode,
}: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="px-1 text-meta text-ink-muted">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={`h-[58px] w-full rounded-xl3 border bg-white px-5 text-[16px] leading-[22px] text-ink
          shadow-card transition-[border-color,box-shadow] outline-none
          placeholder:text-ink-subtle
          focus:border-accent focus:ring-2 focus:ring-accent-ring
          ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-line'}`}
      />
      {error && <span className="px-1 text-[12.5px] text-red-600">{error}</span>}
    </label>
  );
}
