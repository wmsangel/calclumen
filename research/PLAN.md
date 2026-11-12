# CalcLumen — план

> Метки `<!-- crm:… -->` в конце строк связывают пункты с задачами izn.crm (сверка раз в 15 минут, коммиты «план: отмечено из CRM»). Не удалять; переписываешь пункт — метка остаётся в конце первой строки; переносишь в «Сделано» или в идеи — вместе с ней. Новому пункту метку не ставь — её поставит сверка.

Единый источник задач. Актуально: **2026-10-25** · калькуляторов ~132 · sitemap 166 ·
гайдов ~28. Порядок в очереди = приоритет (не дата). Теги темы: `индексация` · `трафик` ·
`контент` · `скорость` · `деньги` · `баг` · `инфра`. Теги исполнителя: `→cursor`/`→сам`/`→гибрид` (легенда ниже).

**Спринт 20.10–02.11** (разметка сроков 19.10, обновлено по ответам владельца): у каждого пункта срок
меткой `<!-- due:YYYY-MM-DD -->` в конце первой строки. В окно 20.10–02.11 — 5 пунктов (#1,3,4,6,9),
остальные 5 — на 03.11–16.11 (#2,5,7,8,10: ждут восстановления Google или вторичны). IDEAS.md пуст.
Решения владельца 19.10: AdSense — ждём трафик (не подаём); AUTO/health — завести MaxBounty/FlexOffers;
OneLink — настраиваем (шаги в #9); finance — построить 3 вечнозелёных (#6).

## Очередь

- [ ] **Отдать `/favicon.ico`** — сейчас 404 (93 запроса/нед по Cloudflare), в разметке объявлен только `/icon.svg`; положить `public/favicon.ico` (32×32) или 301 `/favicon.ico` → `/icon.svg` `баг` `→cursor` (SEO, 2026-11-05) <!-- crm:0mw2xnwgvd7d52fabb0e7f322 -->

**Режим исполнения** (кто делает дешевле по токенам владельца):
`→cursor` — механика / большой объём однотипного письма по стабильному паттерну;
ты пишешь промт, Cursor делает, ты — спот-чек (выборка + сборка/линт).
`→сам` — трудное не напечатать, а *решить*: судейство (SEO по дельте, что откатывать),
контент (текст = продукт), завязка на нестандартный стек/конвенции; выноса нет смысла.
`→гибрид` — подход и первый образец за тобой, тираж по образцу — Cursor.
Глубина проверки: `→cursor` — спот-чек; `→сам` и рискованное — полное ревью.

1. **Мониторить возврат индексации и показов** — money-страницы висят «unknown»/«crawled, <!-- crm:0mvarrq879483bda28298ad8b --> <!-- due:2026-11-16 -->
   not indexed», показы ~0, кликов из поиска 0 (понижение). Все внутренние рычаги под обнаружение
   уже в проде (контекстные ссылки + embed-движок + Spotlight + «Try also»). `трафик`
   📊 **Срез 03.11 (seo-stats):** показы/клики 7д = **0 / 0**, 28д = **42 показа / 1 клик**, пред-28д = **78 / 0**
   → показы ПАДАЮТ (после GSC-removals тонкие unit-страницы ушли из поиска — почти весь прежний показ был с них).
   Индекс: посл. GSC Pages (27.10) ~1360, сейчас сжимается removals'ами; url_inspection-сэмпл (ноя): 127 indexed /
   270 crawled-not-indexed / 696 unknown → money-страницы в индекс НЕ заходят. **ВЫВОД: НЕ возвращаемся** —
   поисковый трафик ~0, money-страницы не индексируются; идёт запланированная чистка тонкого + ждём бэклинки/время.
   Baseline для след. среза (16.11): 28д = 42 показа / 1 клик, индекс ~1360↓. `трафик`
   ⚠️ **К 16.11 нужен РАЗБОР ПРИЧИНЫ, а не срез (диспетчер 05.11):** почему money-страницы не заходят в индекс —
   что именно в 270 «просканировано, не проиндексировано» и 696 «неизвестны Google» (какие URL/кластеры, в sitemap
   ли они, дата последнего обхода, canonical Google vs наш, есть ли на них внутренние ссылки), и вывод, что чинить.
   · **→сам** (чтение данных GSC/CF + судейство; не код)
2. **Сверять ЖИВЫЕ офферы еженедельно + заводить новые одобренные** — ⚠️ аппрувы Admitad <!-- due:2026-11-19 --> <!-- crm:0mvarrq8a86f59ada20afff1a -->
   ОТКАТЫВАЮТСЯ (12.10 так умерли Square + Doctronic). Раз в неделю: `GET /advcampaigns/
   website/2988056/` → у каждого нашего оффера `connection_status=active`, иначе убрать из кода.
   ✅ Сверка 12.11 (чт по ритму): Admitad API 11/11 active (43 кампании сайта), 20/20 диплинков 302 на верные площадки.
   Другие active — только single-geo RU/BR/CZ/MX/RO + Hide Expert VPN WW (4-й VPN — не ставлю, дубль NordVPN/PureVPN/AdGuard);
   «PureVPN Many Geos» из аудита в списке сайта нет (у нас PureVPN 34688 уже стоит). Заводить/убирать нечего. След. сверка 19.11.
   **03.11:** сверку НЕ дублирую — идёт сетевой Admitad-аудит диспетчера (итоги от него). По быстрой проверке
   02.11 (44 кампании) новых одобренных гео-релевантных офферов под calclumen нет → заводить нечего. Срок → 10.11.
   **Итоги аудита диспетчера (05.11):** мёртвых ссылок в коде нет. Одобрены, но не размещены: Bang Bang Education,
   Eset BR, Fiesta Credito, Gran Cursos BR, Hide Expert VPN WW, HoraCredit RO, Pujckaplus CZ, PureVPN Many Geos,
   SOS credit CZ, UOL Host BR, X-Fit OLD. Решение владельца: ставить только там, где оффер подходит странице.
   На сверке 10.11 решить: PureVPN Many Geos (сверить с уже стоящим PureVPN — не дубль ли) / Hide Expert VPN;
   гео-кредиты (RO/CZ/MX) на finance-страницах — только если по GA4/CF есть трафик из этих стран.
   ✅ Сверка 2026-10-27: все 20 офферов живые. Admitad API — 11/11 active+connected (откатов нет).
   Indoleads — 9/9 диплинков 302 на верные площадки. Новых гео-релевантных активных нет (остальное
   single-geo RU/BR/CZ/MX или дубль-VPN). CJ проверен в кабинете (владелец залогинился): approved=0 →
   заводить нечего; 2 pending (AAA 5128949, Aflac 5424279), 2 declined (Aeroflow 4959947, Ally 5300495
   — у Ally EPC $1069, кандидат на переподачу). FlexOffers (~30.10) + MaxBounty (ждёт звонок) — owner-side.
   Следующая сверка — 03.11. `деньги`
   · **→сам** (внешний API + аппрувы откатываются → решать что убрать/завести; полное ревью)
3. **Завести US auto/finance партнёрские сети → закрыть пустые кластеры AUTO + health** — топ-CPM US auto-страховка/finance lead-gen в Admitad/Indoleads отсутствует. <!-- due:2026-11-18 --> <!-- crm:0mvarrq8d0cfe6e8839d7e0a2 -->
   **02.11 проверка общих аккаунтов (API):** Admitad site 2988056 — 44 кампании, US auto/insurance/health
   НЕТ (только single-geo CZ/MX/RO кредиты + declined Costway); Indoleads/Amazon/Travelpayouts — тоже нет
   US auto/health. Среди 20 одобренных офферов НИ ОДИН не подходит AUTO/health по смыслу → кластеры
   пока пустые (код не трогал). **Владелец 02.11 выбрал завести ДВЕ новые сети (регистрация owner-side):**
   • **ShareASale** (Recommended) — выплаты Payoneer (официально, 200+ стран вкл. КГ), берёт малые сайты;
     US finance/insurance/health/home, ставки per-program. Рег: account.shareasale.com → Affiliate sign up
     (сайт calclumen.com, payout=Payoneer). ⚠️ ShareASale под Awin — часть новых рег идёт через awin.com ($5 возвр. депозит).
   • **Impact.com** — 190+ стран, наши топ-рекламодатели уже идут через него (sjv.io/pxf.io/i384100);
     per-brand аппрув. Рег: app.impact.com → Sign up as partner/publisher. ⚠️ рельс для КГ (Payoneer?) подтвердить при регистрации.
   МОЙ этап после аппрувов: взять tracking-ссылки одобренных brand-программ (auto-insurance / telehealth-health) и завести в offers.ts (AUTO + health).
   ✅ ВСЕ 3 СЕТИ ПОДАНЫ 23.10 (владелец, выплаты через Payoneer US-реквизиты / Citibank):
   • **CJ Affiliate** — ✅ АКТИВИРОВАН (W-8BEN + CJ Payments USD). Осталось внутри CJ подать в finance/insurance/auto программы (per-advertiser аппрув).
   • **FlexOffers** — ✅ подан + сайт верифицирован (мета-тег fo-verify на calclumen), на ревью ~5 раб. дней.
   • **MaxBounty** — ✅ подан + верифицирован (ID 808247), ЖДЁТ обязательного телефон-интервью с менеджером Taylor (@maxbountytaylor) — без звонка не одобрят (owner-side).
   CJ-программы (подано 24.10, статус на 27.10): **AAA Auto Club** (5128949, insurance/AUTO) — pending;
   **Aflac** (5424279, insurance) — pending; **Aeroflow Healthcare** (4959947, health) — ❌ declined;
   **Ally** (5300495, finance/EPC~$1069) — ❌ declined (кандидат на переподачу позже). approved=0.
   Ещё в шорт-листе (не подано): RenoFi (8033802, mortgage/HELOC ⭐),
   NAGA (8004498, investing), Ingenio (7991288, health). CJ-поиск: Partners→Find Advertisers,
   фильтр Category(Automotive/Financial/Health/Insurance)+Serviceable Area(US/UK/CA) → 303 программы.
   МОЙ этап (после аппрувов): взять tracking-ссылки одобренных, завести в offers.ts (кластеры AUTO + health). `деньги`
   · **→сам** (подбор/вайринг офферов после аппрува сетей)
4. **AdSense — ОТКАЗ «Бесполезный контент» (10.11) → разбор и исправления, переподача не раньше 25.11** <!-- crm:0mvarrq8hbf2369c33b1a6ddf --> <!-- due:2026-11-25 -->
   История: подано 27.10 (риск thin был известен), 10.11 — «Требуется действие: Бесполезный контент» (та же
   причина, что у izngames 17.10 и 24zdorovie 28.10; 24zdorovie дорастил 13 тонких tool-страниц <450 слов и
   переподан 11.11). Код AdSense и заявку не трогать до переподачи; блоки не ставить.
   **Разбор причин (факты 11.11):** (а) в индексе Google calclumen видит в основном тонкие unit/homework-страницы
   (они noindex с 28.09, Removals поданы 27.10, но на 03.11 ещё ~1300 в индексе), money-страницы — «просканировано,
   не проиндексировано»/«неизвестны»; (б) калькуляторные страницы ~450–700 слов, самые тонкие — интро 480–550
   знаков (bac, pregnancy-weight-gain, oven-temperature, mileage, sales-tax, vat, square-footage…); (в) нет блока
   «как считаем / формула / источники» и автора (about обещает «we show the method on each page», на страницах
   формула только прозой); (г) дата «Updated» = дата сборки (new Date() в calc-shell) — ложная свежесть;
   (д) 7 из 8 хабов категорий — голые сетки карточек (пиллар есть только у /finance); (е) пары-дубли по теме:
   hourly-to-salary / salary-to-hourly, lcm-gcd / gcf-lcm-кластер, prime-factorization / factors-кластер,
   permutations-combinations / combinations-кластер (кластеры уже noindex — ок, пары калькуляторов различить текстом).
   Политики (privacy/cookies/terms/about/contact) есть и после аудита 31.10 = реальность.
   **Чек-лист исправлений (по ритму чт/сб):**
   - чт 13.11 — выгрузить из GSC список проиндексированных URL и статус Removals; посчитать видимые слова всех
     177 URL sitemap, список <450 слов; проверить текст отказа в AdSense (Chrome, только чтение); составить батчи.
   - сб 15.11 — доверие: блок «How it's calculated» (формула + источники, поле `methodology`/`sources` в CalcContent,
     рендер в CalcShell + citation в JSON-LD) для всех калькуляторов, начиная с finance; честная дата обновления
     (per-calc, не build-date); «Who makes CalcLumen» на /about (имя, роль, Бишкек — без реквизитов) + Person в schema;
     рабочий канал на /contact. + по чек-листу 24zdorovie: отдельные страницы **/editorial-policy** (кто пишет,
     как проверяются формулы и источники, как исправляем ошибки), **/advertising** (AdSense + партнёрские ссылки,
     как помечаем, что не влияет на расчёты) и **/disclaimer** (финансовый/налоговый/медицинский — не совет);
     ссылки на них в футере. Объём страниц считать по РЕНДЕРУ (видимый текст main), не по исходнику.
   - сб 21.11 (было чт 20.11; четверги теперь = замеры + страница контент-плана) — тонкое: все страницы <450 слов дорастить (третий абзац интро + worked example + «когда пользоваться»),
     спросу нет → noindex; хабы Conversions/Health/Math/Date & Time/Business/Auto/Home & DIY — intro+FAQ по образцу /finance.
   - сб 21.11/вт 01.12 — остаток батчей, дубли различены текстом/канонизированы, soft-404/404 проверены; пересабмит sitemap +
     IndexNow по изменённым URL; срез индексации «после».
   - чт 27.11 — проверка переобхода (дата последнего обхода ключевых страниц в GSC позже правок, thin ушли из
     индекса). **ГЛАВНЫЙ ГЕЙТ (диспетчер 11.11): пока ~1300 тонких URL в индексе — не переподавать, ревьюер
     видит их, а не калькуляторы.** Критерий: число проиндексированных в GSC ≈ sitemap (177) ± гайды, Removals
     выполнены; если к 27.11 не сошлось — ждать следующего четверга, не подавать. Переподача — только после этого
     и по «да» владельца (кнопка), не раньше 25.11. Ориентир 24zdorovie при переподаче: 271 стр. с показами
     против 560 в sitemap, тонких 0, 8 страниц политик, хабы со вступлением.
   Новые страницы по вторникам идут сразу по новому стандарту (≥450 слов, формула+источники). `деньги`
   · **→сам** (судейство по данным + внешний аккаунт владельца)

5. **План контента и фич до 06.12** (владелец 08.11 через диспетчера: «мало нового контента и функционала»). <!-- due:2026-12-06 --> <!-- crm:0mw8uw0xh94283c5af22baf07 -->
   Правила: страницы только под спрос (GSC свой/соседей/конкуренты), у каждой — главный запрос, показы «до» и
   донор внутри сети (иначе останется вне индекса, как сейчас: 1 клик/28д). Факт по данным (09.11): в GSC calclumen
   показы только у тонких unit-страниц; у соседей финансовый спрос без калькулятора — iznkit (freelance tax estimator 2,
   how to calculate freelance taxes 2, freelance/contractor rate 3), thecryptotools (crypto-DCA/interest/profit —
   крипто, calclumen не строит по правилу «НЕ строить»), foldoutkit (amortization schedule in excel with extra payments 1).
   Остальное — известные head-термы конкурентов, которых у нас нет («до» = 0 у нас, спрос внешний).
   **КОНТЕНТ (2/нед, 8 страниц):**
   | # | Страница | Главный запрос | До | Донор в сети | Срок |
   |---|---|---|---|---|---|
   | 1 | mortgage-points-calculator | mortgage points calculator / break even | 0 | izntools /t/mortgage-calculator (строка) + внутр. Mortgage & home | ✅ 09.11 (663ad39, прод 200) |
   | 2 | quarterly-estimated-tax-calculator (1040-ES, safe harbor 100/110%) | estimated tax calculator / freelancer tax estimator | iznkit 2+2+1 | iznkit /en/guides/freelance-tax-explained | 15.11 |
   | 3 | extra-payment-calculator (досрочные платежи по кредиту/ипотеке) | extra mortgage payment calculator | foldoutkit 1 | izntools /t/loan-calculator + iznkit what-is-compound-interest | 19.11 |
   | 4 | travel-budget-calculator (стоимость поездки на человека/день) | travel budget calculator / trip cost | 0 | rightweekend /calendar/2027/ + costtrek digital-nomad-visa-guide | 22.11 |
   | 5 | home-sale-proceeds-calculator (чистые деньги с продажи) | home sale proceeds calculator | 0 | iznkit /en/guides/how-to-calculate-rental-yield | 26.11 |
   | 6 | investment-fee-calculator (expense ratio drag) | investment fee calculator / expense ratio | 0 | iznkit what-is-compound-interest + thecryptotools /exchanges/ | 29.11 |
   | 7 | lump-sum-vs-annuity-calculator | lump sum vs annuity calculator | 0 | внутр. Retirement & investing; iznkit compound guide (PV) | 03.12 |
   | 8 | credit-utilization-calculator | credit utilization calculator | 0 | ocrsnip credit-card statement→excel + внутр. credit-card-payoff | 06.12 |
   Отклонено как дубль сетки: freelance-rate (есть izntools /t/hourly-rate-calculator), crypto-DCA (thecryptotools),
   VAT-margin (iznkit margin-calculator), cost-of-living (costtrek).
   **ФИЧИ (правило «результат под данные пользователя», ≥2 за месяц):**
   | # | Фича | Кому | Запрос/сигнал | Оценка | Срок |
   |---|---|---|---|---|---|
   | F1 | Ссылка на расчёт: состояние → URL-параметры, кнопка «Copy link», префилл при открытии (все калькуляторы через CalcShell) | тем, кто шлёт сценарий партнёру/советнику; каждый результат становится ссылкой (помогает и бэклинкам) | прямого запроса нет; сигнал — шаринг = основной источник естественных ссылок | 2 дня | 20.11 |
   | F2 | Экспорт таблиц по годам в CSV + печать/PDF (mortgage/loan/rent-vs-buy/compound/retirement) | тем, кто строит таблицу в Excel | foldoutkit «amortization schedule in excel… extra payments» (1), head-терм «amortization schedule excel» | 2 дня | 04.12 |
   | F3 | Сравнение сценариев A/B (mortgage, loan) — если останется время | сравнивающим офферы | «compare mortgage offers» | 3 дня | бэклог дек. |
   Задачи заведены в izn.crm 09.11 (по одной, со сроками). `контент` `фичи` · **→сам** (контент = продукт; фичи — нестандартный стек)
   **НАЛОГОВЫЙ ХАБ SELF-EMPLOYED US/UK (владелец 12.11 через диспетчера; отчёт
   side-session-notes/…/tax-hub-selfemployed-research-2026-11-12.md).** Как отдельный проект отклонён (14–16 мес до денег),
   как раздел 3–5 страниц на calclumen — проходит. Спрос (Google Ads API, 12 мес): US «estimated tax payments» 27,1K,
   «quarterly tax dates» 8,1K, «quarterly tax calculator» 3,6K (CPC $7,4), «1099 tax calculator» 22,2K, «1099 vs w2» 1,6K,
   «irs penalty calculator» 2,4K; UK «self assessment tax calculator» 3,6K, «payments on account» 1,9K. Сезон янв–апр 2027 →
   первые две страницы на проде к середине декабря. Правила: результат под ввод пользователя; формула + источники + год ставок
   на странице; дисклеймер «не налоговая консультация»; автор/дата (YMYL); рекламный код не трогать до решения AdSense;
   партнёрки ТОЛЬКО CJ/Awin (Payoneer) — Keeper/1-800Accountant (Awin 81243)/Gusto/Tide заводить лишь после «да» владельца
   кнопкой у диспетчера. Страницы по моим дням (вт — контент, сб — фичи), суббота 14.11 и четверги аудита не заняты:
   | # | Страница | Главный запрос (спрос/мес) | Источники ставок | Срок |
   |---|---|---|---|---|
   | T1 | quarterly-estimated-tax-calculator — 1040-ES 2026/27, safe harbor 90%/100%/110% (AGI>$150K), минус удержания W-2, штат flat % | quarterly/estimated tax calculator 3,6K+3,6K+1,6K | IRS Pub 505, Form 1040-ES 2026, Pub 15 | вт 17.11 (= бывший «Контент 2/8») |
   | T3 | 1099-vs-w2-calculator — take-home: SE tax 15,3% (½ вычет), QBI 20%, станд. вычет 2026, брекеты, штат % | 1099 calculator 2,4K; 1099 vs w2 1,6K | IRS Pub 15/505, Rev. Proc. 2026 брекеты | вт 24.11 |
   | T2 | tax-deadline-calendar — .ics под страну/штат/дату регистрации: IRS 15.04/15.06/15.09/15.01 + годовой + штатные; напоминания за 14/3 дня; UK 31.01/31.07 (+MTD-кварталы позже) | quarterly tax dates 8,1K; estimated tax dates 6,6K | IRS Pub 509, tax.state.*.gov | сб 28.11 (день фич — это файл-артефакт) |
   | T4 | uk-self-assessment-calculator — income tax + Class 4 (6%/2%, порог £12 570), payments on account (2×50% прошлого счёта), когда SA303 | self assessment tax calculator 3,6K; payments on account 1,9K | gov.uk rates 2026/27, HMRC SA guidance | вт 08.12 |
   | T5 | irs-penalty-calculator — late filing 5%/мес (до 25%), late payment 0,5%/мес, underpayment по кварталам + проценты IRS за квартал (ставка по дате) | irs penalty calculator 2,4K; interest & penalties 3,6K | IRS Topic 653, Form 2210, IRS interest rates (кварт.) | вт 15.12 |
   **Решение владельца 12.11: 2 страницы/нед — вторник хаб, четверг страница контент-плана; четверговый аудит ужат до замеров
   (индексация 7/28д, 302 диплинков, статус AdSense), полный разбор раз в 2 недели.** Итоговые даты (CRM обновлён):
   вт 17.11 T1 quarterly · чт 19.11 3/8 extra-payment (+AdSense-тонкое переносится на сб 21.11) · сб 21.11 AdSense: тонкие
   страницы + хабы · вт 24.11 T3 1099-vs-w2 · чт 26.11 4/8 travel-budget · сб 28.11 T2 .ics-календарь · вт 01.12 резерв
   (гейт AdSense / хаб Conversions) · чт 03.12 5/8 home-sale · сб 05.12 F2 экспорт CSV/PDF · вт 08.12 T4 UK self-assessment ·
   чт 10.12 6/8 investment-fee (+ полный аудит) · сб 12.12 F1 ссылка на расчёт · вт 15.12 T5 irs-penalty · чт 17.12 7/8
   lump-sum-vs-annuity · чт 24.12 8/8 credit-utilization.
   **ПЕНСИОННЫЕ КАЛЬКУЛЯТОРЫ (владелец 12.11; заметка retirement-calculators-check-2026-11-12.md) — январские вторники после
   налогового хаба.** Ключевое наблюдение заметки: AI Overview стоит на всех 12 проверенных запросах и зовёт «посчитать в чате»
   → выживают страницы с многолетней таблицей + экспортом, графиком, сценариями рядом, .ics-датами, ссылкой на расчёт — это
   обязательная часть каждой страницы (и налоговых тоже; поэтому F1/F2 — фундамент). Партнёрки Empower ($76–100/лид, CJ/FlexOffers),
   Betterment (CJ) — только после кнопки владельца. Не брать: общий retirement calculator (301K, крепость), 401k, Roth vs Traditional,
   отдельный countdown (как режим). Задачи в CRM 12.11:
   | # | Страница | Спрос/мес | Срок |
   |---|---|---|---|
   | R1 | rmd-calculator (апгрейд существующей: таблица RMD по возрастам, CSV, .ics 31.12/01.04) | 90,5K; топ-10 без IRS/Schwab/Fidelity | вт 05.01 |
   | R2 | coast-fire-calculator (новая) | 18,1K, competition 0,02, CPC $3,98 | вт 12.01 |
   | R3 | social-security-break-even-calculator 62/67/70 (новая) | 6,6K, CPC $5,77; сосед ss estimator 74K | вт 19.01 |
   | R4 | retirement-withdrawal-calculator «how long will my savings last» 4/3,5/3% (новая) | 14,8K | вт 26.01 |
   | R5 | fire-calculator (апгрейд: таблица по годам, сценарии, экспорт) | 14,8K | вт 02.02 |
   | R6 | uk-state-pension-age-calculator (дата + .ics; countdown как режим) | UK, косвенно | вт 09.02 |



**↓ Отложено до восстановления Google** (строить контент/менять инфру сейчас = впустую или рискованно):

6. **⚠️ Гео take-home pay по штатам US + UK** — крупный programmatic, топ-CPM. <!-- crm:0mvarrq8o1279508307ae45e6 --> <!-- due:2026-11-16 -->
   ⚠️ Сверка 16.10: базовые `income-tax-calculator` / `paycheck-calculator` / `salary-to-hourly`
   УЖЕ есть — открыт только **погеоштатный programmatic-слой** (сотни страниц типа
   /take-home-pay/california). Нужен источник налоговых данных по штатам + UK. ПОСЛЕ восстановления. `контент`
   · **→гибрид** (каркас: источник данных + шаблон + первый штат = сам; тираж на 50 штатов + UK = cursor)
7. **Amazon OneLink мультигео UK/CA/AU** (владелец 19.10 — настраиваем; сейчас только .com/US): <!-- crm:0mvarrq8ua90ba19fda461de0 --> <!-- due:2026-11-30 -->
   ⏸ **ПЕРЕНЕСЕНО на ~30.11 (владелец 31.10):** разбор партнёрок показал, что живых кликов на Amazon
   у calclumen почти нет → гео-ссылки сейчас ничего не дадут. Вернёмся, когда появятся реальные
   Amazon-клики / гео-трафик.
   Шаги ВЛАДЕЛЬЦУ (когда вернёмся):
   1) зарегистрироваться в Amazon Associates каждой гео: UK — affiliate-program.amazon.co.uk,
      Canada — associates.amazon.ca, Australia — affiliate-program.amazon.com.au; получить
      tracking-тег в каждой (вид `calclumen-21` / `calclumen0c-20` и т.п.);
   2) в US Associates Central (associates.amazon.com) → Tools → OneLink: включить OneLink и
      связать UK/CA/AU-аккаунты;
   3) прислать мне 3 гео-тега + подтвердить домены (.co.uk / .ca / .com.au).
   МОЙ этап после этого: расширить `/go/<slug>` на гео-редирект по стране визитёра (на CF —
   заголовок `cf-ipcountry`) → нужный Amazon-домен + тег. PA-API (реальные фото/ASIN) — отдельно, после 3 продаж. `деньги`
   · **→сам** (гео-редирект в /go/ после получения тегов + интеграция)

