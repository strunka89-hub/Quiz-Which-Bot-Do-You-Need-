import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEY_ANSWERS } from '../constants';
import type { Answers } from '../types';

function loadAnswers(): Answers {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_ANSWERS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Answers) : {};
  } catch {
    return {};
  }
}

function persistAnswers(answers: Answers): void {
  try {
    window.localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
  } catch {
    /* noop */
  }
}

function clearPersisted(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY_ANSWERS);
  } catch {
    /* noop */
  }
}

export interface UseAnswersApi {
  answers: Answers;
  setAnswer: (questionId: string, optionId: string) => void;
  reset: () => void;
}

export function useAnswers(): UseAnswersApi {
  const [answers, setAnswers] = useState<Answers>(() => loadAnswers());

  useEffect(() => {
    persistAnswers(answers);
  }, [answers]);

  const setAnswer = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }, []);

  const reset = useCallback(() => {
    setAnswers({});
    clearPersisted();
  }, []);

  return { answers, setAnswer, reset };
}
