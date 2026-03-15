# RailTech — Comprehensive Code Audit Report

**Date:** 2026-03-15
**Project:** railtech.uz — B2B Industrial Equipment Landing Page
**Stack:** Static HTML + Tailwind CSS CDN + Vanilla JS
**Auditors' Perspectives:** Team Lead Web Developer, SEO Specialist, Senior UX/UI Designer, Lead Content Manager, Head of Marketing

---

## Table of Contents

1. [Team Lead Web Developer](#1-team-lead-web-developer)
2. [SEO Specialist](#2-seo-specialist)
3. [Senior UX/UI Designer](#3-senior-uxui-designer)
4. [Lead Content Manager](#4-lead-content-manager)
5. [Head of Marketing](#5-head-of-marketing)
6. [Priority Matrix](#6-priority-matrix)
7. [Action Items Summary](#7-action-items-summary)

---

## 1. Team Lead Web Developer

### 1.1 Architecture & Build

| Issue | Severity | Details |
|-------|----------|---------|
| **Tailwind CDN in production** | CRITICAL | `cdn.tailwindcss.com` is a Play CDN meant for prototyping. It ships the entire Tailwind runtime (~300 KB JS), parses classes at runtime, and is explicitly marked "not for production" by Tailwind. **Must switch to a build step** (PostCSS / Tailwind CLI) generating a purged CSS file (~5-15 KB). |
| **No build pipeline** | HIGH | No `package.json`, no bundler. All JS is served raw. This blocks minification, tree-shaking, cache-busting, and dependency management. |
| **No CSS minification** | HIGH | Custom `<style>` blocks are unminified and duplicated across pages (index.html, 404.html, privacy.html, terms.html). |
| **Scripts loaded synchronously** | MEDIUM | `js/i18n.js`, `js/main.js`, `js/cookie-consent.js` are loaded without `defer` or `async`. They block parsing. Since they appear before `</body>` this is partially mitigated, but `defer` should still be used for parallel download. |
| **Duplicate data** | MEDIUM | i18n translations are duplicated: inline in `i18n.js` (INLINE object ~180 lines) AND in `locales/*.json` files. Any content update requires changing two places. Should keep JSON as single source of truth and remove inline fallbacks (or auto-generate them at build time). |
| **Empty placeholder files** | LOW | `pages/home.html`, `pages/news.html`, `pages/products.html`, `pages/404.html` are empty. Dead files create confusion and should be removed. |
| **CNAME file** | INFO | CNAME file present (`railtech.uz`) but deploy is to GCS, not GitHub Pages. This file is unnecessary. |

### 1.2 Performance

| Issue | Severity | Details |
|-------|----------|---------|
| **Hero Canvas always runs** | HIGH | The canvas animation runs an infinite `requestAnimationFrame` loop even when scrolled out of view. On desktop this consumes CPU/GPU continuously. Should pause when not visible (Intersection Observer or Page Visibility API). |
| **Google Fonts blocking render** | MEDIUM | Google Fonts stylesheet is render-blocking despite `preload`. Use `display=swap` (already present) but also consider `font-display: optional` or self-hosting fonts for faster LCP. |
| **Large HTML file** | MEDIUM | `index.html` is 83 KB with heavily inlined SVG mockups for the platform section. These decorative mockups could be lazy-loaded or simplified. |
| **No image optimization** | LOW | Partner SVGs are unoptimized (no SVGO). `loco.svg` is 50 KB and only used in a separate preview page. `apple-touch-icon.png` is 15 KB. |
| **No resource hints** | LOW | Missing `preconnect` to `api.web3forms.com`. Missing `dns-prefetch` for CDN resources. |

### 1.3 Code Quality

| Issue | Severity | Details |
|-------|----------|---------|
| **Tooltip XSS risk** | HIGH | `tooltip.innerHTML = '<b style="color:'+hn.color+'">'+hn.label+'</b>...'` in hero canvas. Although `hn.label` and `hn.desc` come from hardcoded JS strings (not user input), using `innerHTML` with string concatenation is a bad pattern. Use `textContent` or template literals with proper escaping. |
| **Web3Forms API key exposed** | HIGH | The access key `3dd5078e-1b78-4abc-97b1-aa15882d7772` is hardcoded in HTML. Also `to` email `zulkaynarov@gmail.com` is publicly visible. Web3Forms keys are designed to be public, but the `to` field should be configured in the Web3Forms dashboard, not in the HTML (it can be spoofed). |
| **Mixed `var`/`const`/`let`** | MEDIUM | Hero canvas code uses `var` throughout while the rest of main.js uses modern `const`/`let`. Inconsistent style. |
| **No error boundaries** | MEDIUM | If `heroCanvas` fails (e.g., WebGL not available), the entire init chain could be affected. Each module initializes silently, but there's no catch around individual inits. |
| **Duplicate section numbering** | LOW | main.js has two sections numbered "6" (FAQ Accordion and Sticky Nav). Minor comment inconsistency. |
| **Cookie consent link broken** | MEDIUM | Cookie banner links to `privacy.html` (relative), but when on the root page, this resolves correctly. However, on subpages (`pages/*.html`), the link would point to `pages/privacy.html` which is correct. BUT the cookie-consent.js is loaded on all pages, and the relative link might fail on 404.html. Should use absolute paths. |
| **No CSP headers** | MEDIUM | No Content-Security-Policy meta tag or headers. The site uses inline scripts, inline styles, and CDN resources — defining a CSP would improve security. |

### 1.4 Deployment

| Issue | Severity | Details |
|-------|----------|---------|
| **JSON files excluded from deploy** | CRITICAL | `deploy.yml` uses `gsutil rsync -x '.*\.json$'` which **excludes all .json files** including `locales/ru.json`, `locales/en.json`, `locales/uz.json`. This means i18n locale files never reach production. The site relies entirely on inline fallback translations. This defeats the purpose of having external JSON files. |
| **No cache headers** | HIGH | GCS upload doesn't set `Cache-Control` headers. Static assets should have long cache times with cache-busting filenames. |
| **Outdated GitHub Actions** | LOW | Uses `actions/checkout@v3` (should be `@v4`). |
| **No staging environment** | INFO | Only deploys `main` branch. No preview deployments for PRs. |

### 1.5 Accessibility (a11y)

| Issue | Severity | Details |
|-------|----------|---------|
| **Missing skip navigation** | HIGH | No "Skip to content" link for keyboard users. |
| **Platform tabs missing ARIA** | MEDIUM | Tab buttons use `role="tab"` but there's no `role="tablist"` wrapper with `id` and `aria-controls`/`aria-labelledby` connections between tabs and panels. The tab panels also need `role="tabpanel"` linked back to their tab. |
| **Canvas not accessible** | MEDIUM | The hero canvas has no alternative text. Screen readers cannot access the supply-chain visualization. Need an `aria-label` on the canvas and a hidden text alternative. |
| **Hardcoded Russian aria-labels** | LOW | `aria-label="Открыть меню"`, `aria-label="Закрыть меню"`, `aria-label="Язык / Language"` are not translated when language switches. |
| **FAQ uses `role="list"` incorrectly** | LOW | FAQ container uses `role="list"` and items use `role="listitem"`, but semantically FAQ is an accordion — should use heading + region pattern or `<details>`/`<summary>`. |
| **Form validation only via `required`** | LOW | No visual error states, no `aria-invalid`, no `aria-describedby` for validation messages. Custom `novalidate` is set but errors are not communicated to assistive tech. |

---

## 2. SEO Specialist

### 2.1 Technical SEO

| Issue | Severity | Details |
|-------|----------|---------|
| **Sitemap lastmod outdated** | HIGH | All URLs in `sitemap.xml` show `<lastmod>2025-01-15</lastmod>`. This is over a year old. Google deprioritizes sitemaps with stale dates. Should auto-update on deploy. |
| **Language variants via query params** | HIGH | Language versions are `?lang=en`, `?lang=uz`. Google has historically had issues with query-parameter-based language variants. Subfolders (`/en/`, `/uz/`) or subdomains are strongly preferred for hreflang. Also, `?lang=` is set via JS (localStorage), not server-side — meaning Google crawler likely only sees the Russian version. |
| **Missing og:image file** | HIGH | `<meta property="og:image" content="https://railtech.uz/og-image.png">` references `og-image.png`, but this file doesn't exist in the repository. Social shares will have no preview image. |
| **No structured data for services** | MEDIUM | Only Organization and WebSite schemas are present. Missing: `Service`, `FAQPage`, `BreadcrumbList`. The FAQ section is a prime candidate for `FAQPage` schema — this could generate rich results in Google. |
| **Partners section hidden** | MEDIUM | Partners marquee section has `style="display:none"`. This E-E-A-T signal (showing partnership with Siemens, ABB, etc.) is invisible to both users and search engines. |
| **No breadcrumbs** | MEDIUM | Subpages (privacy, terms, coming-soon) have no breadcrumb navigation. |
| **meta keywords present** | LOW | `<meta name="keywords">` is ignored by all major search engines since ~2009. Harmless but unnecessary. |
| **Title tag only in Russian** | MEDIUM | The `<title>` and `<meta name="description">` are hardcoded in Russian and not translated by i18n. Google will always index the Russian metadata regardless of `?lang=` variant. |
| **No alt text on logo** | LOW | Logo `<img>` has `alt=""` (decorative). While there's a text "RailTech" next to it, the logo itself could carry `alt="RailTech logo"`. |
| **robots.txt too permissive** | LOW | `Allow: /` allows crawling of all pages including `pages/coming-soon.html` (which has `noindex` but still wastes crawl budget), `preview-loco.html`, and empty placeholder pages. |
| **Coming-soon page indexed?** | LOW | `coming-soon.html` has `noindex, nofollow` which is correct, but it's still linked from multiple places. Consider adding to `robots.txt` disallow. |
| **No 404 in sitemap** | INFO | Correct — 404 page is excluded from sitemap. Good. |

### 2.2 Content SEO

| Issue | Severity | Details |
|-------|----------|---------|
| **Thin content** | HIGH | The landing page is the only content page. No blog, no case studies, no product pages, no team page. For B2B industrial equipment, topical authority requires substantial content. |
| **No internal linking structure** | MEDIUM | Beyond anchor links on the same page, there's no internal linking strategy. Empty `pages/news.html` and `pages/products.html` suggest planned content that was never created. |
| **Keyword targeting is narrow** | MEDIUM | Targeting "железнодорожное оборудование Узбекистан" and similar. No long-tail content for specific products, brands, or use cases. |
| **No local SEO** | MEDIUM | No Google Business Profile integration. Missing `sameAs` in structured data (no social links). Address in footer says "г. Ташкент, Index" — "Index" is a placeholder that was never replaced with actual postal code. |

---

## 3. Senior UX/UI Designer

### 3.1 Visual Design

| Issue | Severity | Details |
|-------|----------|---------|
| **Strong visual identity** | POSITIVE | Clean, professional color palette (slate/blue), consistent typography (Inter), good use of whitespace. Well-suited for B2B industrial audience. |
| **Hero canvas is desktop-only** | MEDIUM | The main visual differentiator (animated supply chain) is `hidden lg:block`. Mobile users (~60%+ of traffic) see only gradient blobs. Need a compelling mobile hero visual. |
| **CTA contrast issue** | MEDIUM | "Перейти в каталог" secondary button in hero has `bg-white/10` — very low contrast on dark background. May not meet WCAG AA contrast ratio (4.5:1). |
| **Stats say "4 страны" but counter shows "3"** | HIGH | `data-counter="3"` but the i18n content implies 4 countries in some places. Inconsistency confuses users. The stat label says `stats_countries:"страны"` (generic plural), but UZ, KZ, RU = 3 countries. Verify the actual number. |
| **Partner logos inconsistent sizing** | LOW | Partner SVGs have varying aspect ratios. Some may appear larger/smaller than others in the marquee. |

### 3.2 Interaction Design

| Issue | Severity | Details |
|-------|----------|---------|
| **No loading state for page** | MEDIUM | No skeleton or loading indicator. On slow connections, users see a blank white page until Tailwind CDN + fonts + JS all load. |
| **Platform showcase has no swipe** | HIGH | On mobile/tablet, the platform showcase tabs require tapping small text buttons. No swipe gestures. For a section with 4 slides, swipe is expected behavior. |
| **FAQ answers truncated in HTML** | MEDIUM | FAQ answers in HTML are shorter than in JSON locale files. E.g., HTML: "Зарегистрируйтесь в личном кабинете, пройдите верификацию, выберите позиции и запросите КП." vs JSON: much longer version with "Менеджер сформирует предложение и пришлёт его в кабинет." Users initially see the short version before i18n loads. |
| **Scroll hint misleading** | LOW | Bounce arrow at bottom of hero suggests scrolling, but it's just a decorative SVG — not clickable. Either make it clickable or use CSS to make intent clearer. |
| **No success state persistence** | LOW | After form submission, success message disappears on scroll. No way to know if submission was successful after navigating away and back. |

### 3.3 Responsive Design

| Issue | Severity | Details |
|-------|----------|---------|
| **Platform mockups desktop-only** | HIGH | All 4 platform slide mockups (product grid, kanban, price breakdown, role grid) are `hidden lg:block`. Mobile users see only text descriptions with no visual representation. This is 50% of the platform section's value proposition gone. |
| **Only two breakpoints** | MEDIUM | Design uses only `sm:` (640px) and `lg:` (1024px). No `md:` breakpoint means tablets (768px-1023px) get the mobile layout. For a B2B site often viewed on company tablets, this is a missed opportunity. |
| **Language switcher hidden on mobile nav** | LOW | The language switcher in the main nav is `hidden sm:block`. It appears in the mobile overlay but is at the bottom — easy to miss. |
| **Footer 4-column layout** | LOW | Footer uses `lg:grid-cols-4` with brand taking `lg:col-span-2`. On small screens it stacks, but on medium screens (sm:grid-cols-2) the brand column may be too wide. |

### 3.4 Micro-interactions

| Issue | Severity | Details |
|-------|----------|---------|
| **Service cards cursor** | LOW | Service cards have `cursor-default` but also have hover effects (`hover:bg-blue-600`). This sends mixed signals — if it changes color on hover, users expect it to be clickable. Either add a link or remove the cursor override. |
| **No focus styles** | MEDIUM | While Tailwind's default focus ring is present on some elements, the custom `focus:ring-2 focus:ring-blue-500/30` is very subtle. May not be visible enough for keyboard navigation. |

---

## 4. Lead Content Manager

### 4.1 Content Quality

| Issue | Severity | Details |
|-------|----------|---------|
| **Placeholder address** | CRITICAL | Footer displays: "г. Ташкент, **Index**, Офис B2-2097". The word "Index" is clearly a placeholder for the postal/zip code that was never replaced. This looks unprofessional and is present in all 3 language versions. |
| **"5 лет на рынке" inconsistency** | HIGH | Stats section says "5+ лет на рынке" with `data-counter="5"`, but foundingDate in JSON-LD is "2021". From 2021 to 2026 = 5 years. This should auto-calculate or be updated annually. Currently requires manual update each year. |
| **i18n content mismatches** | HIGH | HTML fallback text differs from JSON locale content in several places. For example: `index.html` FAQ #1 answer: "Зарегистрируйтесь в личном кабинете, пройдите верификацию, выберите позиции и запросите КП." vs `ru.json`: longer version with additional sentence. This creates a flash of different content when i18n loads. |
| **Uzbek translation quality** | MEDIUM | The Uzbek (`uz`) translation uses Latin script (correct for modern Uzbek), but some translations feel machine-translated. E.g., "Sanoat uskunalarini kompleks yetkazib berish" is grammatically correct but reads awkwardly. Should be reviewed by a native speaker. |
| **English translation inconsistencies** | MEDIUM | "Partner Cabinet" is used instead of the more standard "Client Portal" or "Partner Portal". "Commercial proposal" could be "Quote" or "Quotation" for international audience. |
| **Cookie banner privacy link** | LOW | Cookie banner links to `privacy.html` (relative path). When the cookie appears on the root page, this correctly resolves to `/privacy.html`, but the actual file is at `/pages/privacy.html`. **Broken link.** |

### 4.2 Content Strategy

| Issue | Severity | Details |
|-------|----------|---------|
| **No blog/news section** | HIGH | `pages/news.html` exists but is empty. B2B companies need regular content for SEO, authority, and lead nurturing. |
| **No case studies / testimonials** | HIGH | For B2B industrial equipment, social proof is critical. No customer testimonials, case studies, or project references despite claiming "120+ partners". |
| **No product descriptions** | MEDIUM | `pages/products.html` is empty. The catalog is mentioned but links to "coming-soon". Without product content, the site has low search visibility for specific products. |
| **CTA destinations all go to coming-soon** | HIGH | "Перейти в каталог", "Открыть B2B каталог", "Войти", "B2B Каталог оборудования", "Личный кабинет партнёра" — ALL link to `pages/coming-soon.html`. This means every conversion-oriented CTA leads to a dead end. |

### 4.3 Localization

| Issue | Severity | Details |
|-------|----------|---------|
| **3 language versions, 1 content depth** | MEDIUM | All three languages have identical content depth. For Uzbek market (primary), consider deeper UZ-specific content. |
| **Canvas labels not translated** | HIGH | Hero canvas node labels ("Производство", "Импорт", "Таможня", etc.) are hardcoded in Russian in `main.js`. These are not translated when switching to EN or UZ. This means English/Uzbek users see Russian text in the main hero visualization. |
| **Phone number format** | LOW | Footer: "+998 90 118-90-00" — formatting is fine for UZ market. Consider adding WhatsApp/Telegram links as these are primary communication channels in Uzbekistan. |

---

## 5. Head of Marketing

### 5.1 Conversion Optimization

| Issue | Severity | Details |
|-------|----------|---------|
| **All product CTAs lead to "Coming Soon"** | CRITICAL | The entire bottom-of-funnel conversion path is broken. Every "catalog" and "sign in" button leads to a coming-soon page. Visitors with purchase intent have nowhere to go except the contact form. |
| **No analytics** | CRITICAL | No Google Analytics, Yandex Metrica, or any analytics tool. Cookie consent is prepared for analytics but none are implemented. The business is flying blind — no data on traffic, conversions, or user behavior. |
| **No lead magnets** | HIGH | The only conversion mechanism is the contact form. No downloadable catalogs, no product PDFs, no pricing guides. For B2B equipment, buyers expect downloadable spec sheets and catalogs. |
| **No social proof** | HIGH | Despite claiming 120+ partners including global names (Siemens, ABB, Alstom), the partners section is **hidden** (`display:none`). This is a massive missed opportunity. These logos build immediate credibility. |
| **No urgency/scarcity elements** | MEDIUM | No stock indicators, no limited-time offers, no lead times mentioned prominently. B2B buyers respond to delivery timeline pressure. |
| **Coming-soon page has email signup** | LOW | The coming-soon page has a countdown and email signup, but no indication of what value the platform will provide or when it launches. |

### 5.2 Marketing Infrastructure

| Issue | Severity | Details |
|-------|----------|---------|
| **No UTM tracking** | HIGH | No UTM parameters on any links. When users arrive from ads or campaigns, there's no way to attribute conversions. |
| **No retargeting pixels** | HIGH | No Facebook Pixel, Google Ads tag, or LinkedIn Insight tag. For B2B industrial equipment, LinkedIn retargeting is especially valuable. |
| **No email marketing integration** | MEDIUM | Contact form submissions go to a personal Gmail (`zulkaynarov@gmail.com`) via Web3Forms. No CRM integration, no auto-responders, no lead scoring. |
| **No chatbot / live chat** | MEDIUM | For B2B industrial buyers who need quick answers about product compatibility or pricing, a live chat or WhatsApp button would increase engagement. |
| **Social links missing** | MEDIUM | No links to company social media profiles (LinkedIn, Telegram channel, Instagram). In UZ market, Telegram is especially important. |

### 5.3 Brand & Messaging

| Issue | Severity | Details |
|-------|----------|---------|
| **Value proposition is generic** | MEDIUM | "Комплексные поставки промышленного оборудования" — this could be any industrial supplier. The differentiators (B2B platform, Landed Cost calculator, KYC) are buried in the platform section. These should be front-and-center. |
| **No competitive positioning** | MEDIUM | No mention of why RailTech vs direct imports, vs local dealers, vs trading companies. The market has alternatives and the site doesn't address them. |
| **Missing trust signals at form** | MEDIUM | Contact form has no privacy assurance, no response time promise (it's in the FAQ but not near the form), no "no spam" guarantee. |
| **OG image missing** | HIGH | Social sharing will show no image. Every share on LinkedIn, Telegram, or WhatsApp is a wasted branding opportunity. |

---

## 6. Priority Matrix

### P0 — Fix Immediately (Business Impact)

1. **Replace placeholder "Index" in address** with actual postal code
2. **Unhide partners section** — free credibility
3. **Create og-image.png** for social sharing
4. **Fix deploy.yml** to include locale JSON files
5. **Add analytics** (at minimum Yandex Metrica for UZ market)
6. **Translate canvas node labels** to EN/UZ

### P1 — Fix This Sprint (Technical Debt)

7. **Replace Tailwind CDN** with build step (CLI or PostCSS)
8. **Add `defer` to scripts**
9. **Pause hero canvas** when not visible
10. **Add FAQPage structured data** for rich results
11. **Update sitemap lastmod** dates
12. **Fix cookie banner privacy link** (`privacy.html` → `pages/privacy.html`)
13. **Remove empty placeholder pages**
14. **Synchronize HTML fallback text with JSON content**

### P2 — Plan This Quarter (Growth)

15. Add product catalog content (even as static pages)
16. Create blog/news section with 5-10 seed articles
17. Add case studies with partner logos
18. Implement proper language subfolders (`/en/`, `/uz/`)
19. Add retargeting pixels and UTM tracking
20. Add WhatsApp/Telegram contact buttons
21. Add mobile swipe to platform showcase
22. Create lead magnet (downloadable PDF catalog)

### P3 — Backlog (Nice to Have)

23. Self-host Inter font
24. Add skip navigation link
25. Improve tab/accordion ARIA
26. Add breadcrumbs to subpages
27. Implement proper form validation with error states
28. Add loading skeleton for slow connections

---

## 7. Action Items Summary

| # | Action | Owner | Impact | Effort |
|---|--------|-------|--------|--------|
| 1 | Replace "Index" with postal code | Content | Brand trust | 5 min |
| 2 | Unhide partners section | Dev | Conversion +++ | 5 min |
| 3 | Create and add og-image.png | Design | Social sharing | 1 hr |
| 4 | Fix deploy.yml JSON exclusion | DevOps | i18n broken in prod | 10 min |
| 5 | Add Yandex Metrica / GA4 | Marketing | Data-driven decisions | 30 min |
| 6 | Translate canvas labels | Content/Dev | UX for EN/UZ users | 2 hr |
| 7 | Tailwind build pipeline | Dev | Performance +50% | 4 hr |
| 8 | Add FAQPage schema | Dev/SEO | Rich results | 1 hr |
| 9 | Pause canvas offscreen | Dev | CPU/battery | 30 min |
| 10 | Fix cookie privacy link | Dev | Broken link | 5 min |
| 11 | Sync HTML/JSON content | Content | Flash of content | 1 hr |
| 12 | Blog/news content plan | Content/Marketing | SEO authority | 1 week |

---

*This audit was generated on 2026-03-15. Findings are based on static code analysis of the repository.*
