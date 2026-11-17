# CJ Affiliate (Commission Junction) — статус подключения calclumen.com

Решение владельца 16.11.2026 (через диспетчера): подключаем CJ и Awin; для calclumen — налоговые
рекламодатели под tax-хаб к сезону (январь–апрель 2027) + 1–2 кредитных/сберегательных под money-страницы.
Общий справочник каналов — `MONETIZATION.md`; API сетей — память `affiliate-api-access`.

## Аккаунт и площадка (проверено 16.11 в Chrome владельца, только чтение)
- CJ publisher **CID 7734055**, PID **8049842** (профиль «IZN», Bishkek KG, publisher since Oct 2026).
- Промо-площадка **есть**: «CalcLumen (calclumen.com) – Calculators & Guides», Property ID **101867578**,
  тип Website, модели Content/Blog/Media + Product Comparison/Reviews, статус Active, Primary.
- Network Profile: описание заполнено (1528 симв., минимум 250), документы — optional, пусто.
  ⚠️ Описание устарело: «89 калькуляторов и 20 гайдов» → сейчас 135 и 26; обновить текст (владелец или сессия
  после «да»). Подпись «Please complete your Network Profile» у кнопок Apply — похоже, дежурная разметка:
  профиль формально полон.
- История заявок (поданы 24.10): **Aflac** 5424279 — pending; **AAA Auto Club** 5128949 — declined (было pending);
  **Aeroflow** 4959947 — declined; **Ally Deposits** 5300495 — declined. Активных программ 0.

## Рекламодатели под calclumen (поиск 16.11, Keyword(s), Status=All)

| Рекламодатель | CJ ID | Категория | Условия (из карточки) | 3-мес EPC | Куда ставить | Статус |
|---|---|---|---|---|---|---|
| **TurboTax (Intuit)** | 1905878 | Tax Services, US | TY25: 15% TurboTax Online (federal+state); сезон 01.01–15.04, пики до 15.02 и 1–15.04 | $30.59 | tax-хаб: quarterly-estimated-tax, 1099-vs-w2, irs-penalty, income-tax, self-employment-tax, bonus-tax | **PENDING** (подано 16.11, manual review) |
| **TaxAct** | 4110283 | Tax Services, US | Sale 10% | $25.87 | те же tax-страницы (2-й вариант «file with…») | **PENDING** (подано 16.11) |
| **FreeTaxUSA** | 4526117 | Tax Services, US | 15% база, cookie 90 дней, co-branded LP; «lower approval odds» | $1.96 | бюджетный вариант под self-employed/1099 | **DECLINED** (авто-отказ сразу после подачи 16.11; переподать при росте трафика) |
| **TaxSlayer** | 5273914 | Tax Services, US | 0–10% за e-file (classic/premium/SE), cookie 30 дней | $0.25 | резерв (низкий EPC) | **PENDING** (клик 16.11 проявился в списке 17.11 — CJ показывает заявку с задержкой до суток) |
| Intuit Small Business (QuickBooks) | 2271086 | Productivity | Sale $55, lead $0–5 | $66.35 | self-employment-tax, 1099-vs-w2 (бухгалтерия для ИП) | кандидат, не в списке владельца |
| **Barclays US Online Savings** | 4931276 | Banking, US | Lead $0–250 | $1,115.85 | savings-goal, emergency-fund, compound-interest, cd, apy, hysa-контекст | подано повторно 17.11 (кнопка погасла, «manual review»); в Pending появится с задержкой — проверить чт 19.11 |
| **Mortgage Research Center** | 7647072 | Mortgage Loans, US | Lead 60% (rev-share); «lower approval odds»; CJ показывает «profile matches an advertiser auto-decline rule» | $110.46 | mortgage, refinance, home-affordability, biweekly, points | подано повторно 17.11; CJ предупреждает об auto-decline rule — ждём статус чт 19.11 |
| RenoFi | 8033802 | Mortgage Loans, US | Sale $20 (новый) | new | home-equity (HELOC), renovation | кандидат (⭐ в PLAN с 27.10) |
| LendingTree | 4884367 | Personal Loans, US | Lead до $35 за форму, cookie 14 дней | $0.00 | loan, debt-consolidation | кандидат, EPC нулевой — позже |
| Axos Bank | 6828337 | Banking, US | (условия в карточке) | $543.74 | savings/checking | кандидат |
| Experian.com | 2591819 | Credit Reporting | Sale $12–31, lead $12–50; «lower odds» | $85.93 | dti, credit-card-payoff, debt-payoff | кандидат |

**Нет в CJ:** H&R Block (0 результатов; программа у Impact), Credit Karma (0; это Intuit, отдельной CJ-программы нет).

## Статус заявок и кто делает
- 17.11: владелец разрешил сессиям все клики в кабинетах («открывайте Chrome и делайте»). Повторная подача Barclays и MRC сделана сессией 17.11;
  TaxSlayer оказался pending (заявка 16.11 появилась в списке через сутки). В кабинете висит **Pending Offer** 6038648 Velocity Outdoor /
  Ravin Crossbows (арбалеты, 5 %) — к calclumen не относится, не принят и не отклонён (аккаунт общий, решает диспетчер/almanackit).
