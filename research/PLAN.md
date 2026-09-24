# CalcLumen — план работ (упорядоченная очередь)

Дневной авто-аналитик и любая сессия берут **следующую невыполненную** задачу
отсюда, сверху вниз. Пусто → берём из `research/IDEAS.md`. Взятое помечай `[x]`
и дописывай хеш коммита. Стратегия/контекст — в памяти проекта.

**Правила:** одна задача за прогон · зелёный `npm run build` перед деплоем ·
один пуш · крупное/рискованное (помечено ⚠️) — сначала владельцу, не авто-строить.

---

## A. Текущий недельный план (доделать первым)

- [ ] **Day 4** — опорный гайд (напр. «Roth vs Traditional IRA», связать
      roth-ira/401k/capital-gains/hsa/retirement) + заполнить пустые офферные
      кластеры **AUTO** и **HOME** (если есть одобренные партнёрки; иначе — владельцу).
- [ ] **Day 5** — CTR/мета/схема: переписать title+description money-страниц под
      клики; видимый «Updated {месяц}» на калькуляторах; проверить FAQ/HowTo schema
      на новых; target-heart-rate title под клик.
- [ ] **Day 6** — data-driven усиление: свежий GSC pull → где близко к топу, точечно
      усилить (worked examples / FAQ / related). Без нового тонкого программатика.
- [ ] **Day 7** — ревизия: URL-инспекция (что проиндексировалось), Request Indexing
      следующей десятки, прогнать `/morning-seo`, скорректировать план.

---

## B. Из конкурентного анализа (2026-09-24) — ПОСЛЕ недельного плана, по CPM

### B1. Строительные / DIY-калькуляторы (high-CPM whitespace, быстрые победы)
Категория `homediy`. Паттерн: registry (+isNew) → компонент → страница → кластер.
- [ ] roofing-calculator (площадь кровли, пачки черепицы, waste %)
- [ ] mulch-calculator (куб. ярды / мешки по площади и глубине)
- [ ] deck-calculator (доски настила, лаги, крепёж)
- [ ] drywall-calculator (листы, шпаклёвка, саморезы)
- [ ] stair-calculator (высота/глубина ступеней, кол-во ступеней)
- [ ] solar-panel-calculator (кол-во панелей, покрытие счёта, окупаемость) — high-CPM
- [ ] insulation-calculator (R-value, площадь, рулоны)
- [ ] rebar-calculator / board-foot-calculator (по остаточному спросу)

### B2. Гео take-home pay / income-tax по юрисдикциям (programmatic, топовый CPM)
- [ ] ⚠️ КРУПНОЕ — сначала владельцу. Прототип: take-home pay для 2–3 штатов US
      (шаблон + налоговые таблицы) как образец программной генерации → далее все
      штаты + UK. Согласовать источник налоговых данных и объём до массовой генерации.

### B3. Достройка finance-сюита (high-CPM)
- [ ] annuity / present-value / future-value / NPV / IRR / CAGR
- [ ] RMD · Social Security estimate · traditional IRA
- [ ] depreciation (MACRS / straight-line)
- [ ] rental-property ROI / DSCR
- [ ] life-insurance needs
- [ ] FICA / self-employment tax
- [ ] property-tax

### B4. Рост — embeddable-виджет (backlink-движок)
- [ ] ⚠️ КРУПНОЕ — сначала владельцу. Спроектировать встраиваемый калькулятор
      (iframe/скрипт) с ОБЯЗАТЕЛЬНЫМ бэклинком на calclumen.com (модель Omni).
      Бьёт в дефицит №1 (внешние ссылки). Сначала дизайн/согласование.

---

## D. Аналитика: события GA4 + цели (кросс-задача, можно инкрементально)
Цель — видеть, ЧТО популярно, КУДА жмут, ЧЕМ пользуются, что конвертит. GA4 уже
подключён (G-JY9FBM2921, Consent Mode v2), но кастомных событий пока нет.
- [ ] Хелпер `track(event, params)` в `src/lib/analytics.ts` — обёртка над
      `gtag('event', …)` через dataLayer, УВАЖАЯ согласие (события только при
      analytics granted, как в `src/lib/consent.ts`). Без PII и без значений
      вводимых сумм.
- [ ] Инструментировать ключевые действия:
      • `calculator_use { calc: slug }` — первый значимый расчёт/ввод на странице
        (что реально используют, а не только смотрят)
      • `offer_click { offer_id, placement }` — клики по офферам/CTA (МОНЕТИЗАЦИЯ:
        affiliate-block, eu-offer-block, home-offers, offer-panel) — [ключевое]
      • `result_action { action: copy|share|save }` — result-actions.tsx
      • `feedback_open` / `feedback_send` — feedback-fab.tsx
      • `support_copy_address { chain }` / `support_share { network }` — /support
      • `network_click { site }` — кросс-промо (network-promo, футер)
      • `outbound_click { host }` — прочие внешние ссылки (по желанию)
- [ ] В GA4 (UI, владелец): пометить `offer_click`, `feedback_send`,
      `support_copy_address` как key events (цели/конверсии).
- [ ] Дальше по данным: какие калькуляторы деглубить, какие офферы работают, что
      убрать. Кормит Day 6 (data-driven) и решения по контенту/монетизации.
Гардрейлы: без персональных данных и без значений вводимых сумм; события только с
согласием; не ломать существующий GA / Consent Mode.

## C. Опционально (низкий CPM, осторожно — риск тонких страниц)
- [ ] cooking/baking конверсии (cups↔grams, oven temps) — только топ-спрос, не массово
- [ ] health: TDEE · BAC · pregnancy weight gain

## 🔴 НЕ строить (конкуренты все на этом, но ~0 CPM, тонкие/vanity — мы это вырезали)
Статистика (ANOVA/регрессия/z-score/распределения), физика/химия (Ohm's law,
molar mass, gas laws, projectile), 3D-геометрия/тригонометрия, крипто/dev-тулзы
(base64/subnet/password-gen), fun (love/dice/golf-handicap/shoe-size).
