# CalcLumen — план

Единый источник задач. Актуально: **2026-10-12** · калькуляторов ~132 · sitemap 166 ·
гайдов ~28. Порядок в очереди = приоритет (не дата). Теги: `индексация` · `трафик` ·
`контент` · `скорость` · `деньги` · `баг` · `инфра`.

## Очередь

1. **Собрать входящие бэклинки с сети на money-страницы** — рычаг №1 возврата Google:
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
   (ocrship.com — опечатка в названии сессии, не резолвится); cross-links.ts верен. `индексация`
2. **Мониторить возврат индексации и показов** — money-страницы висят «unknown»/«crawled,
   not indexed», показы ~0, кликов из поиска 0 (понижение). Смотреть GSC через 2–4 недели
   после появления ссылок. Все внутренние рычаги под обнаружение уже в проде (контекстные
   ссылки + embed-движок + Spotlight + «Try also»). `трафик`
3. **Сверять ЖИВЫЕ офферы еженедельно + заводить новые одобренные** — ⚠️ аппрувы Admitad
   ОТКАТЫВАЮТСЯ (12.10 так умерли Square + Doctronic). Раз в неделю: `GET /advcampaigns/
   website/2988056/` → у каждого нашего оффера `connection_status=active`, иначе убрать из кода.
   Новые: Cricut `49734` (pending); Indoleads (кабинет): Trademark Engine `21829` ($50 CPA) 🔥. `деньги`
4. **Закрыть пустые кластеры офферов — AUTO и health** — AUTO всегда был пуст (Way.com declined),
   health опустел после удаления Doctronic. Искать US авто-страховку/lead-gen (топ-CPM) и
   health-оффер под нашу гео. `деньги`
5. **Подать в AdSense, когда вернётся трафик** — обвязка (ads.txt + adsbygoogle) живая,
   сайт в AdSense ещё не добавлен; реклама пока не крутится в полную. Ждём качественный трафик. `деньги`
6. **Строить finance-калькуляторы ТОЧЕЧНО по спросу GSC** (не потоком — новое пока не
   индексируется): property-tax, NPV/IRR/CAGR, traditional-IRA / Social-Security. `контент`

**↓ Отложено до восстановления Google** (строить контент/менять инфру сейчас = впустую или рискованно):

7. **⚠️ Гео take-home pay / income-tax по штатам US + UK** — крупный programmatic, топ-CPM.
   Нужен источник налоговых данных по штатам + UK и согласование объёма. ПОСЛЕ восстановления. `контент`
8. **Cooking/baking конверсии** (cups↔grams, oven temps) — только топ-спрос, точечно, не массово.
   Низкий CPM, вторично. `контент`
9. **Amazon: OneLink + PA-API апгрейд** — OneLink (авто-редирект UK/CA/AU на локальный Amazon;
   сейчас только .com/US); после 3 продаж → PA-API → реальные фото/цены + прямые ASIN вместо
   search-ссылок (выше конверсия). Сейчас tag `calclumen-20`, карточки «Materials» на 21 стр. `деньги`
10. **⚠️ Инфра: миграция Vercel → Cloudflare Pages** — по чеклисту (адаптер vs static export;
   headers→`_headers`; редиректы→`_redirects`/Worker; `/api/og`; сверка на CF preview ДО DNS).
   CF дешевле для статики и уже наш DNS/email/analytics. НЕ во время восстановления (риск
   SEO-сантехнике); только после. `инфра`

## Сделано

_(последние ~2 недели)_

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
