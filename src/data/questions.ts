import type { Question } from '../types';

export const QUESTIONS: Question[] = [
  {
    id: 'channels',
    index: 0,
    title: 'Как сейчас приходят клиенты?',
    options: [
      { id: 'dm', label: 'Пишут в личку', tags: ['neutral'] },
      { id: 'site', label: 'Через сайт', tags: ['neutral'] },
      { id: 'ads', label: 'Через рекламу', tags: ['neutral'] },
      { id: 'chaos', label: 'Везде и хаотично', tags: ['chaos'] },
    ],
  },
  {
    id: 'pain',
    index: 1,
    title: 'Что сейчас больше всего раздражает?',
    options: [
      { id: 'slow', label: 'Долго отвечаю', tags: ['slowAnswer'] },
      { id: 'lose', label: 'Теряю заявки', tags: ['lose'] },
      { id: 'repeat', label: 'Много одинаковых вопросов', tags: ['repeatQuestions'] },
      { id: 'nosys', label: 'Нет системы', tags: ['dontUnderstand'] },
    ],
  },
  {
    id: 'processing',
    index: 2,
    title: 'Как вы сейчас обрабатываете заявки?',
    options: [
      { id: 'manual', label: 'Вручную', tags: ['manual'] },
      { id: 'partial', label: 'Частично автоматизировано', tags: ['partial'] },
      { id: 'dunno', label: 'Не понимаю как это работает', tags: ['dontUnderstand'] },
    ],
  },
  {
    id: 'time',
    index: 3,
    title: 'Сколько времени уходит на общение с клиентами?',
    options: [
      { id: 'heavy', label: 'Очень много', tags: ['timeHeavy'] },
      { id: 'sometimes', label: 'Иногда перегружает', tags: ['timeHeavy'] },
      { id: 'optimize', label: 'Нормально, но хочу оптимизировать', tags: ['partial'] },
    ],
  },
  {
    id: 'goal',
    index: 4,
    title: 'Что хотите получить?',
    options: [
      { id: 'more', label: 'Больше заявок', tags: ['growth'] },
      { id: 'order', label: 'Порядок в бизнесе', tags: ['dontUnderstand'] },
      { id: 'less', label: 'Меньше ручной работы', tags: ['manual'] },
      { id: 'income', label: 'Рост дохода', tags: ['growth'] },
    ],
  },
];
