import { motion } from 'framer-motion';
import { ScreenShell } from '../components/ScreenShell';
import { OptionButton } from '../components/OptionButton';
import type { Direction, Question } from '../types';

interface Props {
  question: Question;
  value?: string;
  direction: Direction;
  onSelect: (optionId: string) => void;
}

export function QuestionScreen({ question, value, direction, onSelect }: Props) {
  return (
    <ScreenShell direction={direction} variant="slide">
      <div className="flex h-full flex-col">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2"
        >
          <div className="text-meta text-ink-subtle">
            Вопрос {question.index + 1}
          </div>
          <h2 className="mt-2 text-h2 text-ink">{question.title}</h2>
        </motion.div>

        <div className="mt-7 flex flex-1 flex-col gap-3">
          {question.options.map((opt, i) => (
            <OptionButton
              key={opt.id}
              label={opt.label}
              selected={value === opt.id}
              index={i}
              onClick={() => onSelect(opt.id)}
            />
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}
