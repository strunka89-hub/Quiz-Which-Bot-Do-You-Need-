export type SegmentId = 'lost' | 'overload' | 'nosystem';

export type Tag =
  | 'chaos'
  | 'lose'
  | 'manual'
  | 'timeHeavy'
  | 'slowAnswer'
  | 'repeatQuestions'
  | 'dontUnderstand'
  | 'partial'
  | 'growth'
  | 'neutral';

export interface Option {
  id: string;
  label: string;
  tags: Tag[];
}

export interface Question {
  id: string;
  index: number;
  title: string;
  options: Option[];
}

export type Answers = Record<string, string>;

export interface Segment {
  id: SegmentId;
  title: string;
  text: string;
  solution: string;
  bullets: string[];
}

export interface Lead {
  name: string;
  contact: string;
  segment: SegmentId;
  answers: Answers;
}

export interface LeadPayload extends Lead {
  source: string;
  source_url: string;
  timestamp: string;
  userAgent?: string;
  referrer?: string | null;
  utm?: Record<string, string> | null;
}

export type Direction = 'forward' | 'backward';

export type Step =
  | { kind: 'intro' }
  | { kind: 'question'; index: number }
  | { kind: 'result' }
  | { kind: 'lead' }
  | { kind: 'thanks' };
