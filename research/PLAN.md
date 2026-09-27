# CalcLumen — план работ (упорядоченная очередь)

Дневной авто-аналитик и любая сессия берут **следующую невыполненную** задачу
отсюда, сверху вниз. Пусто → берём из `research/IDEAS.md`. Взятое помечай `[x]`
и дописывай хеш коммита. Стратегия/контекст — в памяти проекта.

**Правила:** одна задача за прогон · зелёный `npm run build` перед деплоем ·
один пуш · крупное/рискованное (помечено ⚠️) — сначала владельцу, не авто-строить.

---

## A. Текущий недельный план (доделать первым)

- [x] **Day 4** — опорный гайд «Roth vs Traditional IRA» (`/en/guides/roth-vs-traditional-ira`,
      связан roth-ira/401k/retirement/hsa/capital-gains) — c3f2ed0 (2026-09-25).
      ⏳ Офферные кластеры **AUTO** и **HOME** — ждут одобренных партнёрок от владельца.
- [x] **Day 5** — freshness/схема/CTR (commit при пуше): видимый «Updated {Month Year}»
      на всех калькуляторах (build-time, calc-shell) + `dateModified` в WebApplication
      JSON-LD; FAQ/HowTo schema проверено (эмитятся CalcShell для всех); target-heart-rate
      description переписан под клики. Массовый rewrite title+description money-страниц —
      делать НЕ вслепую, а точечно в Day 6 по GSC-данным (какие близко к топу).
- [x] **Day 6** — data-driven усиление: свежий GSC pull → где близко к топу, точечно
      усилить (worked examples / FAQ / related). Без нового тонкого программатика.
      — dec3cd2 (2026-09-26): GSC 28д — money-страницы все на поз. 57–95, «близко к
      топу» нет; самый плотный спрос-кластер = APR (monthly rate→APR, APR vs APY,
      APR from payment) → apr-calculator: блок worked examples + 3 FAQ + meta.
      Следующие кандидаты тем же приёмом: margin-vs-markup гайд (34 impr, поз. 92),
      car-affordability (33 impr «car affordability calculator», поз. 78),
      how-to-calculate-roi гайд (18 impr, поз. 89).
- [x] **Day 7** — ревизия: URL-инспекция (что проиндексировалось), Request Indexing
      следующей десятки, прогнать `/morning-seo`, скорректировать план.
      — 2026-09-27 (ревизия, без деплоя). Итоги:
      · **GSC (API, dataState=all):** после одиночного всплеска 28.08 (139k impr, units)
        видимость рухнула до 0–6 impr/день с ~05.09 и так держится 3 недели. Сайт
        по сути не ранжируется в Google. CF: 10–90 визитов/день, в основном Bing/Yahoo.
      · **URL-инспекция (выборка ~150 URL):** 56 indexed / 38 crawled-not-indexed /
        86 unknown. Флагманы high-CPM — **crawled, not indexed**: mortgage-calculator,
        compound-interest, auto-loan, credit-card-payoff, hsa, discount, age, хабы
        /finance /health /date-time, гайды how-much-house / emergency-fund.
        **Unknown to Google**: paycheck, income-tax, student-loan, roth-ira, pmi, dti,
        ltv, refinance, home-equity, debt-consolidation, biweekly, capital-gains,
        net-worth, margin-markup, /guides, гайды roth-vs-traditional-ira и
        how-mortgage-payments-work.
      · **Request Indexing (владелец, GSC UI)** — следующая десятка по CPM:
        mortgage-calculator, paycheck-calculator, income-tax-calculator,
        debt-consolidation-calculator, home-equity-calculator, student-loan-calculator,
        roth-ira-calculator, compound-interest-calculator, auto-loan-calculator,
        /en/guides/roth-vs-traditional-ira.
      · `/morning-seo` в авто-прогоне недоступен — данные взяты из stats.db + GSC API.
      · **Вывод для плана:** «crawled-not-indexed» на лучших страницах + ~3960
        программатических URL на молодом домене без ссылок = сигнал site-wide quality
        (scaled/thin). Новые калькуляторы (B1) не решат индексацию. См. ⚠️ A2 ниже.

## A2. ⚠️ КРУПНОЕ — индексация (решение владельца, 2026-09-27)
- [ ] ⚠️ Сократить индексируемый программатик (noindex/исключение из sitemap
      тонких /units, /data, /combinations, /factors, /is-prime, /simplify и т.п.,
      оставив топ-спрос), чтобы краулинговый бюджет и quality-сигнал ушли на
      money-страницы. Массовый noindex — только по решению владельца.
- [ ] Беклинки на 5–10 money-страниц с сетевых сайтов владельца (рычаг №1).

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