## Сделано

- **Собрать входящие бэклинки с сети на money-страницы** (07.11) <!-- crm:0mvarrq7y5739733a45a30cdb -->
- **✅ Вторая тройка вечнозелёных finance-калькуляторов — ЗАКРЫТА 07.11** <!-- crm:0mvarrq8k80b1b4861a82b227 -->
  rent-vs-buy (03.11, e3fbdd2) + bonus-tax + balance-transfer (07.11, a461b18). Все на проде: 200, canonical, в sitemap
  (176 URL), на хабе /finance. Формулы: rent-vs-buy — модель opportunity-cost (NYT); bonus-tax — IRS Pub 15 (2026);
  balance-transfer — арифметика. 16 юнит-тестов (всего 155). Первая тройка была 23.10 (property-tax/traditional-ira/cagr).

- **✅ Privacy-аудит сети — исправлено 31.10** (коммит 9e7d626, живо на проде). privacy + cookies теперь
  называют поимённо **GA4 (G-JY9FBM2921, cookies _ga/_ga_<id>)**, **Cloudflare Web Analytics** (cookieless)
  и **AdSense**, описан Consent Mode по регионам (EEA/UK/CH denied до согласия); убрана обтекаемая
  формулировка «privacy-conscious analytics». GA теперь стартует ТОЛЬКО на calclumen.com/www
  (проверка location.hostname в src/components/google-analytics.tsx, gtag.js инжектится внутри гейта) —
  не на превью/алиасах. Зеркало `calclumen.ocrsnip.workers.dev` закрыто (`workers_dev:false` в wrangler.jsonc
  → 404). Баннер согласия не трогал (работает верно). Одна локаль (en).