- 16.11, второй заход (разрешение владельца 16.11 в CLAUDE.md): классификатор пропустил; **TurboTax и TaxAct — pending**, FreeTaxUSA — авто-declined. TaxSlayer, Barclays, MRC: кнопка Apply гаснет с подсказкой «will be manually reviewed», но записи не появляется (проверено в Pending/Declined после каждой попытки) — у владельца в браузере может показаться диалог/ошибка, которых сессия не видит. Первая попытка (до разрешения) была срезана классификатором.
  Варианты: (а) владелец кликает сам по списку выше (Partners → Find Advertisers → Keyword → Apply, площадка
  101867578, принять условия конкретной программы); (б) диспетчер решает иначе.
- После одобрения сессия сама: берёт tracking-ссылку (Links → Get Links, формат `https://www.anrdoezrs.net/click-<PID>-<linkId>`
  или `…/links/<PID>/type/dlg/...`), добавляет `?sid=<slug>` и заводит в `src/lib/offers.ts` (кластер TAX — новый; SAVINGS/MORTGAGE —
  существующие money-страницы), с пометкой рекламы, ниже блока «How it works», только на тематических страницах.

## Sub-id (правило сети: ссылка готова только после клика на проде с проверкой sub-id в отчёте)
- Параметр CJ: **`sid`** (Shopper ID), добавляется к tracking-ссылке `?sid=<значение>` (или `&sid=`), до **64 символов**;
  запрещены `" / < > ? \ | * : '`, пробелы/запятые/точки/@ — только URL-encoded; не ставить `0`.
  В отчётах: Reports → Performance/Transactions, группировка «SID» (Order By: SID). Источники: sugarrae.com (гайд по SID
  «большой тройки»), strackr.com/docs/cj-affiliate (sid, 64), affluent.io. Официальную справку CJ (support.cj.com) проверить
  при первом клике — developers.cj.com отдаёт пустую страницу без логина.
- Значение для calclumen: `sid=<slug-страницы>` (например `sid=quarterly-estimated-tax-calculator`), чтобы отчёт показывал
  страницу-источник. Проверка: клик на проде → через 1–2 ч строка в Reports с нашим SID.

## Сроки
- CRM-задача: заявки CJ (TurboTax, TaxAct, FreeTaxUSA, TaxSlayer, Barclays, Mortgage Research Center) — срок 19.11 (день офферов),
  не позже 21.11; аппрувы у tax-рекламодателей обычно 3–10 дней; блоки нужны на проде к старту сезона 01.01.2027.

## Network Profile — готовый текст описания (сохранение в кабинете классификатор срезал 16.11; вставляет владелец)
Маршрут: members.cj.com → Home → в блоке Announcements ссылка «Network Profile» (или Account → Network Profile → General) →
EDIT → заменить текст → SAVE. Лимит 4000 символов, текст ниже ≈ 2 300.

```
CalcLumen (calclumen.com) is a free online calculator and converter platform for an English-speaking audience in the United States, United Kingdom, Canada and Australia. The site offers 135 interactive calculators and 26 in-depth guides across personal finance, tax, auto, business, health, home improvement, dates and math — including mortgage, refinance, home affordability, mortgage points, rent vs buy, loan, debt payoff, balance transfer, compound interest, savings goal, CD and APY, retirement and 401(k), paycheck, income tax, bonus tax and self-employment tax. A self-employed tax hub (quarterly estimated tax, 1099 vs W-2 and IRS penalty calculators) launches for the January–April 2027 filing season.

Every calculator page is a working tool first: results render instantly, then the page explains the formula, the assumptions and what is not modelled, and links primary sources (IRS publications, SSA, CFPB, Regulation Z). The 20 highest-intent money pages carry a methodology and sources section; every page shows a named reviewer and a last-updated date. The site publishes an editorial policy, an advertising disclosure and a disclaimer, and is hand-built — no AI content farm.

Audience and traffic: 100% organic search (Google, Bing). No paid traffic, no incentivized clicks, no coupon or cashback mechanics. Visitors arrive with a specific money question (a payment, a tax bill, a savings target) — high commercial intent at the moment of decision. The site launched in 2026 and is still building traffic; we do not inflate numbers.

Promotional methods: contextual text links and a clearly labelled "services you may like" block placed below the calculator's explanation, only on topically matching pages — tax-filing software on tax calculators, savings accounts on savings calculators, mortgage lenders on mortgage calculators. No pop-ups, no email blasts, no PPC, no trademark bidding. Tracking: one link per page with a sub-ID (sid) so every click is attributable to its source page.

Publisher: Igor Zagorodnyi, independent software developer building web tools since 2010 (Bishkek, Kyrgyzstan). Contact: info@calclumen.com.
```

---

# Media.net — план Б по рекламе (решение владельца 17.11.2026)

Контекст: AdSense отказал 10.11 («бесполезный контент»), переподача не раньше 25.11. Трафик calclumen ~760 визитов/28д (CF RUM),
поиск почти целиком Bing (28д: Bing 10 672 показов / 11 кликов, Google 11 показов / 0). Media.net — контекстная сеть на
Yahoo/Bing-спросе, формально подходит под источник трафика.

