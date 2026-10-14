# CalcLumen — монетизация и перелинковка (единый справочник)

Актуально на **2026-10-09**. Источник правды по рекламе, партнёркам и внутренним
ссылкам. Код живёт в `src/lib/offers.ts` (офферы), `src/lib/network.ts` (сеть),
`src/lib/cross-links.ts` (контекстные), `src/lib/spotlight.ts` (Spotlight),
`src/app/ads.txt/route.ts` (ads.txt). Детали API сетей — память [[affiliate-api-access]].

---

## Сводка каналов (статусы: `активна` · `ждёт` · `рано` · `нет`)

| Канал | Статус | Доход/мес | Условия / ссылка |
|---|---|---|---|
| AdSense | рано | — | порог трафика не достигнут; pub `ca-pub-5535516142831006` |
| Amazon Associates | активна | — | tag `calclumen-20`; search-ссылки (без цен/фото до PA-API); карточки «Materials for this project» на DIY/electricity/health/finance-страницах. ⚠️ правило 3 продаж/180д (owner нагонит сетью); добавить сайт в Associates Central → Manage Your Websites. OneLink для UK/CA/AU — позже |
| Upgrade (кредиты) | активна | — | FINANCIAL, все finance-калькуляторы · Indoleads |
| TradingView | активна | — | INVESTING (13 slug) · Indoleads |
| VEVOR | активна | — | HOME (все DIY) · Admitad, CPA 5% |
| Coursera | активна | — | EDUCATION (gpa/grade) · Admitad |
| Square | нет | — | ⚠️ Admitad ОТКАТИЛ аппрув (active→declined), убран из кода 12.10 |
| Doctronic | нет | — | ⚠️ Admitad отвязал программу, убран из кода 12.10 (health теперь AdSense-only) |
| Qustodio | активна | — | due-date/ovulation · Admitad |
| Instarem | активна | — | currency-converter · Indoleads |
| TECH (NordPass/EaseUS/PureVPN/Keycense) | активна | — | data-storage/number-base · Admitad |
| Costway | активна | — | HOME (DIY) · Indoleads `z15o.xyz/6acdd4ee5655f`, US 2.4%, промо COSTWAY10 |
| MacPaw (CleanMyMac) | активна | — | TECH · Indoleads `o10o.xyz/6acdd53578e2d`, WW 28-35%, промо MACPAW10 |
| BLUETTI | активна | — | electricity-cost, **только EU** · Indoleads |
| Cricut | ждёт | — | HOME/DIY · Admitad `49734` (pending) |
| Trademark Engine | нет | — | недоступен нашему Indoleads-аккаунту (0 в кабинете) |
| Way.com (AUTO) | нет | — | declined; переоценить с ростом трафика |
| Ezoic | нет | — | отклонён (сайт молодой), переподать позже |

_Доход везде «—»: конверсий пока 0 (трафик near-zero из-за понижения). Детали и полные
ссылки — ниже._

---

## 0. TL;DR — что где и какой rel

| Тип ссылки | rel | Follow? | Зачем |
|---|---|---|---|
| **Партнёрские офферы** | `sponsored nofollow noopener noreferrer` | ❌ **nofollow** | монетизация; Google требует `sponsored` |
| **Футер «From our network»** (сквозной) | `noopener` | ✅ **follow** | обмен весом между нашими сайтами |
| **Блок «From our network»** на главной | `noopener` | ✅ **follow** | то же |
| **Контекстные in-body ссылки на сеть** | `noopener` | ✅ **do-follow** | авторитет — сильнейший внутрисетевой сигнал |
| **Spotlight** (недельный слот) | внутр. `<Link>`, без rel | ✅ **do-follow** | внутр. перелинковка на money-страницы |
| **Embed «Powered by CalcLumen»** (на чужих сайтах) | `noopener` | ✅ **do-follow** | ВХОДЯЩИЕ бэклинки к нам |

**Правило:** всё, что зарабатывает (партнёрка/реклама) → `nofollow`. Всё, что про
авторитет/сеть → `do-follow`.

