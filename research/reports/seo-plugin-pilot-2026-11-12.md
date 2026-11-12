# Пилот плагина claude-seo на calclumen.com — 12.11.2026

Запуск: `/seo audit https://calclumen.com` → 7 агентов параллельно (technical, content, schema,
performance, geo, backlinks, sxo) на страницах /en, /en/finance, mortgage, rent-vs-buy, bonus-tax,
apr, guides/apr-vs-apy-explained, about. Артефакты: scratchpad `calclumen.com-audit/findings/*.md`
+ raw Lighthouse JSON + Common Crawl JSON.

## Время и стоимость
- `claude-seo setup` (Python 3.14 + Chromium): 8 мин 15 с, однократно на машине.
- Прогон 7 агентов: 1–3,5 мин параллельно; суммарно ~240k токенов субагентов.
- Разбор + фикс найденного бага + отчёт: ~20 мин. Итого ~35 мин с нуля, ~15 мин повторно.

## Новое и полезное (чего не было в моих замерах 12.11)
1. **Баг на bonus-tax**: «Medicare 1.4500000000000002% plus 0.8999999999999999%» — сырые float
   в тексте. Починено 2d8b560, задеплоено, проверено на проде («1.45% plus 0.9%»).
2. **Lighthouse (lab)**: /en mobile LCP 2,5 с (граница), DOM 2439 элементов (норма ≤1500),
   калькулятор 703; вес страницы ~1 MB, из них 3rd-party 560–590 KB (gtag 178, AdSense 169+57,
   FundingChoices 71). Score 95–99. INP не измерить в lab, TBT низкий.
3. **AI-краулеры**: GPTBot/OAI-SearchBot/ClaudeBot/PerplexityBot/CCBot/Googlebot — все 200,
   одинаковый HTML, Cloudflare никого не режет (проверено по UA, а не предположено).
4. **Common Crawl Aug–Oct 2026**: calclumen.com отсутствует в веб-графе; jupid.com и ustax.tools
   присутствуют (ранги в миллионах). Независимое подтверждение authority gate.
5. **SXO на APR-странице**: meta-description обещает «monthly→APR, APR vs APY», калькулятор этого
   не делает; поле названо «Nominal interest rate (APR %)», что противоречит тексту страницы.
   Персона «погасить досрочно» на mortgage — 49/100 (нет extra payments). Единственный агент,
   который реально сравнивает с SERP-конкурентами (NerdWallet, calculator.net, Omni).
6. **Структура заголовков**: первый H2 на каждом калькуляторе — блок офферов «Financial services
   you may like»; все H2 — одинаковый бойлерплейт на 135 страницах.
7. **Schema**: HowTo (rich results сняты 09.2023) и FAQ (сняты 05.2026) — не вредят, но лишние;
   Article на гайдах без image / Person-автора / isPartOf; Organization без sameAs/contactPoint.
8. Мелочи: 404-страница с двумя конфликтующими `meta robots`; title главной «… · CalcLumen» дублирует
   бренд; нет CSP; `X-Powered-By` торчит.

## Шум / дубль
- Technical 88/100: canonical, hreflang, robots, sitemap, редиректы, security headers — всё известно.
- **Ложное срабатывание**: «IndexNow не настроен, /indexnow.txt 404» — ключ лежит в
  `public/<key>.txt`, пинг в deploy.yml; плагин ищет только фиксированное имя.
- Content/E-E-A-T 39/100 («нет авторов, одинаковый шаблон, нет источников, автодаты») — ровно
  чеклист AdSense-remediation (сб 14.11). Подтверждение, не открытие. Полезная конкретика:
  основного текста 589–742 слова на калькулятор (а не 1,1k «всего видимого»).
- GEO 47/100 — на 70 % дублирует content; llms.txt необязателен; «YouTube/Reddit» не наш канал.
- Backlinks без Moz/Bing-ключей — только CC-граф, «INSUFFICIENT DATA». Не запускать без ключей.
- Performance: CrUX не достал (PSI без ключа); у нас CWV есть в stats.db.
- Советы «state selector, 15 vs 30, chart, таблица на каждой странице» — фича-бэклог, не аудит.

## Сверка с замерами 12.11
Совпадает по индексации/авторитету. Lighthouse TTFB 120–540 мс (обычный UA) против моего
Googlebot-UA 0,33–2,8 с → медленно именно боту, не пользователям; вопрос edge-кэша HTML остаётся
пунктом разбора 16.11.

## Вердикт: раскатывать с оговорками
- **Да**: `/seo technical` (~1 мин: 404-meta, title, цепочки редиректов, заголовки);
  `/seo schema` на 3–5 шаблонных страницах после каждого изменения шаблона;
  `/seo page <url>` на каждой новой странице перед пушем (ловит баги вроде bonus-tax);
  `/seo sxo` раз в квартал на 3 money-запросах.
- **Нет**: полный `/seo audit` (7 агентов, 60 % дубль), backlinks без API, geo (дубль content),
  performance (есть CrUX).
- Оговорка: выводы плагина — данные; половина рекомендаций генерик. Ценность в детекторах.
- Стандарт для сети: technical + schema + page-на-новое, ~5 мин/сайт; setup уже сделан.

## В план calclumen
- сб 14.11 (trust block): перенести блок офферов ниже пояснения; тематические H2; убрать HowTo;
  Person-автор + sameAs; 404 meta; title главной.
- APR-страница: переименовать поле, привести description к функциям (или добавить режимы).
- чт 19.11 замеры: DOM главной (2439 → ≤1500 вместе с ужатием HTML 475 KB).