## Рельсы (проверка 17.11 по официальным страницам media.net)
- **Публичных условий выплат у Media.net нет**: /faq — 404, /legal/tos — это Terms of Use сайта (без выплат), /publishers — маркетинг,
  /contact — форма (Region, «What You Do: Publisher/Media Owner») + «Publisher Inquiries: pubsales@media.net». Самостоятельной
  регистрации (sign-up) на сайте нет — вход через запрос в pubsales / форму, договор и платёжные условия показывают после одобрения.
- **Официальная Inventory Policy** (/legal/inventorypolicies/): сайт должен принадлежать паблишеру; обязателен **ads.txt** с их
  строками до запуска; оригинальный контент и удобная навигация; трафик «primarily from organic sources» (покупной/мотивированный —
  бан); запрещено: adult, наркотики, гемблинг, пиратство, hate; **ограничено (может считаться запрещённым): cryptocurrency**,
  алкоголь, рецептурные препараты, sexual health и т.п. — у нас крипта только во внешних ссылках сети (The Crypto Tools) и
  capital-gains; при подаче не выпячивать. Нельзя: менять размер/кэшировать/стекать блоки, двойные iframe, маскировать под контент.
  Требований по языку, гео и минимальному трафику в политике НЕТ (на сайте вообще нет).
- **Неофициально (обзоры, не подтверждено Media.net):** выплаты NET-30 (через 30 дней после конца месяца), минимум **$100**,
  способы — **wire** и **Payoneer** (PayPal по большинству источников нет); контент на английском; трафик преимущественно US/UK/CA;
  одобрение выборочное, при малом трафике отказывают.
- **Кыргызстан:** в официальных документах стран-исключений нет. Wire на счёт ИП в КГ и Payoneer (уже используется владельцем для
  CJ) технически проходят → рельс **вероятно ДА**, но подтверждать только ответом pubsales (способ выплаты, минимум, нужна ли W-8BEN,
  примут ли ИП из КГ). Честная оценка шансов: при 760 визитах/28д и нулевом Google одобрение маловероятно; заявка нужна, чтобы
  получить письменные условия и встать в очередь — переподать при росте Bing-кликов / возврате Google.

## Что нужно от владельца для заявки
1. Отправить письмо с адреса владельца на **pubsales@media.net** (или форму /contact: Region = North America — по аудитории; What You Do =
   Publisher/Media Owner) с текстом ниже. Аккаунт, договор, W-8BEN и платёжные реквизиты (wire/Payoneer) — вводит владелец сам.
2. Данные, которые спросят: сайт https://calclumen.com, страна паблишера Kyrgyz Republic (ИП Igor Nikolaevich Zagorodnyi, адрес из
   CLAUDE.md), контактный email, оценка трафика и его источников, тематика, наличие ads.txt (у нас есть: /ads.txt с AdSense; строки
   Media.net добавлю после одобрения).

## Текст запроса (английский, без преувеличений)
```
Subject: Publisher inquiry — calclumen.com (finance & everyday calculators, US/UK/CA audience)

Hello Media.net team,

I'd like to apply as a publisher for calclumen.com, a free English-language site of 135 interactive calculators and
26 guides (mortgage, loans, tax withholding, savings, BMI, unit conversions) built for a US/UK/CA/AU audience.

Site facts: launched August 2026; all traffic is organic search (no paid or incentivized traffic); the site currently
receives most of its search impressions from Bing (~10,000 impressions per 28 days) and is in an early-growth phase
(~750 visits per 28 days). Every calculator page is a working tool with a methodology and sources section, an editorial
policy, an advertising disclosure and a disclaimer; ads.txt is in place. The site is built with Next.js on Cloudflare and
passes Core Web Vitals.

Publisher: Igor Nikolaevich Zagorodnyi, individual entrepreneur, Kyrgyz Republic. Before I complete the application I'd
appreciate confirmation of: (1) available payout methods for a publisher in Kyrgyzstan (wire / Payoneer) and the minimum
payout; (2) payment terms (NET-30?); (3) tax documentation required (W-8BEN?); (4) whether a site at this traffic level can be
reviewed now or should re-apply at a threshold you specify.

Thank you,
Igor Zagorodnyi — info@calclumen.com — https://calclumen.com
```

## Совместимость с AdSense и порядок
- Обе сети разрешают работать вместе (у AdSense — если блоки других сетей не маскируются под AdSense и не нарушают его политики;
  у Media.net — запрет на стекинг/маскировку). Но **порядок зафиксирован: код Media.net на сайт НЕ ставим до решения Google по
  переподаче (≥25.11)**. Если AdSense снова откажет → ставим Media.net (при одобрении) первым; если одобрит → Media.net только как
  вторую сеть через 30 дней стабильной работы AdSense, по одному блоку, не в тех же слотах.
- Код Media.net = такой же env-gated компонент, как AdSense/Ezoic (src/components/adsense.tsx, ezoic.tsx); ads.txt — добавить
  строки Media.net в src/app/ads.txt/route.ts после одобрения.
