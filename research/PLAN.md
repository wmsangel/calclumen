# CalcLumen — план работ (единый источник)

Дневной авто-аналитик и любая сессия берут **следующую невыполненную** задачу из
очереди «🎯 Следующие 10 запусков», сверху вниз. Пусто → из `research/IDEAS.md` →
из памяти. Взятое помечай `[x]` + хеш коммита.

**Правила:** одна задача за запуск · зелёный `npm run build` перед деплоем · один пуш ·
после публикации `node scripts/indexnow.mjs` (стейт-коммит локально, не пушить) ·
`⚠️` = крупное/рискованное → НЕ авто-строить, только владельцу.

Актуализировано: **2026-10-01** · калькуляторов: **125**.

---

## 🚨 Контекст №1: восстановление после понижения Google
Диагноз 2026-09-28: домен алгоритмически понижен (159k показов/день в конце авг →
~2/день весь сент), из-за молодого домена + ~0 бэклинков + 96% тонких шаблонных
страниц. Не техника (robots/sitemap/CWV чисто), Bing показывает. Рычаги восстановления:
1. **Чистка тонкого** — ✅ сделано (noindex units/roman/data/combinations + математика; sitemap 2929→152).
2. **Бэклинки (авторитет)** — 🔴 owner, рычаг №1, в работе («ждём, там разместили»).
3. **Содержательный контент** — каждый запуск = уникальный finance/DIY-калькулятор, НИКОГДА не тонкий.
4. **Ждать** — Google переоценивает неделями; мониторим (см. ниже).

---

## 🎯 СЛЕДУЮЩИЕ 10 ЗАПУСКОВ (очередь — сверху вниз, по одной)
Баланс: high-CPM finance (B3) + строительные под пустой HOME (B1) + аналитика (D).
Каждый: registry(+isNew) → компонент → страница (intro/steps/FAQ) → кластер/связки.

- [ ] **Переотправить https://calclumen.com/sitemap.xml в GSC** — Google не скачивал его 21 день, т.е. ещё не видел чистку (живой sitemap уже 161 URL вместо 2929); заодно проверить, что lastmod не проставляется всем URL одинаковым временем сборки (SEO, 2026-10-03)
- [x] **1. solar-panel-calculator** (B1) ✅ 2026-09-29 — панели/кВт/стоимость/окупаемость
      с учётом 30% налог. кредита; homediy, рядом с electricity-cost.
- [x] **2. self-employment-tax-calculator** (B3) ✅ 2026-09-29 — SECA: 12.4% SS до потолка +
      2.9% Medicare на 92.35% прибыли, вычитаемая половина; income-tax кластер.
- [x] **3. annuity-calculator** (B3) ✅ 2026-09-30 — PV/FV аннуитета, ordinary/due, частота
      выплат, график; retirement-investing кластер + INVESTING-офферы + compound-гайд.
- [x] **4. drywall-calculator** (B1) ✅ 2026-10-01 — листы (4×8/10/12), стены+потолок, шпаклёвка,
      лента, саморезы, waste, стоимость. HOME, пара к VEVOR.
- [x] **5. rmd-calculator** (B3) ✅ 2026-10-01 — RMD по таблице IRS Uniform Lifetime; retirement-investing кластер.
- [x] **6. stair-calculator** (B1) ✅ 2026-10-01 — ступени/подступёнок/косоур + проверка норм IRC; homediy.
- [x] **7. rental-property-calculator** (B3) ✅ 2026-10-05 — cash flow / cash-on-cash / cap rate / DSCR;
      retirement-investing кластер, finance→FINANCIAL оффер (кредит). Недвижимость-инвестиции, high-CPM.
- [x] **8. insulation-calculator** (B1) ✅ 2026-10-05 — R нужно добавить, толщина слоя, пакеты (рулоны/плиты/мешки), стоимость + waste; homediy.
- [x] **9. depreciation-calculator** (B3) ✅ 2026-10-05 — straight-line / double-declining (switch to SL) / MACRS (IRS GDS half-year 3-20yr);
      год-за-годом график (depr/accum/book). Категория business (рядом с margin/break-even; business-офферы).
- [ ] **10. Аналитика GA4 (D, кросс-задача)** — хелпер `track()` + ключевые события
      (`offer_click`, `calculator_use`, `feedback_*`, `support_*`). Даёт данные для решений.
      (Может делать основная сессия — трогает много компонентов.)

**После десятки:** остаток — property-tax, traditional-IRA/Social-Security estimate,
NPV/IRR/CAGR, board-foot/rebar; затем C (опционально) и точечные CTR-правки по GSC.

---

