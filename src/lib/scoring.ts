import { QUESTIONS } from '../data/questions';
import type { Answers, SegmentId, Tag } from '../types';

const LOST_TAGS: Tag[] = ['chaos', 'lose', 'manual'];
const OVERLOAD_TAGS: Tag[] = ['timeHeavy', 'slowAnswer', 'repeatQuestions'];
const NOSYSTEM_TAGS: Tag[] = ['dontUnderstand', 'partial', 'growth'];

export interface ScoreBreakdown {
  lost: number;
  overload: number;
  nosystem: number;
}

export function computeScore(answers: Answers): ScoreBreakdown {
  const score: ScoreBreakdown = { lost: 0, overload: 0, nosystem: 0 };

  for (const q of QUESTIONS) {
    const optionId = answers[q.id];
    if (!optionId) continue;

    const opt = q.options.find((o) => o.id === optionId);
    if (!opt) continue;

    for (const tag of opt.tags) {
      if (LOST_TAGS.includes(tag)) score.lost += 1;
      if (OVERLOAD_TAGS.includes(tag)) score.overload += 1;
      if (NOSYSTEM_TAGS.includes(tag)) score.nosystem += 1;
    }
  }

  return score;
}

/**
 * Определяет сегмент по ответам.
 * Правила:
 *  - Сегмент с максимальным счётом выигрывает.
 *  - Если ни одна группа не набрала больше 1 очка или у всех <= 1 — `nosystem` (разрозненные ответы / не понимает).
 *  - При равенстве двух групп приоритет: lost > overload > nosystem.
 */
export function determineSegment(answers: Answers): SegmentId {
  const score = computeScore(answers);
  const maxValue = Math.max(score.lost, score.overload, score.nosystem);

  if (maxValue <= 1) return 'nosystem';

  const candidates: SegmentId[] = [];
  if (score.lost === maxValue) candidates.push('lost');
  if (score.overload === maxValue) candidates.push('overload');
  if (score.nosystem === maxValue) candidates.push('nosystem');

  const priority: SegmentId[] = ['lost', 'overload', 'nosystem'];
  for (const p of priority) {
    if (candidates.includes(p)) return p;
  }
  return 'nosystem';
}
