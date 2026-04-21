import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ScreenShell } from '../components/ScreenShell';
import { PrimaryButton } from '../components/PrimaryButton';
import { FormField } from '../components/FormField';
import {
  hasErrors,
  validateLeadForm,
  type LeadFormErrors,
} from '../utils/validation';

interface Props {
  onBack: () => void;
  onSubmit: (data: { name: string; contact: string }) => Promise<void>;
}

export function LeadScreen({ onBack, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [touched, setTouched] = useState<{ name?: boolean; contact?: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Жёсткая защита от двойной отправки: ref-флаг срабатывает синхронно,
  // не дожидаясь re-render после setLoading(true).
  const submittingRef = useRef(false);

  const nameError = touched.name ? errors.name : undefined;
  const contactError = touched.contact ? errors.contact : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    const v = validateLeadForm(name, contact);
    setErrors(v);
    setTouched({ name: true, contact: true });
    if (hasErrors(v)) return;

    submittingRef.current = true;
    setLoading(true);
    setSubmitError(null);

    try {
      await onSubmit({ name: name.trim(), contact: contact.trim() });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Не удалось отправить');
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const handleNameChange = (v: string) => {
    setName(v);
    if (touched.name) {
      setErrors((prev) => ({ ...prev, name: validateLeadForm(v, contact).name }));
    }
  };
  const handleContactChange = (v: string) => {
    setContact(v);
    if (touched.contact) {
      setErrors((prev) => ({ ...prev, contact: validateLeadForm(name, v).contact }));
    }
  };

  return (
    <ScreenShell variant="slide" direction="forward">
      <form onSubmit={handleSubmit} className="flex h-full flex-col" noValidate>
        <button
          type="button"
          onClick={onBack}
          className="-ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-white hover:text-ink active:scale-95"
          aria-label="Назад"
          disabled={loading}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
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
          <FormField
            label="Имя"
            placeholder="Как к вам обращаться"
            value={name}
            onChange={handleNameChange}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            error={nameError}
            autoComplete="name"
            name="name"
            disabled={loading}
            enterKeyHint="next"
          />
          <FormField
            label="Номер телефона"
            placeholder="+7 999 000-00-00"
            value={contact}
            onChange={handleContactChange}
            onBlur={() => setTouched((t) => ({ ...t, contact: true }))}
            error={contactError}
            autoComplete="tel"
            inputMode="tel"
            type="tel"
            name="contact"
            disabled={loading}
            enterKeyHint="done"
          />
        </div>

        {submitError && (
          <div
            role="alert"
            className="mt-4 rounded-xl2 border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700"
          >
            {submitError}
          </div>
        )}

        <div className="mt-auto pt-6">
          <PrimaryButton type="submit" loading={loading} disabled={loading}>
            {loading ? 'Отправляем…' : 'Получить разбор'}
          </PrimaryButton>
          <p className="mt-3 text-center text-meta text-ink-subtle">
            Не звоним без предупреждения · только по делу
          </p>
        </div>
      </form>
    </ScreenShell>
  );
}
