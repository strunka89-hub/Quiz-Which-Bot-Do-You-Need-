import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { QUESTIONS } from '../data/questions';
import { determineSegment } from '../utils/scoring';
import { humanizeSendError, sendLead } from '../utils/api';
import type { Direction, SegmentId, Step } from '../types';
import { useAnswers } from './useAnswers';

const ADVANCE_DELAY_MS = 220;

export interface UseQuizFlowApi {
  step: Step;
  direction: Direction;
  answers: ReturnType<typeof useAnswers>['answers'];
  segmentId: SegmentId;
  currentQuestionIndex: number | null;

  start: () => void;
  answer: (questionId: string, optionId: string) => void;
  backFromQuestion: () => void;
  toLead: () => void;
  backToResult: () => void;
  submitLead: (data: { name: string; contact: string }) => Promise<void>;
  restart: () => void;
}

export function useQuizFlow(): UseQuizFlowApi {
  const { answers, setAnswer, reset } = useAnswers();
  const [step, setStep] = useState<Step>({ kind: 'intro' });
  const [direction, setDirection] = useState<Direction>('forward');
  const advanceTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, []);

  const segmentId: SegmentId = useMemo(
    () => determineSegment(answers),
    [answers],
  );

  const start = useCallback(() => {
    setDirection('forward');
    reset();
    setStep({ kind: 'question', index: 0 });
  }, [reset]);

  const answer = useCallback(
    (questionId: string, optionId: string) => {
      setAnswer(questionId, optionId);

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
      }, ADVANCE_DELAY_MS);
    },
    [setAnswer],
  );

  const backFromQuestion = useCallback(() => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    setStep((s) => {
      if (s.kind !== 'question') return s;
      setDirection('backward');
      if (s.index === 0) return { kind: 'intro' };
      return { kind: 'question', index: s.index - 1 };
    });
  }, []);

  const toLead = useCallback(() => {
    setDirection('forward');
    setStep({ kind: 'lead' });
  }, []);

  const backToResult = useCallback(() => {
    setDirection('backward');
    setStep({ kind: 'result' });
  }, []);

  const submitLead = useCallback(
    async (data: { name: string; contact: string }) => {
      const res = await sendLead({
        name: data.name,
        contact: data.contact,
        segment: segmentId,
        answers,
      });
      // Если сеть упала, но мы успели сохранить локально — всё равно показываем «Спасибо»:
      // это ВК-сценарий лид-магнита, контакт клиента в безопасности, мы просто досылаем позже.
      if (!res.ok && res.fallback !== 'local') {
        throw new Error(humanizeSendError(res.error));
      }
      setDirection('forward');
      setStep({ kind: 'thanks' });
    },
    [answers, segmentId],
  );

  const restart = useCallback(() => {
    setDirection('backward');
    reset();
    setStep({ kind: 'intro' });
  }, [reset]);

  const currentQuestionIndex = step.kind === 'question' ? step.index : null;

  return {
    step,
    direction,
    answers,
    segmentId,
    currentQuestionIndex,
    start,
    answer,
    backFromQuestion,
    toLead,
    backToResult,
    submitLead,
    restart,
  };
}
