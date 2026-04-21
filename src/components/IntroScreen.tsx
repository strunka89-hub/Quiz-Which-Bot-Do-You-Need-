import { motion } from 'framer-motion';
import { ScreenShell } from './ScreenShell';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  onStart: () => void;
}

const item = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function IntroScreen({ onStart }: Props) {
  return (
    <ScreenShell variant="fade" className="justify-between">
      <div className="pt-10">
        <motion.div
          className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-soft shadow-glow"
          initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>

      <div className="flex flex-col items-center text-center">
        <motion.h1
          custom={0}
          initial="hidden"
          animate="show"
          variants={item}
          className="text-h1 text-ink"
        >
          Где вы теряете
          <br /> клиентов в бизнесе
        </motion.h1>

        <motion.p
          custom={1}
          initial="hidden"
          animate="show"
          variants={item}
          className="mt-4 max-w-[320px] text-sub text-ink-muted"
        >
          Пройдите короткий тест и получите разбор
        </motion.p>

        <motion.div
          custom={2}
          initial="hidden"
          animate="show"
          variants={item}
          className="mt-8 flex items-center gap-2 text-meta text-ink-subtle"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-accent" />
          <span>5 вопросов · 60 секунд</span>
        </motion.div>
      </div>

      <motion.div
        custom={3}
        initial="hidden"
        animate="show"
        variants={item}
        className="pb-2"
      >
        <PrimaryButton onClick={onStart} breathing>
          Начать
        </PrimaryButton>

        <p className="mt-4 text-center text-meta text-ink-subtle">
          Без регистрации · результат сразу
        </p>
      </motion.div>
    </ScreenShell>
  );
}
