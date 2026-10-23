# CalcLumen — план

> Метки `<!-- crm:… -->` в конце строк связывают пункты с задачами izn.crm (сверка раз в 15 минут, коммиты «план: отмечено из CRM»). Не удалять; переписываешь пункт — метка остаётся в конце первой строки; переносишь в «Сделано» или в идеи — вместе с ней. Новому пункту метку не ставь — её поставит сверка.

Единый источник задач. Актуально: **2026-10-19** · калькуляторов ~132 · sitemap 166 ·
гайдов ~28. Порядок в очереди = приоритет (не дата). Теги темы: `индексация` · `трафик` ·
`контент` · `скорость` · `деньги` · `баг` · `инфра`. Теги исполнителя: `→cursor`/`→сам`/`→гибрид` (легенда ниже).

**Спринт 20.10–02.11** (разметка сроков 19.10, обновлено по ответам владельца): у каждого пункта срок
меткой `<!-- due:YYYY-MM-DD -->` в конце первой строки. В окно 20.10–02.11 — 5 пунктов (#1,3,4,6,9),
остальные 5 — на 03.11–16.11 (#2,5,7,8,10: ждут восстановления Google или вторичны). IDEAS.md пуст.
Решения владельца 19.10: AdSense — ждём трафик (не подаём); AUTO/health — завести MaxBounty/FlexOffers;
OneLink — настраиваем (шаги в #9); finance — построить 3 вечнозелёных (#6).

## Очередь

**Режим исполнения** (кто делает дешевле по токенам владельца):
`→cursor` — механика / большой объём однотипного письма по стабильному паттерну;
ты пишешь промт, Cursor делает, ты — спот-чек (выборка + сборка/линт).
`→сам` — трудное не напечатать, а *решить*: судейство (SEO по дельте, что откатывать),
контент (текст = продукт), завязка на нестандартный стек/конвенции; выноса нет смысла.
`→гибрид` — подход и первый образец за тобой, тираж по образцу — Cursor.
Глубина проверки: `→cursor` — спот-чек; `→сам` и рискованное — полное ревью.

1. **Собрать входящие бэклинки с сети на money-страницы** — рычаг №1 возврата Google: <!-- crm:0mvarrq7y5739733a45a30cdb --> <!-- due:2026-10-24 -->
   домену нужны ВХОДЯЩИЕ do-follow ссылки (costtrek→home-affordability, thecryptotools→
   capital-gains, ocrsnip→budget, iznkit→margin-markup, foundaday→mortgage, pawdget→budget).
   ⚠️ Проверка live 2026-10-14: задача 08.10 выполнена на ~20% и частично вхолостую — только
   iznkit+pawdget дали do-follow, и то на ГЛАВНУЮ; thecryptotools поставил nofollow/sponsored
   (вес не передаёт); costtrek/ocrsnip/foundaday не ссылались. 2026-10-14 РАЗОСЛАНЫ точечные
   задачи всем 6 сессиям (do-follow + в теле + на money-страницу): costtrek/ocrship/iznkit/
   thecryptotools ✅ собрал do-follow editorial на /en/capital-gains-tax-calculator (гайд
   crypto-taxes-explained, под некрипто прибыли; house-ad nofollow оставлен) — ✅ LIVE 14.10
   (владелец одобрил, verified на проде). iznkit ✅ LIVE 14.10 (verified): /en/tools/quote → do-follow
   rel="noopener" на /en/margin-markup-calculator — первый рабочий бэклинк на money-страницу.
   costtrek ✅ LIVE 15.10 (verified) do-follow на /en/home-affordability-calculator (гайд
   move-abroad, коммит ac10323). ocrsnip/pawdget в работе. foundaday ✅ сделал do-follow
   in-body на /en/mortgage-calculator; публикация находки сдвинута на 15.10 08:00 (Бишкек) —
   ссылка живая с этого момента. Проверка: curl -s foundaday.com/en/f/calclumen-everyday-calculators
   | grep calclumen.com/en/mortgage-calculator. Отслеживать появление
   (CF referrers / GSC Links). Домен budget-таргета сверен 14.10: живой = ocrsnip.com
   (ocrship.com — опечатка в названии сессии, не резолвится); cross-links.ts верен.
   **2026-10-23**: 2-й батч доноров под новые money-страницы. Решение владельца — слать только
   туда, где есть ЧЕСТНАЯ тематическая страница у донора (новые страницы ради ссылки НЕ писать):
   costtrek→property-tax, thecryptotools→cagr, iznkit→fire + traditional-ira. foundaday/izntools
   пропущены (нет темы). ocrsnip/pawdget — только проверяют старые budget-ссылки, новых не ставят.
   Правило: do-follow только единичными контекстными in-body по теме; футер/ротация = nofollow. `индексация`
   · **→сам** (координация сетевых сессий + судейство live-проверок; кода calclumen нет)
2. **Мониторить возврат индексации и показов** — money-страницы висят «unknown»/«crawled, <!-- crm:0mvarrq879483bda28298ad8b --> <!-- due:2026-11-07 -->
   not indexed», показы ~0, кликов из поиска 0 (понижение). Смотреть GSC через 2–4 недели
   после появления ссылок. Все внутренние рычаги под обнаружение уже в проде (контекстные
   ссылки + embed-движок + Spotlight + «Try also»). `трафик`
   · **→сам** (чтение данных GSC/CF + судейство; не код)
3. **Сверять ЖИВЫЕ офферы еженедельно + заводить новые одобренные** — ⚠️ аппрувы Admitad <!-- crm:0mvarrq8a86f59ada20afff1a --> <!-- due:2026-10-27 -->
   ОТКАТЫВАЮТСЯ (12.10 так умерли Square + Doctronic). Раз в неделю: `GET /advcampaigns/
   website/2988056/` → у каждого нашего оффера `connection_status=active`, иначе убрать из кода.
   ✅ Сверка 2026-10-20: все 20 офферов живые (11 Admitad active + 9 Indoleads диплинки 302 ok,
   вкл. Costway→linksynergy). Cricut `49734` → declined (была pending, НЕ завожу). Новых
   гео-релевантных (US/UK/CA/AU) среди активных нет. Trademark Engine `21829` — не в нашем
   Indoleads-аккаунте (подать нельзя через API). Следующая сверка — 27.10. `деньги`
   · **→сам** (внешний API + аппрувы откатываются → решать что убрать/завести; полное ревью)
4. **[Владельцу] Завести US auto/finance партнёрские сети → закрыть пустые кластеры AUTO + health** — топ-CPM US auto-страховка/finance lead-gen в Admitad/Indoleads отсутствует. <!-- crm:0mvarrq8d0cfe6e8839d7e0a2 --> <!-- due:2026-10-24 -->
   Задача владельцу (на этой неделе) — зарегистрироваться publisher'ом:
   • MaxBounty — https://www.maxbounty.com (CPA, сильный US finance/insurance/auto lead-gen; min payout ~$100);
   • FlexOffers — https://www.flexoffers.com (крупная сеть, US finance/insurance);
   • CJ Affiliate — https://www.cj.com (бренды, часть finance/insurance) — опционально.
   ⚠️ При регистрации подтвердить: принимают ли паблишера из Кыргызстана (ИП КГ, Stripe нет) и способ выплат — ориентир **Payoneer** (им платят Awin/CJ/Commission Factory — совпадает с нашим рельсом), иначе wire. Точные payout-термины сетей гуглом не подтвердились → проверять в кабинете. После аппрува прислать мне доступ — подберу офферы под AUTO/health и заведу в код. `деньги`
   · **→сам** (мой этап — подбор/вайринг офферов ПОСЛЕ регистрации владельца)
5. **AdSense — к 16.11 проверить трафик и вернуться к решению** — решение по сети (владелец 19.10): сейчас НЕ подаём, блоки не ставим. <!-- crm:0mvarrq8hbf2369c33b1a6ddf --> <!-- due:2026-11-16 -->
   Обвязка (ads.txt + adsbygoogle, privacy с рекламными пунктами) готова, см. «Сделано». К 16.11 свериться
   с CF/GSC: вернулся ли качественный трафик — тогда пересмотреть подачу. `деньги`
   · **→сам** (решение по данным + действие во внешнем аккаунте владельца)
6. **Построить 3 вечнозелёных finance-калькулятора заранее** (владелец 19.10 — готовим к восстановлению): <!-- crm:0mvarrq8k80b1b4861a82b227 --> <!-- due:2026-11-02 -->
   ✅ ВСЕ 3 СДЕЛАНЫ 23.10 (коммит 244ccf0, с опережением): **property-tax-calculator** (FINANCIAL/Upgrade,
   verified $350k@1.1%=$3,850/yr), **traditional-ira-calculator** (INVESTING/TradingView, verified
   $1.17M pre-tax / $990k after-tax), **cagr-calculator** (INVESTING, verified 1000→2600/5y=21.06%).
   math property-tax/cagr вынесены в src/lib/math + 9 юнит-тестов; Amazon-карточки книг на 2 investing-стр.
   Осталось: проверить 200 на проде после деплоя. `контент`
   · **→сам** (контент = продукт + уникальная математика + нестандартный стек; выноса в Cursor нет)

**↓ Отложено до восстановления Google** (строить контент/менять инфру сейчас = впустую или рискованно):

7. **⚠️ Гео take-home pay по штатам US + UK** — крупный programmatic, топ-CPM. <!-- crm:0mvarrq8o1279508307ae45e6 --> <!-- due:2026-11-16 -->
   ⚠️ Сверка 16.10: базовые `income-tax-calculator` / `paycheck-calculator` / `salary-to-hourly`
   УЖЕ есть — открыт только **погеоштатный programmatic-слой** (сотни страниц типа
   /take-home-pay/california). Нужен источник налоговых данных по штатам + UK. ПОСЛЕ восстановления. `контент`
   · **→гибрид** (каркас: источник данных + шаблон + первый штат = сам; тираж на 50 штатов + UK = cursor)
8. **Cooking/baking конверсии** — ⚠️ Сверка 16.10: В ОСНОВНОМ СДЕЛАНО — <!-- crm:0mvarrq8r1e2f7b044aa04d1e --> <!-- due:2026-11-12 -->
   `cooking-conversion-calculator` уже покрывает cups↔grams (flour/sugar/tbsp/tsp/ml/oz);
   общий `temperature-converter` тоже есть. Остаток: опциональная отдельная «oven temperature»
   страница (газ-марки/fan vs conventional), только при спросе. Низкий CPM, вторично. `контент`
   · **→cursor** (микро: расширение temperature-паттерна на 1 страницу — обкатка пайплайна, не экономия)
9. **Amazon OneLink мультигео UK/CA/AU** (владелец 19.10 — настраиваем; сейчас только .com/US): <!-- crm:0mvarrq8ua90ba19fda461de0 --> <!-- due:2026-10-31 -->
   Шаги ВЛАДЕЛЬЦУ (к 31.10):
   1) зарегистрироваться в Amazon Associates каждой гео: UK — affiliate-program.amazon.co.uk,
      Canada — associates.amazon.ca, Australia — affiliate-program.amazon.com.au; получить
      tracking-тег в каждой (вид `calclumen-21` / `calclumen0c-20` и т.п.);
   2) в US Associates Central (associates.amazon.com) → Tools → OneLink: включить OneLink и
      связать UK/CA/AU-аккаунты;
   3) прислать мне 3 гео-тега + подтвердить домены (.co.uk / .ca / .com.au).
   МОЙ этап после этого: расширить `/go/<slug>` на гео-редирект по стране визитёра (Vercel
   `x-vercel-ip-country`) → нужный Amazon-домен + тег. PA-API (реальные фото/ASIN) — отдельно, после 3 продаж. `деньги`
   · **→сам** (гео-редирект в /go/ после получения тегов + интеграция)
10. **⚠️ Инфра: миграция Vercel → Cloudflare Workers** <!-- crm:0mvarrq8x0d9dee726c29c4e2 --> <!-- due:2026-11-16 -->
   ✅ PREP ГОТОВ 23.10 — ветка `cloudflare-ready`, адаптер @opennextjs/cloudflare (решение
   владельца, зеркало costtrek, НЕ static export). **Проверено живьём на CF Workers рантайме**
   (wrangler dev/workerd): proxy.ts locale-редирект, security-headers, 47 /go/ 302, /api/og 200,
   robots/ads/sitemap, расчёт калькуляторов (FIRE 1.0M→1.25M). Детали + cutover —
   `research/CLOUDFLARE-MIGRATION.md`. ОСТАЛОСЬ (владелец): завести CF API-токен + 2 GitHub-секрета
   (CLOUDFLARE_API_TOKEN + ACCOUNT_ID d6d43b8e…) → preview-деплой → потом merge в main; DNS-cutover
   — отдельное «да», НЕ во время восстановления. `инфра`
   · **→сам** (рискованная миграция; полное ревью)

## Сделано

_(последние ~2 недели)_

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

**Инфра:** Vercel; эконом-деплой (батч-пуши, локальный `npm run build` перед пушем, один поток).