- **✅ Пилларный хаб /finance — ПИЛОТ 27.10** (коммит fc2fe47, живой на проде). Решение владельца:
  делать не «лендинги под рекламу» (это тот же thin/MFA-риск), а качественные тематические хабы,
  полезные сами по себе. /finance из тонкой сетки-карточек → настоящий пиллар: вступление + гид
  «какой калькулятор для какой задачи» (27 контекстных do-follow ссылок на money-калькуляторы) +
  разбор понятий (амортизация/капитализация/порядок погашения/правило 28-36) + FAQ с FAQPage-разметкой.
  CategoryPage получил опциональный слот `intro` (остальные 7 категорий не тронуты); контент в
  src/components/hubs/finance-hub.tsx. Даёт топикальный авторитет + внутреннюю перелинковку (восстановление
  + де-риск AdSense). **СЛЕДУЮЩЕЕ:** через ~2 недели посмотреть индексацию/показы /finance в GSC; если
  зайдёт — тем же качеством сделать Conversions + Health (НЕ массой по шаблону). `контент` · **→сам** (контент = продукт)

- **✅ GSC Removals тонких префиксов — 27.10** (ускорение выхода из-под демотации + де-риск AdSense).
  Код уже noindex+вне sitemap с 28.09 (проверено на проде: factors/is-prime/simplify/percent/gcf-lcm отдают
  `noindex, follow`), но ~1300 стр. ещё висели в индексе (GSC: проиндексировано ~1360 против 166 в sitemap;
  Google медленно перекрауливал). В GSC (Удаления → Временное удаление) поданы **12 префиксов «все URL с префиксом»**:
  /en/factors /is-prime /simplify /percent /gcf-lcm /multiples /units /roman-numerals /decimal-to-fraction
  /fraction-to-decimal /combinations /data — все «Запрос обрабатывается». Вылетят из поиска за часы (на ~6 мес),
  noindex закрепит навсегда. Не трогалось: внутренние ссылки (нужны, чтобы Googlebot увидел noindex), AdSense-скрипт.

