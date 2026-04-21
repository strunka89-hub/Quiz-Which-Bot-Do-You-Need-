# Quiz — Где вы теряете клиентов

Премиальный мобильный лид-магнит для сообщества ВКонтакте
[vk.com/ushakova_ai](https://vk.com/ushakova_ai). 5 вопросов → сегментация
→ CTA → лид-форма → webhook → возврат в сообщество.

Стек: **Vite + React 18 + TypeScript + TailwindCSS + Framer Motion**.
Формат: mobile-first, вертикальный 9:16, работает по обычной ссылке из
ВК-браузера. Без VK SDK, без Telegram SDK — просто быстрая SPA-страница.

Вес бандла ~90 KB gzip, первая отрисовка <1s на 4G.

---

## Путь пользователя

```
Пост в сообществе ВК → ссылка → интро → 5 вопросов → сегмент →
CTA "Разобрать мой кейс" → имя + контакт → POST webhook →
"Спасибо" → кнопка "Вернуться в сообщество" → vk.com/ushakova_ai
```

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

Готовая статика — в `dist/`, можно деплоить куда угодно.

---

## Переменные окружения

Файл `.env`:

| Переменная | Обязательность | Назначение |
| --- | --- | --- |
| `VITE_WEBHOOK_URL` | опционально | URL, на который уходит `POST application/json` с лидом. Если пусто — лид сохраняется в `localStorage` + пишется в консоль (удобно для локальной отладки, но в production обязательно задавайте). |

---

## Деплой на Vercel (рекомендуется)

1. Создайте аккаунт на [vercel.com](https://vercel.com) и залогиньтесь.
2. Опубликуйте репозиторий на GitHub / GitLab / Bitbucket (или воспользуйтесь
   Vercel CLI).
3. Вариант A — через dashboard:
   - **Add New → Project** → выберите репозиторий.
   - Framework preset: **Vite** (определится автоматически).
   - Build command: `npm run build` (уже дефолт).
   - Output directory: `dist` (дефолт).
   - В **Environment Variables** добавьте `VITE_WEBHOOK_URL` с вашим URL
     (n8n / Make / собственный сервер).
   - **Deploy**.
4. Вариант B — через CLI:

   ```bash
   npm i -g vercel
   vercel login
   vercel            # preview
   vercel --prod     # production
   ```

   Env-переменную задаётся командой:

   ```bash
   vercel env add VITE_WEBHOOK_URL production
   ```

5. После деплоя Vercel выдаст URL вида `https://quiz-ushakova.vercel.app` —
   это и есть та самая ссылка, которую потом вставляем в сообщество ВК.
6. SPA-fallback настроен в [vercel.json](vercel.json): любые пути
   переписываются в `/`, статика в `/assets/*` и `og-cover.png` отдаются
   напрямую.

Можно подключить свой домен: **Project → Settings → Domains**.

---

## Деплой на Netlify (альтернатива)

1. [app.netlify.com/start](https://app.netlify.com/start) → подключить
   репозиторий.
2. Build command: `npm run build`, Publish directory: `dist`.
3. Site configuration → Environment variables → `VITE_WEBHOOK_URL`.
4. SPA-fallback уже настроен через [public/\_redirects](public/_redirects).

Или drag-n-drop папки `dist/` на [app.netlify.com/drop](https://app.netlify.com/drop)
для быстрой демки без CI.

---

## Интеграция в сообщество ВК

Отдельная пошаговая инструкция со всеми готовыми текстами:
[VK-INTEGRATION.md](VK-INTEGRATION.md).

Короткая версия:

1. Задеплоили → получили URL.
2. В сообществе ВК → **Управление → Кнопка действия → «Открыть сайт»** →
   вставить URL (с UTM-метками).
3. Опубликовать и закрепить пост со ссылкой.
4. Включить автоответ в сообщениях: «Вот тест, который покажет, где вы
   теряете клиентов — [ссылка]».

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
  "source": "vk_community",
  "source_url": "https://vk.com/ushakova_ai",
  "timestamp": "2026-04-21T12:00:00.000Z",
  "userAgent": "Mozilla/5.0 ...",
  "referrer": "https://m.vk.com/",
  "utm": {
    "utm_source": "vk",
    "utm_medium": "community",
    "utm_campaign": "cta_button"
  }
}
```

- `segment` ∈ `lost` | `overload` | `nosystem`.
- `utm` автоматически собирается из query-параметров (`utm_*`).
- Принять webhook можно в n8n / Make / Zapier / Airtable / собственном API
  / Telegram-боте через прокси.

### Fallback, если webhook недоступен

- `navigator.onLine === false` или сервер отвечает ошибкой / не отвечает
  10 секунд → лид записывается в `localStorage` (ключ
  `quiz-ushakova-ai:leads`, массив) и пользователю всё равно показывается
  экран «Спасибо», чтобы UX не ломался.
- Это сделано осознанно: для лид-магнита важнее не потерять доверие
  пользователя, чем потерять один лид. Рекомендуем мониторить webhook.

---

## Сегментация

Каждому варианту ответа присвоены теги
([src/data/questions.ts](src/data/questions.ts)). Алгоритм
в [src/utils/scoring.ts](src/utils/scoring.ts):

- Теги `chaos`, `lose`, `manual` → **lost** («Теряются заявки»).
- Теги `timeHeavy`, `slowAnswer`, `repeatQuestions` → **overload**
  («Перегруз и ручная работа»).
- Теги `dontUnderstand`, `partial`, `growth` → **nosystem** («Нет системы»).
- При равенстве очков приоритет: `lost > overload > nosystem`.
- Если все группы набрали ≤ 1 очка (разрозненные ответы) — `nosystem`.

Тексты сегментов — в [src/data/segments.ts](src/data/segments.ts).

---

## Структура проекта

```
├── index.html                  # meta / OG / favicon
├── vercel.json                 # SPA-fallback для Vercel
├── .env.example
├── VK-INTEGRATION.md           # пошаговая инструкция по ВК
├── public/
│   ├── favicon.svg
│   ├── og-cover.png            # превью ссылки 1200×630
│   └── _redirects              # SPA-fallback для Netlify
└── src/
    ├── main.tsx
    ├── App.tsx                 # компоновка экранов
    ├── index.css               # Tailwind + базовые стили
    ├── types.ts
    ├── constants/
    │   └── index.ts            # VK_COMMUNITY_URL, LEAD_SOURCE, storage keys, meta
    ├── data/
    │   ├── questions.ts        # 5 вопросов + теги
    │   └── segments.ts         # 3 сегмента (заголовок/текст/решение/буллеты)
    ├── hooks/
    │   ├── useAnswers.ts       # state + localStorage ответов
    │   └── useQuizFlow.ts      # state-machine квиза
    ├── utils/
    │   ├── scoring.ts          # вычисление сегмента
    │   ├── validation.ts       # валидация имени и контакта
    │   └── api.ts              # POST лида + fallback в localStorage
    ├── components/             # UI-примитивы
    │   ├── ScreenShell.tsx
    │   ├── ProgressBar.tsx
    │   ├── PrimaryButton.tsx
    │   ├── OptionButton.tsx
    │   ├── FormField.tsx
    │   └── Brand.tsx
    └── screens/                # отдельные экраны
        ├── IntroScreen.tsx
        ├── QuestionScreen.tsx
        ├── ResultScreen.tsx
        ├── LeadScreen.tsx
        └── ThanksScreen.tsx
```

---

## Что дальше (идеи)

- Счётчик событий (Яндекс.Метрика / VK-пиксель) с `reachGoal` на шагах.
- A/B на заголовке интро.
- Отдельный dashboard для просмотра локально сохранённых лидов на случай
  падения webhook.
