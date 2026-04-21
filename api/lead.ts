import type { VercelRequest, VercelResponse } from '@vercel/node';

interface LeadBody {
  name?: string;
  contact?: string;
  segment?: string;
  answers?: Record<string, string>;
  timestamp?: string;
  source?: string;
  source_url?: string;
  userAgent?: string;
  referrer?: string | null;
  utm?: Record<string, string> | null;
}

const SEGMENT_LABELS: Record<string, string> = {
  lost: 'Теряются заявки',
  overload: 'Перегруз и ручная работа',
  nosystem: 'Нет системы',
};

// Человекочитаемые подписи для ответов квиза.
// Дублируем в serverless, чтобы функция была самодостаточной
// и не зависела от src/ (там Vite + browser-only код).
const QA: Record<string, { title: string; options: Record<string, string> }> = {
  channels: {
    title: 'Как приходят клиенты',
    options: {
      dm: 'Пишут в личку',
      site: 'Через сайт',
      ads: 'Через рекламу',
      chaos: 'Везде и хаотично',
    },
  },
  pain: {
    title: 'Что раздражает',
    options: {
      slow: 'Долго отвечаю',
      lose: 'Теряю заявки',
      repeat: 'Много одинаковых вопросов',
      nosys: 'Нет системы',
    },
  },
  processing: {
    title: 'Как обрабатывает заявки',
    options: {
      manual: 'Вручную',
      partial: 'Частично автоматизировано',
      dunno: 'Не понимаю как это работает',
    },
  },
  time: {
    title: 'Времени на общение',
    options: {
      heavy: 'Очень много',
      sometimes: 'Иногда перегружает',
      optimize: 'Нормально, но хочет оптимизировать',
    },
  },
  goal: {
    title: 'Что хочет получить',
    options: {
      more: 'Больше заявок',
      order: 'Порядок в бизнесе',
      less: 'Меньше ручной работы',
      income: 'Рост дохода',
    },
  },
};

const QUESTION_ORDER = ['channels', 'pain', 'processing', 'time', 'goal'];

const ESC_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};

function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>]/g, (c) => ESC_MAP[c] ?? c);
}

function formatDateMoscow(iso?: string): string {
  try {
    const d = iso ? new Date(iso) : new Date();
    return new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'Europe/Moscow',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return iso ?? new Date().toISOString();
  }
}

function formatUtm(utm?: Record<string, string> | null): string {
  if (!utm || !Object.keys(utm).length) return '—';
  return Object.entries(utm)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ');
}

function formatLead(lead: LeadBody): string {
  const lines: string[] = [];
  lines.push('<b>🔥 Новая заявка из квиза</b>');
  lines.push('');

  lines.push(`<b>Имя:</b> ${esc(lead.name || '—')}`);
  lines.push(`<b>Телефон:</b> <code>${esc(lead.contact || '—')}</code>`);

  const segmentLabel = lead.segment
    ? SEGMENT_LABELS[lead.segment] || lead.segment
    : '—';
  lines.push(`<b>Сегмент:</b> ${esc(segmentLabel)}`);

  lines.push('');
  lines.push('<b>Ответы:</b>');

  const answers = lead.answers || {};
  QUESTION_ORDER.forEach((qid, i) => {
    const q = QA[qid];
    if (!q) return;
    const optionId = answers[qid];
    const optionLabel = optionId
      ? q.options[optionId] || optionId
      : '— не ответил —';
    lines.push(`${i + 1}. ${esc(q.title)}: ${esc(optionLabel)}`);
  });

  lines.push('');
  lines.push(`<b>Источник:</b> ${esc(lead.source || '—')}`);
  if (lead.source_url) {
    lines.push(`<b>Ссылка:</b> ${esc(lead.source_url)}`);
  }
  lines.push(`<b>UTM:</b> ${esc(formatUtm(lead.utm))}`);
  if (lead.referrer) {
    lines.push(`<b>Referrer:</b> ${esc(lead.referrer)}`);
  }
  lines.push(`<b>Время (МСК):</b> ${esc(formatDateMoscow(lead.timestamp))}`);

  return lines.join('\n');
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<VercelResponse | void> {
  // CORS: разрешаем POST с любого origin (квиз может быть на другом домене,
  // если вы вдруг решите разместить фронт отдельно).
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('[api/lead] missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    return res
      .status(500)
      .json({ ok: false, error: 'server_misconfigured' });
  }

  let lead: LeadBody;
  try {
    lead =
      typeof req.body === 'string'
        ? (JSON.parse(req.body) as LeadBody)
        : (req.body as LeadBody);
  } catch {
    return res.status(400).json({ ok: false, error: 'invalid_json' });
  }

  if (!lead || typeof lead !== 'object') {
    return res.status(400).json({ ok: false, error: 'invalid_body' });
  }

  const text = formatLead(lead);

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      },
    );

    if (!tgRes.ok) {
      const detail = await tgRes.text();
      console.error('[api/lead] telegram error', tgRes.status, detail);
      return res
        .status(502)
        .json({ ok: false, error: 'telegram_failed', status: tgRes.status });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown';
    console.error('[api/lead] network error', message);
    return res.status(502).json({ ok: false, error: 'network', detail: message });
  }
}