- **✅ ПОЛНЫЙ ПЕРЕЕЗД Vercel → Cloudflare Workers — ЗАВЕРШЁН 25.10** <!-- crm:0mvarrq8x0d9dee726c29c4e2 -->
  `calclumen.com` отдаётся с CF Worker `calclumen` (прод `calclumen.ocrsnip.workers.dev`),
  привязан Custom Domain'ом. DNS-cutover в CF-дашборде (bind отказывался, пока висели старые
  Vercel-CNAME — code 100117): удалил apex+www Vercel-CNAME (MX/SPF/DKIM сохранены), привязал
  apex к Worker, восстановил www проксированным `CNAME www→calclumen.com` + Redirect Rule
  www→apex 301 (preserve query). Проверено на проде: server=cloudflare+cf-ray (нет x-vercel),
  locale 307→/en→200, /go/<slug> 302→amazon tag, /api/og 200 png, robots/sitemap, fo-verify,
  nofollow×20, loan-calculator 200, TLS ок, www→apex 301 с путём. `main` авто-деплоит Worker.
  ✅ Vercel отключён 25.10 (izn1/calc-tools → Settings → Git → Disconnect) — push в main больше
  не собирается на Vercel, только GitHub Actions → CF Worker. Проект Vercel сохранён (откат
  возможен). Детали — `research/CLOUDFLARE-MIGRATION.md`. `инфра`

