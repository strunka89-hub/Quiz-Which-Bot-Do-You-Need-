import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  breathing?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
}

export function PrimaryButton({
  children,
  breathing = false,
  fullWidth = true,
  loading = false,
  disabled,
  className = '',
  ...rest
}: Props) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center rounded-xl3
        bg-gradient-to-r from-accent to-accent-soft px-6
        text-btn text-white
        shadow-glow
        transition-[filter,opacity]
        disabled:cursor-not-allowed disabled:opacity-60
        ${fullWidth ? 'w-full' : ''}
        ${breathing && !disabled ? 'animate-breathe' : ''}
        ${className}`}
      style={{ height: 58 }}
      {...rest}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-xl3 opacity-0 transition-opacity duration-300 hover:opacity-100"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.35), transparent 60%)',
        }}
      />
      <span className="relative flex items-center gap-2">
        {loading ? (
          <svg
            className="h-5 w-5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="3"
            />
            <path
              d="M21 12a9 9 0 0 1-9 9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        ) : null}
        {children}
      </span>
    </motion.button>
  );
}
