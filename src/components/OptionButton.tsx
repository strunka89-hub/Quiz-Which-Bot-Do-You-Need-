import { motion } from 'framer-motion';

interface Props {
  label: string;
  selected: boolean;
  onClick: () => void;
  index?: number;
}

export function OptionButton({ label, selected, onClick, index = 0 }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.05 + index * 0.06,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      className={`group flex w-full items-center justify-between gap-3
        rounded-xl3 border bg-white px-5 text-left
        transition-[border-color,box-shadow,background-color]
        ${selected
          ? 'border-accent shadow-glowSoft ring-2 ring-accent-ring'
          : 'border-line shadow-card hover:border-accent/40 hover:shadow-cardLg'}`}
      style={{ minHeight: 64 }}
      aria-pressed={selected}
    >
      <span
        className={`text-[16px] leading-[22px] tracking-[-0.005em]
          ${selected ? 'font-semibold text-ink' : 'font-medium text-ink'}`}
      >
        {label}
      </span>

      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border
          transition-colors
          ${selected
            ? 'border-accent bg-accent text-white'
            : 'border-line bg-white text-transparent group-hover:border-accent/50'}`}
        aria-hidden
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </motion.button>
  );
}
