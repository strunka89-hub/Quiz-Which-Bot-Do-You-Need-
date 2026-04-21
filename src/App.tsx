import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QUESTIONS } from './data/questions';
import { SEGMENTS } from './data/segments';
import { determineSegment } from './lib/scoring';
import { sendLead } from './lib/api';
import { hapticImpact, hapticNotify } from './lib/telegram';
import type { Answers, SegmentId } from './types';
import { ProgressBar } from './components/ProgressBar';
import { IntroScreen } from './components/IntroScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { ResultScreen } from './components/ResultScreen';
import { LeadScreen } from './components/LeadScreen';
import { ThanksScreen } from './components/ThanksScreen';

type Step =
  | { kind: 'intro' }
  | { kind: 'question'; index: number }
  | { kind: 'result' }
  | { kind: 'lead' }
  | { kind: 'thanks' };

const STORAGE_KEY = 'quiz-which-bot:answers';

function loadAnswers(): Answers {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Answers) : {};
  } catch {
    return {};
  }
}

function saveAnswers(answers: Answers) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    /* noop */
  }
}

function clearAnswers() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

export default function App() {
  const [step, setStep] = useState<Step>({ kind: 'intro' });
  const [answers, setAnswers] = useState<Answers>(() => loadAnswers());
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const advanceTimer = useRef<number | null>(null);

  useEffect(() => {
    saveAnswers(answers);
  }, [answers]);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, []);

  const segmentId: SegmentId = useMemo(() => determineSegment(answers), [answers]);

  const handleStart = () => {
    setDirection('forward');
    setAnswers({});
    clearAnswers();
    setStep({ kind: 'question', index: 0 });
  };

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    hapticImpact('light');

    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => {
      setStep((s) => {
        if (s.kind !== 'question') return s;
        setDirection('forward');
        if (s.index < QUESTIONS.length - 1) {
          return { kind: 'question', index: s.index + 1 };
        }
        return { kind: 'result' };
      });
    }, 220);
  };

  const handleBackFromQuestion = () => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    setStep((s) => {
      if (s.kind !== 'question') return s;
      setDirection('backward');
      if (s.index === 0) return { kind: 'intro' };
      return { kind: 'question', index: s.index - 1 };
    });
  };

  const handleCTA = () => {
    setDirection('forward');
    setStep({ kind: 'lead' });
  };

  const handleLeadBack = () => {
    setDirection('backward');
    setStep({ kind: 'result' });
  };

  const handleLeadSubmit = async (data: { name: string; contact: string }) => {
    const res = await sendLead({
      name: data.name,
      contact: data.contact,
      segment: segmentId,
      answers,
    });
    if (!res.ok) {
      throw new Error(res.error || 'Ошибка отправки');
    }
    hapticNotify('success');
    setDirection('forward');
    setStep({ kind: 'thanks' });
  };

  const handleRestart = () => {
    setDirection('backward');
    setAnswers({});
    clearAnswers();
    setStep({ kind: 'intro' });
  };

  const currentQuestion =
    step.kind === 'question' ? QUESTIONS[step.index] : null;
  const showProgress = step.kind === 'question';

  return (
    <div className="app-viewport flex w-full items-stretch justify-center">
      <div className="relative flex w-full max-w-[440px] flex-col px-5">
        <header className="flex items-center pt-5">
          {showProgress && currentQuestion ? (
            <div className="w-full">
              <ProgressBar
                current={currentQuestion.index + 1}
                total={QUESTIONS.length}
                canGoBack
                onBack={handleBackFromQuestion}
              />
            </div>
          ) : (
            <Brand />
          )}
        </header>

        <main className="relative mt-6 flex flex-1 flex-col pb-6">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {step.kind === 'intro' && (
              <motion.div key="intro" className="flex flex-1">
                <IntroScreen onStart={handleStart} />
              </motion.div>
            )}

            {step.kind === 'question' && currentQuestion && (
              <motion.div key={`q-${currentQuestion.id}`} className="flex flex-1">
                <QuestionScreen
                  question={currentQuestion}
                  value={answers[currentQuestion.id]}
                  direction={direction}
                  onSelect={(optionId) =>
                    handleAnswer(currentQuestion.id, optionId)
                  }
                />
              </motion.div>
            )}

            {step.kind === 'result' && (
              <motion.div key="result" className="flex flex-1">
                <ResultScreen
                  segment={SEGMENTS[segmentId]}
                  onCTA={handleCTA}
                />
              </motion.div>
            )}

            {step.kind === 'lead' && (
              <motion.div key="lead" className="flex flex-1">
                <LeadScreen onBack={handleLeadBack} onSubmit={handleLeadSubmit} />
              </motion.div>
            )}

            {step.kind === 'thanks' && (
              <motion.div key="thanks" className="flex flex-1">
                <ThanksScreen onRestart={handleRestart} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2 text-meta text-ink-subtle">
      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-soft text-white shadow-glowSoft">
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
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="uppercase tracking-[0.12em]">Quiz · Business</span>
    </div>
  );
}
