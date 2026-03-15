(function () {'use strict';
const STORAGE_KEY = 'railtech_cookie_consent';
const CONSENT_VERSION = '1';
function getStored() {try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }}
function setStored(level) {try {localStorage.setItem(STORAGE_KEY, JSON.stringify({level,
version: CONSENT_VERSION,
date: new Date().toISOString()}));} catch {   }
document.dispatchEvent(new CustomEvent('cookieconsent', { detail: { level } }));}
const stored = getStored();
if (stored && stored.version === CONSENT_VERSION) {document.dispatchEvent(new CustomEvent('cookieconsent', { detail: { level: stored.level } }));
return;}
const COPY = {ru: {title: 'Файлы cookie и локальное хранилище',
body: 'Мы сохраняем языковые предпочтения в localStorage вашего браузера — это необходимо для работы сайта. С вашего согласия мы также можем использовать аналитические инструменты для улучшения сервиса.',
learn: 'Подробнее',
accept: 'Принять все',
decline: 'Только необходимые',},
en: {title: 'Cookies & local storage',
body: 'We store language preferences in your browser\'s localStorage — this is required for the site to work. With your consent, we may also use analytics tools to improve our service.',
learn: 'Learn more',
accept: 'Accept all',
decline: 'Essential only',},
uz: {title: 'Cookie fayllari va mahalliy xotira',
body: 'Biz til sozlamalarini brauzeringizning localStorage-da saqlaymiz — bu saytning ishlashi uchun zarur. Roziligingiz bilan xizmatni yaxshilash uchun tahlil vositalaridan ham foydalanishimiz mumkin.',
learn: 'Batafsil',
accept: 'Hammasini qabul qilish',
decline: 'Faqat zarurlar',}};
function getLang() {return (localStorage.getItem('railtech_lang') ||
document.documentElement.lang ||
'ru').slice(0, 2);}
function c(key) {const lang = getLang();
return (COPY[lang] || COPY.ru)[key];}
function showBanner() {const banner = document.createElement('div');
banner.id = 'cookieBanner';
banner.setAttribute('role', 'dialog');
banner.setAttribute('aria-modal', 'false');
banner.setAttribute('aria-label', c('title'));
banner.innerHTML = `
<style>
#cookieBanner {position: fixed; bottom: 0; left: 0; right: 0; z-index: 9998;
background: #0f172a;
border-top: 1px solid rgba(255,255,255,0.08);
box-shadow: 0 -8px 32px rgba(0,0,0,0.4);
font-family: Inter, system-ui, sans-serif;
animation: cb-slide-up 0.4s cubic-bezier(0.16,1,0.3,1) both;}
@keyframes cb-slide-up {from { transform: translateY(100%); opacity: 0; }
to   { transform: translateY(0);    opacity: 1; }}
.cb-inner {max-width: 1200px; margin: 0 auto;
padding: 18px 24px;
display: flex; align-items: center; gap: 20px; flex-wrap: wrap;}
.cb-icon { font-size: 22px; flex-shrink: 0; line-height: 1; }
.cb-text { flex: 1; min-width: 220px; }
.cb-title {font-size: 13px; font-weight: 700; color: #f8fafc;
margin-bottom: 3px; letter-spacing: -0.01em;}
.cb-body {font-size: 12px; color: #94a3b8; line-height: 1.55;}
.cb-body a { color: #60a5fa; text-decoration: underline; }
.cb-actions { display: flex; gap: 8px; flex-shrink: 0; flex-wrap: wrap; align-items: center; }
.cb-btn {font-size: 13px; font-weight: 600; padding: 9px 20px;
border-radius: 10px; cursor: pointer; border: none;
transition: all 0.18s; white-space: nowrap;
font-family: inherit; line-height: 1;}
.cb-btn-primary  { background: #2563eb; color: #fff; }
.cb-btn-primary:hover  { background: #1d4ed8; transform: translateY(-1px); }
.cb-btn-secondary {background: transparent; color: #94a3b8;
border: 1px solid #334155 !important;}
.cb-btn-secondary:hover { background: #1e293b; color: #cbd5e1; }
@media (max-width: 600px) {.cb-inner { padding: 14px 16px; gap: 12px; }
.cb-actions { width: 100%; }
.cb-btn { flex: 1; text-align: center; padding: 10px 12px; }}
</style>
<div class="cb-inner">
<div class="cb-icon" aria-hidden="true">🍪</div>
<div class="cb-text">
<div class="cb-title">${c('title')}</div>
<div class="cb-body">${c('body')} <a href="privacy.html">${c('learn')}</a></div>
</div>
<div class="cb-actions">
<button class="cb-btn cb-btn-secondary" id="cbDecline">${c('decline')}</button>
<button class="cb-btn cb-btn-primary"   id="cbAccept">${c('accept')}</button>
</div>
</div>`;
document.body.appendChild(banner);
document.getElementById('cbAccept').addEventListener('click', () => {setStored('all');
banner.style.animation = 'cb-slide-up 0.3s reverse both';
setTimeout(() => banner.remove(), 280);});
document.getElementById('cbDecline').addEventListener('click', () => {setStored('essential');
banner.style.animation = 'cb-slide-up 0.3s reverse both';
setTimeout(() => banner.remove(), 280);});
document.addEventListener('langchange', function rebuild() {const existing = document.getElementById('cookieBanner');
if (!existing) return;
existing.remove();
document.removeEventListener('langchange', rebuild);
setTimeout(showBanner, 60);});}
function delayedShow() { setTimeout(showBanner, 900); }
if (document.readyState === 'loading') {document.addEventListener('DOMContentLoaded', delayedShow);} else {delayedShow();}})();