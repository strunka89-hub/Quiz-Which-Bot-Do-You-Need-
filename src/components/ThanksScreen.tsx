import { motion } from 'framer-motion';
import { ScreenShell } from './ScreenShell';

interface Props {
  onRestart: () => void;
}

export function ThanksScreen({ onRestart }: Props) {
  return (
    <ScreenShell variant="fade" className="items-center justify-center text-center">
      <div className="flex flex-1 flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-soft shadow-glow"
        >
          <svg
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.25, duration: 0.55, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-7 text-h1 text-ink"
        >
          Готово
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-3 max-w-[320px] text-sub text-ink-muted"
        >
          Заявка получена. Свяжемся в течение 15 минут с персональным разбором.
        </motion.p>
      </div>

      <motion.button
        type="button"
        onClick={onRestart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="mb-1 self-stretch rounded-xl3 border border-line bg-white py-4 text-[15px] font-medium text-ink-muted shadow-card transition hover:text-ink active:scale-[0.99]"
      >
        Пройти тест заново
      </motion.button>
    </ScreenShell>
  );
}
