# Quiz — Где вы теряете клиентов

Премиальный мобильный квиз-лендинг: 5 вопросов → сегментация пользователя в
один из трёх сценариев → CTA на разбор → сбор лида с отправкой на webhook.

Стек: **Vite + React 18 + TypeScript + TailwindCSS + Framer Motion**.
Формат: mobile-first (9:16), адаптив под ВК, Telegram Mini App и обычный
браузер. Вес бандла ~90 KB gzip.

---

## Быстрый старт

```bash
npm install
cp .env.example .env   # и укажите VITE_WEBHOOK_URL
npm run dev            # http://localhost:5173
```

Сборка и превью:

```bash
npm run build
npm run preview
```

Готовая статика окажется в `dist/` — можно деплоить на Vercel, Netlify,
GitHub Pages, Cloudflare Pages и т.п.

---

## Переменные окружения

Файл `.env` (создаётся из `.env.example`):

| Переменная | Назначение |
| --- | --- |
| `VITE_WEBHOOK_URL` | URL, на который уходит `POST application/json` с лидом. Если пусто — лид пишется в консоль (удобно для локальной отладки). |

---

## Payload, уходящий на webhook

```json
{
  "name": "Иван",
  "contact": "@ivan",
  "segment": "lost",
  "answers": {
    "channels": "chaos",
    "pain": "lose",
    "processing": "manual",
    "time": "heavy",
    "goal": "income"
  },
  "source": "quiz-which-bot",
  "ts": "2026-04-21T12:00:00.000Z",
  "userAgent": "Mozilla/5.0 ...",
  "telegramUser": {
    "id": 123456,
    "username": "ivan",
    "firstName": "Иван",
    "lastName": null
  }
}
```

- `segment` ∈ `lost` | `overload` | `nosystem`.
- `telegramUser` присутствует только при открытии в Telegram Mini App.
- Принять можно в n8n / Make / Zapier / собственным API / напрямую
  Telegram-ботом через прокси.

---

## Сегментация

Каждому варианту ответа присвоены теги (`src/data/questions.ts`).
Алгоритм в `src/lib/scoring.ts`:

- Теги `chaos`, `lose`, `manual` → **lost** («Теряются заявки»).
- Теги `timeHeavy`, `slowAnswer`, `repeatQuestions` → **overload**
  («Перегруз и ручная работа»).
- Теги `dontUnderstand`, `partial`, `growth` → **nosystem** («Нет системы»).
- При равенстве очков приоритет: `lost > overload > nosystem`.
- Если все группы набрали ≤1 очка (разрозненные ответы) — `nosystem`.

Тексты сегментов — в `src/data/segments.ts`.

---

## Встраивание

### Telegram Mini App

1. Опубликуйте билд на любом HTTPS-хосте.
2. В `@BotFather` создайте Web App и укажите URL.
3. SDK уже подключён в `index.html`, вызовы `tg.ready()` / `tg.expand()` /
   haptics / `initDataUnsafe.user` — безопасные (no-op вне TG).

### ВКонтакте

Обычная ссылка; адаптив и `safe-area` уже настроены. Можно отдавать
через VK Mini Apps — всё работает как SPA.

---

## Структура

```
src/
  App.tsx                  # state-machine экранов
  main.tsx
  index.css                # Tailwind + базовые стили
  types.ts
  data/
    questions.ts           # 5 вопросов + теги
    segments.ts            # 3 сегмента (заголовок/текст/решение/буллеты)
  lib/
    scoring.ts             # вычисление сегмента
    api.ts                 # POST лида на webhook
    telegram.ts            # безопасный init TG WebApp + haptics
  components/
    ScreenShell.tsx        # общий layout + motion-варианты
    ProgressBar.tsx        # прогресс + кнопка «Назад»
    PrimaryButton.tsx      # CTA с glow, breathing и hover
    OptionButton.tsx       # крупный select-вариант
    IntroScreen.tsx
    QuestionScreen.tsx
    ResultScreen.tsx
    LeadScreen.tsx
    ThanksScreen.tsx
```

---

## Что дальше (идеи)

- A/B на заголовке интро (хук vs вопрос).
- UTM-параметры из query-string → в payload.
- Счётчик событий (Яндекс.Метрика / GA) с `ym('reachGoal', ...)` на каждом шаге.
- Сохранение прогресса в URL (`?q=3&a=chaos,lose,...`), чтобы делиться ссылкой.