_(последние ~2 недели)_

- **Cooking/baking конверсии — закрыто** (26.10, коммит 04333f2) <!-- crm:0mvarrq8r1e2f7b044aa04d1e -->
  cups↔grams и temperature-converter уже были; остаток — отдельная **oven-temperature-converter**
  (°C/°F/UK gas marks + fan −20 °C, таблица gas marks) — построена Cursor'ом по моему промту
  (docs/cursor-prompts/08-oven-temperature-converter.md), приёмка пройдена (формулы, lint, 139 тестов,
  build), влита в main, задеплоена на CF. ~133 калькулятора.

- **+6 finance-калькуляторов по спросу** (23.10, коммиты 244ccf0 + 8301cd8) — все с юнит-тестами
  (22 новых), verified в браузере, задеплоены, в IndexNow. Тройка плана #6: property-tax (FINANCIAL),
  traditional-ira, cagr (INVESTING). Плюс внеплановая тройка по пробелам: **apy**, **dividend** (+DRIP),
  **fire** (FIRE number + годы до независимости). math вынесена в src/lib/math; traditional-ira/cagr/
  apy/dividend/fire → INVESTING_SLUGS (TradingView); Amazon-карточки книг на investing-страницах.

- **События GA4 → сетевой стандарт** (15.10) — все кастомные события переименованы под общее
  соглашение сети, у каждого обязательный параметр `item` (ключ разбивки) + доп.:
  `tool_used {item=slug, action}`, `affiliate_click {item=offer, placement}`,
  `copy_click {item=slug, placement}`, `cta_click {item}`, `feedback_open/submit {item}`;
  Amazon-клики теперь тоже трекаются (`affiliate_click {platform=amazon}`, новый AmazonLink).
  Параметры `item/placement/platform/action` зарегистрированы в GA4 как event-scoped custom
  dimensions (свойство calclumen p549878079). Данные копятся с момента регистрации.