---

## 1. Реклама (деньги)

### 1.1. Дисплей — Google AdSense
- **Pub ID:** `ca-pub-5535516142831006` (общий аккаунт сети). В коде
  `src/lib/ads-config.ts`, переопределяется `NEXT_PUBLIC_ADSENSE_ID` в Vercel.
- **ads.txt:** `/ads.txt` отдаёт строку Google-продавца автоматически из pub id.
- **Статус:** обвязка (скрипт adsbygoogle + ads.txt) ЖИВАЯ на проде, но **сайт в
  AdSense ещё НЕ добавлен / не одобрен** — ждём трафик (сейчас понижение Google).
  Как появится качественный трафик → добавить сайт в AdSense (Sites → Add site),
  дождаться аппрува, ставить ad-юниты.
- **Ezoic:** отклонён 2026-08-27 (сайт молодой), скрипты отключены в коде;
  переподать через 3-6 мес с ростом трафика. Детали — [[calclumen-ezoic-integration]].
- **Sovrn Ad Exchange = Plan B** для дисплея, если AdSense откажет.
- **Media.net** — владелец может подать.

### 1.2. Партнёрские офферы (ЗАВЕДЕНЫ, живут на проде)
Рендерятся блоком под результатом калькулятора (`AffiliateBlock`), `rel="sponsored
nofollow"`, с FTC-дисклеймером. Привязка — по кластеру в `offersForCalc()`.

**Кластеры и где показываются:**

| Кластер | Оффер(ы) | На каких страницах | Сеть / ссылка | Гео |
|---|---|---|---|---|
| **FINANCIAL** | Upgrade (кредиты до $50k) | все finance-калькуляторы (mortgage, loan, debt-*, credit-card, dti, apr…) кроме investing/currency | Indoleads `gettracker.net/6aa298fc76f5f` | US |
| **INVESTING** (override) | TradingView | compound-interest, annuity, roi, rule-of-72, retirement-savings, 401k, roth-ira, hsa, capital-gains-tax, cd, savings-goal, simple-interest, inflation | Indoleads `z03o.xyz/6aa7cf97bf91e` | WW |
| **MONEY_TRANSFER** (override) | Instarem | currency-converter | Indoleads `i07o.xyz/6aa7cfe2483c4` | US/UK/CA/AU/EU/Asia |
| **BUSINESS** | NordVPN, Lenovo, OpenArt, Envato, Notion | business-калькуляторы (margin-markup, break-even, depreciation, sales-commission, discount…) | Admitad/Indoleads микс | US/UK/CA/AU + WW |
| **HOME** | **VEVOR** | все homediy (insulation, drywall, stair, roofing, deck, solar-panel, concrete, paint, tile, gravel, flooring, btu, electricity-cost…) | Admitad `rzekl.com/g/b9jm5dg8a8…` | Many GEOs (US/UK/CA/AU/EU) |
| **TECH** (override) | NordPass, EaseUS, PureVPN, Keycense | data-storage-converter, number-base-converter | Admitad микс | WW / US-UK-EU |
| **EDUCATION** (override) | Coursera | gpa-calculator, grade-calculator | Admitad `thevospad.com/…` | WW |
| **FITNESS** (health) | ⚠️ **ПУСТО** (Doctronic убран 12.10 — Admitad отвязал) | health AdSense-only, пока нет health-оффера | — | — |
| **PREGNANCY** (override) | Qustodio (родит. контроль) | due-date-calculator, ovulation-calculator | Admitad `zejcl.com/g/zgsaevrb3a…` | US/UK/CA/AU/DE/PL/BR |
| **AUTO** | ⚠️ **ПУСТО** | auto-loan, auto-lease, car-affordability | — | — |
| **EU-gated** (доп.) | BLUETTI | electricity-cost-calculator, **только EU-посетителям** (гейт по таймзоне, client-side) | Indoleads `z05o.xyz/6aa7d19799ad8` | EU |