## ✅ Сделано (лог)
- Недельный план Day 1–7 (хаб + перелинковка, PMI, freshness/схема, Day6 APR, Day7 ревизия).
- **A2: чистка тонкого программатика** (2dcf113) — noindex units/roman/data/combinations, sitemap→152.
- B1: roofing (a5c1149), deck (7d3b072); mulch = покрыт gravel-calculator.
- B3: **life-insurance** (277a3a4, DIME).
- Finance-калькуляторы ранее: mortgage/PMI/HELOC/refinance/biweekly, 401k/roth/hsa/529/capital-gains,
  income-tax/paycheck/student-loan/debt-* и т.д.
- Сеть «From our network»: +OCR Snip, +foundaday, +Dasha Motion (10 сайтов).
- AdSense-обвязка живая на проде (ads.txt + adsbygoogle), ждём readiness.

---

## 📌 Событийное / по решению владельца (НЕ в авто-очереди)
- **VEVOR — ОДОБРЕН + ПРОВЕДЁН 2026-10-05** (Admitad rzekl.com, per-sale `https://rzekl.com/g/b9jm5dg8a845d9374ef3fcfaae913b/`,
  CPA 5% / AOV $200+ / 45-day cookie / Many GEOs US-UK-CA-AU-EU → ungated). Текстовый оффер `VEVOR`
  в `HOME` OfferGroup + добавлен в `HOME_FEATURED` ротацию → на всех homediy-калькуляторах + главной.
  Баннеры НЕ берём (правило text-only). Owner при желании может добавить SubID в Admitad для пер-сайт атрибуции.
- **Costway** (Indoleads, подан 2026-09-28) — всё ещё ЖДЁМ аппрув → как одобрят, добавить вторым оффером в `HOME`.
  Искать дальше: US-страхование жизни/авто, солнечные панели (жирный CPA).
- **⚠️ B2. Гео take-home pay / income-tax по штатам US + UK** — крупный programmatic,
  топовый CPM. Сначала владельцу (источник налоговых данных + объём).
- **✅ B4. Embeddable-виджет (backlink-движок) — СДЕЛАНО 2026-10-06 (8a2668e), owner-approved.**
  `/embed/<slug>` без chrome (noindex, не в sitemap, без AdSense) + панель «Embed this calculator»
  со сниппетом (iframe + do-follow «Powered by CalcLumen» в HTML хоста = link equity). 8 флагманов.
  Дальше: мониторить появление встраиваний/бэклинков (CF referrers, GSC links), расширять набор по спросу.
- **⚠️ E. Контекстные do-follow ссылки на сеть** — карта готова (внизу файла), approve-first.
- **Sovrn Ad Exchange = Plan B** для дисплея, если AdSense откажет по качеству/трафику.
- **Бэклинки на money-страницы** с сетевых сайтов владельца — рычаг №1 (owner).
- **AdSense**: подавать, когда readiness-сигнал позеленеет (сейчас NOT YET из-за понижения).

---

## 🔭 Мониторинг (watch, не задача — через `/morning-seo` и авто-аналитик)
- Google-показы (растут ли с ~2/день).
- Money-страницы: «unknown / crawled-not-indexed» → «indexed».
- Частота обхода Googlebot (crawl stats).
- AdSense-readiness: quality-клики 28д.

---

## C. Опционально (низкий CPM, осторожно — риск тонких страниц)
- [ ] cooking/baking конверсии (cups↔grams, oven temps) — только топ-спрос, не массово
- [ ] health: TDEE · BAC · pregnancy weight gain

## 🔴 НЕ строить (~0 CPM, тонкие/vanity — мы это вырезали)
Статистика (ANOVA/регрессия/z-score), физика/химия (Ohm's law, molar mass, gas laws),
3D-геометрия/тригонометрия, крипто/dev-тулзы (base64/subnet), fun (love/dice/golf/shoe-size).

---

## ⚠️ E (детали). Карта контекстных do-follow ссылок — approve-first
Постоянные in-body ссылки в теле контента на близкие сайты сети (единственный кросс-линк,
который Google ценит; футер/ротация обесцениваются, «все ко всем» = link scheme). Дополняет
футер-сеть, не заменяет. Внедрять по одной, максимум ~4 на старте, do-follow, естественным
анкором; **сперва показать владельцу**. Нужна мелкая доработка контент-модели (сейчас intro
калькулятора и тело гайда без inline-ссылок).
1. home-affordability (/rent-afford/salary) → **costtrek.com/en** — «cost of living in another city». ⭐
2. capital-gains-tax → **thecryptotools.com** — «crypto profit & DCA calculators» (если крипта в тексте).
3. budget-calculator → **ocrsnip.com** — «turn bank statements into a spreadsheet».
4. margin-markup (/sales-commission) → **iznkit.com/en** — «generate an invoice/quote PDF».
Опц.: budget→pawdget («cost of owning a dog»); calorie/macro→24zdorovie.com/en (health↔health, EN-only, низкий приоритет).
НЕ линкуем контекстно: testsweep, foldoutkit, izntools, foundaday, izngames, dasha-motion, RU/KY-сайты.
