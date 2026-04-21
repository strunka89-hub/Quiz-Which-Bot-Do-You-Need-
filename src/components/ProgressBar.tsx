import { motion } from 'framer-motion';

interface Props {
  current: number;
  total: number;
  onBack?: () => void;
  canGoBack?: boolean;
}

export function ProgressBar({ current, total, onBack, canGoBack }: Props) {
  const pct = Math.max(0, Math.min(100, (current / total) * 100));

  return (
    <div className="flex w-full items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Назад"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition
          ${canGoBack
            ? 'text-ink-muted hover:bg-white hover:text-ink active:scale-95'
            : 'text-ink-subtle/40'}`}
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

      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-line">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-accent-soft"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="w-12 text-right text-meta tabular-nums text-ink-muted">
        {current}/{total}
      </div>
    </div>
  );
}
