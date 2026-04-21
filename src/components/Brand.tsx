export function Brand() {
  return (
    <div className="flex items-center gap-2 text-meta text-ink-subtle">
      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-soft text-white shadow-glowSoft">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="uppercase tracking-[0.12em]">
        Разбор для предпринимателей
      </span>
    </div>
  );
}