**Домашняя ротация** (`HOME_FEATURED`, блок на главной, тасуется client-side):
NordVPN, Coursera, Lenovo, OpenArt, EaseUS, AdGuard, ProHoster, Qustodio, Envato, VEVOR.

**Полный список заведённых офферов (18):** Upgrade, Qustodio, NordVPN, Lenovo,
PureVPN, Coursera, OpenArt (15% OFF), EaseUS (20% OFF), AdGuard, ProHoster, NordPass,
Envato, Notion, Instarem, TradingView, Keycense, BLUETTI (EU), VEVOR.
_(убраны 12.10: Square, Doctronic — Admitad откатил/отвязал.)_

**Правила оффера:** только ТЕКСТ (баннеры не берём) · гео US/UK/CA/AU (или WW) ·
разрешён content-site/SEO трафик · Payoneer/крипто выплата · не дублировать между
сетями (брать одну) · приличный бренд (без инфо-продуктов «AI-investing»/серых займов).

### 1.3. Куда подать (офферы в работе)
Проверено 2026-10-08. **Admitad: автоподача через API МЁРТВА (HTTP 410)** — только
веб-кабинет (`store.admitad.com`, website id `2988056`). Indoleads — в кабинете
(API статус не отдаёт).

**Admitad:**
- ❌ **Square `114585`** — был одобрен 08.10, но Admitad ОТКАТИЛ (active→declined), убран из кода 12.10.
  ⚠️ **Урок: аппрувы Admitad откатываются.** Периодически (раз в неделю) сверять ЖИВЫЕ офферы, а не только заявки:
  `GET /advcampaigns/website/2988056/` → у каждого нашего оффера `connection_status` должен быть `active`.
- ⏳ **Cricut `49734`** — pending (HOME/DIY).
- ❌ снова declined (автоправило по трафику/возрасту, переоценить через 2-4 нед с ростом):
  Sam's Club `106720`, Chegg `28853`, **Way.com `29492`** (закрыл бы пустой AUTO!),
  Costway `116661`, Homestyler `114701`, Udemy `22448`, Great Courses `27425`.

**Indoleads — ПРОВЕРЕНО в кабинете 2026-10-13** (API-поле `applied` полностью врёт; статус виден только в вебе):
- ✅ Уже ОДОБРЕНЫ (approved/active): **Costway `21626`** + **MacPaw `2015`** → проведены в код 13.10 (HOME / TECH).
  Udemy `650` (approved, education — пока НЕ заводим, уже есть Coursera). Snoop `16850` (active, но Android/UK + без content-трафика → не подходит).
- ❌ НЕ в нашем аккаунте (0 результатов в кабинете): Trademark Engine `21829`, Homestyler `21808` — недоступны, подать нельзя.
- Трекинг-ссылки генерим в кабинете: деталь оффера → вкладка «Tracking link» → Source = https://calclumen.com → Generate.

**Дефициты / куда искать дальше:**
- **AUTO-кластер пуст** — нужен авто-оффер (Way.com declined; искать US авто-страховку/lead-gen).
- **US life/auto insurance lead-gen** — топовый CPM для калькуляторного сайта (их мало в Admitad/Indoleads; смотреть MaxBounty/FlexOffers/прямые).
- Солнечные панели (жирный CPA) под solar-panel-calculator.

### 1.4. Платёжные рельсы (ИП Кыргызстана)
Нет юрлица вне КГ → **Stripe напрямую недоступен.** Работает: **Admitad** (Payoneer),
**Indoleads** (Payoneer/крипто/USDT), **AdSense** (платит в КГ). Партнёрки выбираем
по наличию Payoneer/крипто-выплаты.

---

## 2. Внутренняя перелинковка (сеть сайтов)

### 2.1. Какие проекты рекламируем (сеть «From our network»)
Футер (сквозной) + карточный блок на главной. **FOLLOW** (`rel="noopener"`, без
nofollow) — обмен SEO-весом между нашими сайтами. Список в `src/lib/network.ts` (10 сайтов):

