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
2. **Сверять ЖИВЫЕ офферы еженедельно + заводить новые одобренные** — ⚠️ аппрувы Admitad <!-- due:2026-11-18 --> <!-- crm:0mvarrq8a86f59ada20afff1a -->
   ОТКАТЫВАЮТСЯ (12.10 так умерли Square + Doctronic). Раз в неделю: `GET /advcampaigns/
   website/2988056/` → у каждого нашего оффера `connection_status=active`, иначе убрать из кода.
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
4. **AdSense — подать calclumen (pub-5535516142831006)** — владелец 27.10 (через диспетчер) РЕВЕРСНУЛ решение 19.10: подаём. <!-- crm:0mvarrq8hbf2369c33b1a6ddf --> <!-- due:2026-11-16 -->
   Проверено 27.10 (Chrome владельца): calclumen **ещё НЕ в консоли** AdSense (там izngames=❌Бесполезный
   контент 17.10, thecryptotools+24zdorovie=на проверке, prodom-expert=одобрен). Техника на проде готова:
   ads.txt (pub-5535516142831006 DIRECT), adsbygoogle client ok, privacy с Google-рекламой/cookies, about+contact 200,
   фраз «рекламы нет» нет. ⚠️ **РИСК reject за thin:** GSC — проиндексировано ~1 360 стр. против 166 в sitemap →
   в индексе доминируют тонкие homework-страницы (factors/gcf-lcm/is-prime/simplify/percent), это категория
   отказа izngames. ✅ **ПОДАНО 27.10** (владелец одобрил submit кнопкой, зная риск): calclumen.com добавлен
   в консоль, статус **«Выполняется проверка»**. ⚠️ Верификация права собственности методом «код AdSense»
   НЕ прошла (apex 307→/en — бот не видит сниппет на голом apex); прошла через **ads.txt** (сразу ок) —
   заметка для сети: сайты с redirect apex подтверждать через ads.txt/meta, не код. Блоки НЕ ставить до
   одобрения. Ждём вердикт (дни–2 недели); если reject за thin — дорабатывать homework-кластер. `деньги`
   · **→сам** (решение по данным + действие во внешнем аккаунте владельца)

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