- **Чистка «Идеи» → план** (12.10) — все идеи рассмотрены и перенесены в очередь (п. 7–9);
  IDEAS.md — пустой инбокс.
- **Идеи из бэклога** (12.10) — Spotlight в тело calc-страниц («Try also», краулимая ссылка с
  каждого калькулятора); embeddable-набор 8→16 флагманов; 2 health-калькулятора: BAC (Widmark) +
  pregnancy-weight-gain (IOM). TDEE пропущен — дубль calorie-calculator.
- **Чистка мёртвых офферов** (12.10) — убраны Square (аппрув откатили) + Doctronic (suspended).
- **Унификация под сеть** (09–12.10) — доки к стандарту (PLAN/IDEAS/MONETIZATION), витрина в
  графитовом стиле (акцент #2f6f87), корневой HUB.md для пульта, SELF-DESCRIPTION.md.
- **Spotlight** (08.10) — недельный внутр. слот на главной (серверная ротация по ISO-неделе).
- **Контекстные do-follow ссылки** (08.10) — in-body на 4 money-страницах → сеть.
- **GA4-аналитика** (08.10) — `track()` + offer_click/calculator_use/embed_copy/feedback (Run 10/10).
- **Backlink-движок** (06.10) — встраиваемый виджет: iframe + do-follow «Powered by CalcLumen».
- **VEVOR оффер** (05.10) — HOME-кластер + ротация на главной.
- **Калькуляторы** (29.09–05.10): solar-panel, self-employment-tax, annuity, drywall, rmd, stair,
  rental-property, insulation, depreciation (очередь 10 запусков закрыта).
- **Schema-гигиена** (05.10) — точный applicationCategory + сшивка сущностей через @id.

## Заметки

**Срез индексации 12.11 (чт по ритму; baseline для 19.11/16.11-разбора):**
- GSC Pages: **проиндексировано 81** (27.10 было ~1360 → Removals/noindex ВЫЧИСТИЛИ тонкое; гейт AdSense по индексу
  практически закрыт), не проиндексировано 3 350: crawled-not-indexed 2 481, discovered-not-indexed 814, noindex 57, redirect 1.
- Показы/клики: 7д **0/0**, 28д **18 показов / 0 кликов** (прошлый срез 03.11: 42/1), пред-28д 61/1. Страниц с показами за 14д — ноль.
- Sitemap: Google читал 05.11, 174 URL, «проиндексировано через sitemap: 0». Все 172 lastmod были одинаковыми (= дата сборки)
  → сигнал мёртв; 12.11 lastmod оставлен только у главной и хабов (деплой в этот же ход).
- url_inspection (выборка калькуляторов, последний статус): «URL неизвестен Google» **40** (в т.ч. старые income-tax,
  paycheck, margin-markup, roth-ira), crawled-not-indexed **19** (10 из них обходились после 27.10), проиндексировано **14**.
- **Разбор причины (предварительно, доделать 16.11):** не техника (noindex/canonical/200 в норме, sitemap читается) —
  у домена после понижения обрушился crawl demand: Google читает sitemap, но не ставит URL в очередь (половина калькуляторов
  ни разу не обойдена), а обойдённые держит в «crawled, not indexed» = оценка качества/авторитета ниже порога.
  Рычаги в порядке силы: входящие ссылки (батч-3 роздан 07.11), запрос индексации вручную по money-страницам (квота ~10/день,
  начато 12.11), честный lastmod + внутренние ссылки с хабов (/finance есть, остальные хабы — 20.11), контент ≥450 слов +
  методика (15–22.11). Ожидание: сдвиг заметен не раньше 2–4 недель после ссылок.
- 12.11 действия: sitemap переотправлен в GSC (обработан 12.11, 177 URL, «Успешно»); запрос индексации вручную —
  mortgage-calculator ОТПРАВЛЕН (последний обход был 18.09, «ссылающаяся страница: не найдено»), loan-calculator —
  «Квота превышена»: дневную квоту URL Inspection уже расходует сетевой пайплайн подачи в GSC → ручные запросы
  не дублировать, а передать диспетчеру приоритетный список (mortgage, loan, compound-interest, apr, rent-vs-buy,
  home-affordability, salary-to-hourly, hourly-to-salary, inflation, finance-хаб) для очереди пайплайна.
  → 12.11 диспетчер завёл 9 задач «Подать в GSC» (+compound-interest уже стоял); квота ~11/день на аккаунт, разберёт за 1–2 дня.
- Техника 12.11: thin → `noindex,follow` ок; зеркало workers.dev 404; GA только на calclumen.com; privacy называет GA4;
  прод 200 (/, /en, /en/finance, mortgage, sitemap, ads.txt, robots), деплои 4/4 success; AdSense: «Требуется действие:
  Бесполезный контент» (10.11) — не трогаем до чек-листа.

**Контекст №1 — понижение Google.** Домен алгоритмически понижен (159k показов/день в конце
авг → ~0 весь сент–окт, кликов из поиска 0) из-за молодого домена + ~0 бэклинков + массы тонких
шаблонных страниц. НЕ техника (robots/sitemap/CWV 100% зелёные, Bing показывает). Сделано: чистка
тонкого (noindex units/roman/data/combinations + математика; sitemap 2929→166). Остаётся:
**бэклинки** (рычаг №1, owner-side, в работе) + содержательный контент + ждать (недели-месяцы).

**Внутренняя перелинковка под индексацию — ВСЁ в проде:** контекстные do-follow ссылки,
embed-движок (16 флагманов), Spotlight на главной, «Try also» на каждой calc-странице. Больше
кодом под обнаружение сделать нечего — дальше решают входящие ссылки + время.

**Офферы (детали — `research/MONETIZATION.md`):** Admitad website id 2988056; автоподача через
API мертва (410) — только веб-кабинет; ⚠️ аппрувы откатываются — сверять живые еженедельно.
Платёжные рельсы КГ: Payoneer/крипто (Admitad/Indoleads), AdSense платит в КГ.

**НЕ строить** (~0 CPM, тонкое/vanity): статистика (ANOVA/регрессия), физика/химия, 3D-гео/
тригонометрия, крипто/dev-тулзы, fun (love/dice).

**Инфра:** Cloudflare Workers (@opennextjs/cloudflare, переезд с Vercel 25.10; авто-деплой через
GitHub Actions deploy.yml на push в main); эконом-деплой (батч-пуши, локальный `npm run build`
перед пушем, один поток). Vercel отключён 25.10 (Git-интеграция снята; проект сохранён для отката).
