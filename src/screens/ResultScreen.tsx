import { motion } from 'framer-motion';
import { ScreenShell } from '../components/ScreenShell';
import { PrimaryButton } from '../components/PrimaryButton';
import type { Segment } from '../types';

interface Props {
  segment: Segment;
  onCTA: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function ResultScreen({ segment, onCTA }: Props) {
  return (
    <ScreenShell variant="fade">
      <div className="flex h-full flex-col">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-2 text-meta"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="uppercase tracking-[0.08em] text-accent">
            Ваш результат
          </span>
        </motion.div>

        <motion.h2
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-3 text-h1 text-ink"
        >
          {segment.title}
        </motion.h2>

        <motion.p
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-4 text-sub text-ink-muted"
        >
          {segment.text}
        </motion.p>

        <motion.div
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-5 rounded-xl3 border border-line bg-white p-5 shadow-card"
        >
          <div className="text-meta uppercase tracking-[0.06em] text-ink-subtle">
            Решение
          </div>
          <p className="mt-2 text-[15px] leading-[22px] text-ink">
            {segment.solution}
          </p>
        </motion.div>

        <motion.div
          custom={3}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-5"
        >
          <div className="text-meta uppercase tracking-[0.06em] text-ink-subtle">
            Что это даст
          </div>
          <ul className="mt-3 flex flex-col gap-2.5">
            {segment.bullets.map((b, i) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.35 + i * 0.08,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-start gap-3 text-[15px] leading-[22px] text-ink"
              >
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
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
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {b}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="mt-auto pt-6">
          <PrimaryButton onClick={onCTA} breathing>
            <span>Разобрать мой кейс</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </PrimaryButton>

          <p className="mt-3 text-center text-meta text-ink-subtle">
            Покажем, где вы теряете заявки и как это исправить
          </p>
        </div>
      </div>
    </ScreenShell>
  );
}