| Сайт | URL | Тема |
|---|---|---|
| CostTrek | costtrek.com/en | стоимость жизни, сравнение городов |
| Pawdget | pawdget.com | стоимость содержания питомцев |
| TheCryptoTools | thecryptotools.com | 69+ крипто-калькуляторов |
| iznkit | iznkit.com/en | калькуляторы + генераторы PDF (инвойсы) |
| IZN Tools | izntools.com | 100 браузерных утилит |
| OCR Snip | ocrsnip.com | выписки/картинки → таблица/текст |
| TestSweep | testsweep.com | тест железа в браузере |
| Foldout | foldoutkit.com | HTML/email/sheets шаблоны |
| foundaday | foundaday.com/en | ежедневные находки |
| Dasha Motion | dasha-motion.com/en | моушн-дизайн портфолио (сайт жены) |

**НЕ в сети (намеренно):** RU/KZ-сайты (prodom-expert.ru, 24zdorovie.com, bilimjol.com)
и izngames.com — чтобы не плодить кросс-языковой сквозной PBN-футпринт.
⚠️ Dasha Motion — iGaming-adjacent контент; при проблемах с AdSense её можно убрать.

### 2.2. Контекстные do-follow ссылки (исходящие, in-body) — `src/lib/cross-links.ts`
По одной естественной ссылке в теле 4 money-страниц. **DO-FOLLOW** (`rel="noopener"`).
Это сильнее футера (editorial in-body ценится, сквозное обесценивается).

| Страница calclumen | → на сайт | анкор |
|---|---|---|
| home-affordability-calculator | costtrek.com/en | «cost of living between two cities» |
| capital-gains-tax-calculator | thecryptotools.com | «crypto profit and DCA calculators» |
| budget-calculator | ocrsnip.com | «turn a bank statement into a spreadsheet» |
| margin-markup-calculator | iznkit.com/en | «generate an invoice or quote as a PDF» |

### 2.3. Spotlight (внутренний, недельный) — `src/lib/spotlight.ts`
Карточка «Spotlight this week» на главной. **Внутренняя do-follow** ссылка на одну
из наших money-страниц/гайдов, ротация по ISO-неделе (серверно → в статическом HTML,
краулится). Список из 10: mortgage, compound-interest, rental-property, debt-payoff,
depreciation, capital-gains, 401k, salary-to-hourly + гайды Roth-vs-Traditional-IRA,
how-much-house-can-you-afford.

### 2.4. Embed-виджет «Powered by CalcLumen» — `src/lib/embeddable.ts`
Встраиваемый калькулятор (8 флагманов). Сниппет для блогера = iframe + видимая
**do-follow** ссылка «Powered by CalcLumen» в HTML ЕГО сайта → это **входящий**
бэклинк к нам. Главный код-рычаг авторитета.

### 2.5. Входящие ссылки с сети (рычаг №1, owner-side)
Чтобы авторитет рос у САМОГО calclumen, нужны ВХОДЯЩИЕ do-follow ссылки с сетевых
сайтов на наши money-страницы (costtrek→home-affordability, thecryptotools→capital-gains
и т.д.). Делается в репозиториях тех сайтов. Готовые промты (общий сетевой +
calclumen-специфичный) — у владельца, задачи розданы 2026-10-08.
НЕ донор: dasha-motion (iGaming-adjacent).

---

## 3. Как завести новый одобренный оффер (чеклист)
1. В кабинете сети сгенерить трекинг-ссылку с `source=calclumen.com` (Admitad —
   website id 2988056; базовый `gotolink` уже кодирует сайт).
2. В `src/lib/offers.ts`: добавить `const X: Offer = {...}` (текст, blurb, cta, url).
3. Добавить в нужный `OfferGroup` (или slug-override Set). Не дублировать между сетями.
4. (Опц.) добавить в `HOME_FEATURED` для ротации на главной.
5. `npm run build` локально → проверить в HTML (rel sponsored nofollow, правильный кластер) → коммит → пуш.
6. Обновить этот файл.
