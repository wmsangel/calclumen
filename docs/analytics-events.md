# GA4 events — calclumen.com (network standard, 17.11.2026)

Property G-JY9FBM2921 (`src/components/google-analytics.tsx`), helper `track()` in `src/lib/track.ts` (safe no-op без gtag:
сервер, dev, /embed). Consent Mode v2 **по регионам**: EEA+IS/LI/NO+GB+CH — denied до «Accept all»; остальные — granted до
«Reject non-essential» (хранится в `localStorage.ec-consent`: `all` | `essential`). До 17.11 default был denied везде → GA4
видел ~1 сессию/14 дней при ~380 визитах (неконсентные пинги не попадают в отчёты при нашем объёме).

| Событие | Когда | Параметры | Где в коде |
|---|---|---|---|
| `tool_opened` | калькулятор отрендерился у посетителя (1 раз на монтирование) | `tool` = slug, `item` = slug | calc-use-tracker.tsx |
| `tool_used` | расчёт: любой input/change внутри калькулятора, дебаунс 1,5 с (серия ввода = 1 событие) | `tool`, `item`, `action: "calculate"` | calc-use-tracker.tsx |
| `cta_click` | клик по внутреннему CTA | `placement`: `guide_card` \| `spotlight` \| `support`; `tool`; `item` = placement | tracked-link.tsx, feedback-fab.tsx |
| `affiliate_click` | клик по партнёрской ссылке | `network`: admitad \| indoleads \| amazon \| cj \| house; `placement`: `in_article` \| `home` \| `materials`; `item` = offer id; `tool` | offer-panel.tsx, home-offers.tsx, amazon-link.tsx |
| `share` | Copy result / Copy link / копия embed-кода | `method`: `copy_result` \| `copy_link` \| `embed`; `tool`; `item` | result-actions.tsx, embed-snippet.tsx |
| `feedback_open`, `feedback_submit` | виджет обратной связи | `item: "feedback"` | feedback-fab.tsx |

GA4 (Admin, через Chrome владельца): custom dimensions (event scope) `tool`, `placement`, `network`, `method`; key event — `tool_used`.
Проверка на проде: Network → `collect?v=2…&en=<event>&ep.tool=…`, параметр `gcs=G111` (granted) / `G100` (denied); GA4 Realtime.
Новые инструменты получают события автоматически через CalcShell → CalcUseTracker.
