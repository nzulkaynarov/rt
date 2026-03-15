(function () {'use strict';
function initMobileMenu() {const btn = document.getElementById('menuToggle');
const overlay = document.getElementById('mobileMenu');
const closeBtn = document.getElementById('menuClose');
if (!btn || !overlay) return;
function open() {overlay.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
overlay.classList.add('opacity-100', 'translate-y-0');
document.body.style.overflow = 'hidden';
btn.setAttribute('aria-expanded', 'true');}
function close() {overlay.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
overlay.classList.remove('opacity-100', 'translate-y-0');
document.body.style.overflow = '';
btn.setAttribute('aria-expanded', 'false');}
btn.addEventListener('click', open);
if (closeBtn) closeBtn.addEventListener('click', close);
overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });}
function initScrollReveal() {const els = document.querySelectorAll('[data-reveal]');
if (!els.length) return;
const obs = new IntersectionObserver((entries) => {entries.forEach(entry => {if (!entry.isIntersecting) return;
const el = entry.target;
const delay = el.dataset.revealDelay || '0';
setTimeout(() => {el.classList.remove('opacity-0', 'translate-y-8', 'translate-x-8', '-translate-x-8', 'scale-95');
el.classList.add('opacity-100', 'translate-y-0', 'translate-x-0', 'scale-100');}, parseInt(delay));
obs.unobserve(el);});}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
els.forEach(el => {el.classList.add('transition-all', 'duration-700', 'ease-out');
obs.observe(el);});}
function animateCounter(el, target, suffix = '', duration = 1800) {let start = null;
const startVal = 0;
function step(ts) {if (!start) start = ts;
const progress = Math.min((ts - start) / duration, 1);
const eased = 1 - Math.pow(1 - progress, 3);
const current = Math.floor(startVal + (target - startVal) * eased);
el.textContent = current.toLocaleString('ru') + suffix;
if (progress < 1) requestAnimationFrame(step);}
requestAnimationFrame(step);}
function initCounters() {const counters = document.querySelectorAll('[data-counter]');
if (!counters.length) return;
const obs = new IntersectionObserver((entries) => {entries.forEach(entry => {if (!entry.isIntersecting) return;
const el = entry.target;
const target = parseInt(el.dataset.counter, 10);
const suffix = el.dataset.counterSuffix || '';
animateCounter(el, target, suffix);
obs.unobserve(el);});}, { threshold: 0.5 });
counters.forEach(el => obs.observe(el));}
function initPlatformShowcase() {const slides = document.querySelectorAll('.platform-slide');
const dots = document.querySelectorAll('.platform-dot');
const tabs = document.querySelectorAll('.platform-tab');
const progressEl = document.getElementById('platformProgress');
if (!slides.length) return;
const SLIDE_COUNT = slides.length;
let currentSlide = -1;
let autoplayTimer = null;
let progressRaf = null;
let progressStart = null;
const AUTOPLAY_DELAY = 4500;
function startProgress() {if (!progressEl) return;
if (progressRaf) cancelAnimationFrame(progressRaf);
progressEl.style.transition = 'none';
progressEl.style.width = '0%';
progressStart = null;
function animateProgress(ts) {if (!progressStart) progressStart = ts;
const pct = Math.min(((ts - progressStart) / AUTOPLAY_DELAY) * 100, 100);
progressEl.style.width = pct + '%';
if (pct < 100) progressRaf = requestAnimationFrame(animateProgress);}
progressRaf = requestAnimationFrame(animateProgress);}
function stopProgress() {if (progressRaf) { cancelAnimationFrame(progressRaf); progressRaf = null; }
if (progressEl) { progressEl.style.transition = 'none'; progressEl.style.width = '0%'; }}
function goToSlide(idx) {if (idx === currentSlide) return;
currentSlide = idx;
slides.forEach((slide, i) => {if (i === idx) {slide.classList.remove('opacity-0', 'translate-x-8');
slide.classList.add('opacity-100', 'translate-x-0');
slide.removeAttribute('aria-hidden');} else {slide.classList.add('opacity-0', 'translate-x-8');
slide.classList.remove('opacity-100', 'translate-x-0');
slide.setAttribute('aria-hidden', 'true');}});
dots.forEach((dot, i) => {dot.classList.toggle('bg-blue-500', i === idx);
dot.classList.toggle('scale-125', i === idx);
dot.classList.toggle('bg-white/30', i !== idx);
dot.classList.toggle('scale-100', i !== idx);});
tabs.forEach((tab, i) => {if (i === idx) {tab.classList.add('text-white', 'border-blue-500', 'bg-blue-500/10');
tab.classList.remove('text-slate-500', 'border-transparent', 'hover:text-slate-300');
tab.setAttribute('aria-selected', 'true');} else {tab.classList.remove('text-white', 'border-blue-500', 'bg-blue-500/10');
tab.classList.add('text-slate-500', 'border-transparent', 'hover:text-slate-300');
tab.setAttribute('aria-selected', 'false');}});}
function startAutoplay() {clearInterval(autoplayTimer);
startProgress();
autoplayTimer = setInterval(() => {goToSlide((currentSlide + 1) % SLIDE_COUNT);
startProgress();}, AUTOPLAY_DELAY);}
dots.forEach((dot, i) => {dot.addEventListener('click', () => {goToSlide(i);
startAutoplay();});});
tabs.forEach((tab, i) => {tab.addEventListener('click', () => {goToSlide(i);
startAutoplay();});});
const showcaseEl = document.getElementById('platform');
if (showcaseEl) {showcaseEl.addEventListener('mouseenter', () => {clearInterval(autoplayTimer);
stopProgress();});
showcaseEl.addEventListener('mouseleave', startAutoplay);}
goToSlide(0);
startAutoplay();}
function initHeroCanvas() {const canvas = document.getElementById('heroCanvas');
if (!canvas || !canvas.getContext) return;
const ctx = canvas.getContext('2d');
let W = 0, H = 0, raf = null, dpr = window.devicePixelRatio || 1;
const heroSection = document.getElementById('heroSection') || canvas.parentElement;
function resize() {const r = heroSection.getBoundingClientRect();
W = r.width || 1200; H = r.height || 700;
canvas.width = W * dpr; canvas.height = H * dpr;
canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);}
resize();
window.addEventListener('resize', function(){ dpr = window.devicePixelRatio||1; resize(); }, { passive: true });
var PI2 = Math.PI * 2;
var logoImg = new Image();
logoImg.src = (function() {try {var s = document.querySelectorAll('script[src*="main.js"]');
return s[s.length-1].getAttribute('src').replace(/js\/main\.js.*/, 'images/logo-outline.svg');} catch(e) { return 'images/logo-outline.svg'; }})();
var logoReady = false;
logoImg.onload = function(){ logoReady = true; };
var mouse = { x: W * 0.65, y: H * 0.5, active: false };
var hoveredNode = -1;
var tooltip = document.createElement('div');
tooltip.id = 'heroTooltip';
tooltip.style.cssText = 'position:fixed;pointer-events:none;opacity:0;transition:opacity 0.2s;background:rgba(15,23,42,0.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);color:#fff;font-size:12px;padding:8px 14px;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.4);z-index:9999;max-width:220px;line-height:1.4';
document.body.appendChild(tooltip);
canvas.addEventListener('mousemove', function(e) {var r = canvas.getBoundingClientRect();
mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;}, { passive: true });
canvas.addEventListener('mouseleave', function() { mouse.active = false; hoveredNode = -1; if(tooltip) tooltip.style.opacity='0'; canvas.style.cursor='default'; }, { passive: true });
canvas.addEventListener('click', function(e) {var r = canvas.getBoundingClientRect();
var mx = e.clientX - r.left, my = e.clientY - r.top;
for (var ci = 0; ci < NODES.length; ci++) {var cn = NODES[ci];
if (!cn._sx) continue;
var dx = mx - cn._sx, dy = my - cn._sy;
if (dx*dx + dy*dy < 900) {cn._pulse = 1.0; cn._pulseTime = 0;
for (var cj = 0; cj < comets.length; cj++) {if (comets[cj].node === ci) comets[cj].speed *= 2.5;}
break;}}});
var NODES = [
{ label:'Производство', desc:'Заводы-партнёры по всему миру', icon:'factory', orbit:1, angle:0, color:'#3b82f6', speed: 0.06, role:'source' },
{ label:'Импорт', desc:'Международные закупки и контракты', icon:'import', orbit:1, angle:0.90, color:'#8b5cf6', speed: 0.06, role:'source' },
{ label:'Таможня', desc:'Полная таможенная очистка', icon:'customs', orbit:1, angle:1.80, color:'#f59e0b', speed: 0.06, role:'source' },
{ label:'Логистика', desc:'Доставка до склада в Ташкенте', icon:'logistics', orbit:1, angle:2.70, color:'#6366f1', speed: 0.06, role:'source' },
{ label:'КП / Docs', desc:'Коммерческие предложения и документы', icon:'docs', orbit:1, angle:3.60, color:'#06b6d4', speed: 0.06, role:'source' },
{ label:'Сертификация', desc:'Сертификаты соответствия и качества', icon:'cert', orbit:2, angle:0.8, color:'#ec4899', speed:-0.04, role:'source' },
{ label:'Склад', desc:'Хранение и учёт оборудования', icon:'warehouse', orbit:2, angle:2.37, color:'#14b8a6', speed:-0.04, role:'source' },
{ label:'Аналитика', desc:'Мониторинг цен и рынка', icon:'analytics', orbit:2, angle:3.93, color:'#f97316', speed:-0.04, role:'source' },
{ label:'Поддержка', desc:'Техническое сопровождение 24/7', icon:'support', orbit:2, angle:5.50, color:'#a855f7', speed:-0.04, role:'source' },
];
var CLIENT = { label:'Клиент', desc:'Готовое решение «под ключ»', icon:'client', color:'#10b981', _sx:0, _sy:0, _pulse:0, _pulseTime:0 };
var comets = [];
for (var ci = 0; ci < NODES.length; ci++) {NODES[ci]._sx = 0; NODES[ci]._sy = 0; NODES[ci]._pulse = 0; NODES[ci]._pulseTime = 0;
for (var cp = 0; cp < 2; cp++) {comets.push({ node: ci, t: cp * 0.5, speed: 0.003 + Math.random() * 0.002, dir: 'in', tailLen: 8 + Math.floor(Math.random()*6) });}}
for (var gc = 0; gc < 3; gc++) {comets.push({ node: -1, t: gc * 0.33, speed: 0.004 + Math.random() * 0.002, dir: 'out', tailLen: 12 + Math.floor(Math.random()*5) });}
var bgParts = [];
for (var bi = 0; bi < 60; bi++) {bgParts.push({ x: Math.random(), y: Math.random(), r: 0.4 + Math.random() * 1.2, vx: (Math.random()-0.5)*0.0002, vy: (Math.random()-0.5)*0.0002, phase: Math.random()*PI2 });}
function rgba(hex, a) {return 'rgba('+parseInt(hex.slice(1,3),16)+','+parseInt(hex.slice(3,5),16)+','+parseInt(hex.slice(5,7),16)+','+a+')';}
function ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
function lerp(a, b, t) { return a + (b - a) * t; }
function drawNodeIcon(id, x, y, r, col) {var s = r * 0.38;
ctx.save(); ctx.translate(x, y);
ctx.strokeStyle = col; ctx.fillStyle = col;
ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
switch(id) {case 'factory':
ctx.beginPath(); ctx.rect(-s,-s*0.4,s*2,s*1.2); ctx.stroke();
ctx.fillRect(-s*0.2,s*0.15,s*0.4,s*0.65);
ctx.beginPath(); ctx.rect(-s*0.6,-s*1,s*0.3,s*0.6); ctx.stroke(); break;
case 'import':
ctx.beginPath(); ctx.rect(-s*0.8,-s*0.8,s*1.6,s*1.6); ctx.stroke();
ctx.beginPath(); ctx.moveTo(0,s*0.4); ctx.lineTo(0,-s*0.25);
ctx.moveTo(-s*0.35,0.05); ctx.lineTo(0,-s*0.4); ctx.lineTo(s*0.35,0.05); ctx.stroke(); break;
case 'customs':
ctx.beginPath(); ctx.arc(0,0,s*0.8,0,PI2); ctx.stroke();
ctx.beginPath(); ctx.moveTo(-s*0.4,0); ctx.lineTo(-s*0.08,s*0.35); ctx.lineTo(s*0.45,-s*0.35); ctx.stroke(); break;
case 'client':
ctx.beginPath(); ctx.arc(0,-s*0.2,s*0.4,0,PI2); ctx.stroke();
ctx.beginPath(); ctx.moveTo(-s*0.6,s*0.65);
ctx.bezierCurveTo(-s*0.6,s*0.1,s*0.6,s*0.1,s*0.6,s*0.65); ctx.stroke(); break;
case 'docs':
ctx.beginPath(); ctx.moveTo(-s*0.5,-s*0.9); ctx.lineTo(s*0.2,-s*0.9);
ctx.lineTo(s*0.7,-s*0.3); ctx.lineTo(s*0.7,s*0.9);
ctx.lineTo(-s*0.5,s*0.9); ctx.closePath(); ctx.stroke();
ctx.beginPath(); ctx.moveTo(-s*0.2,-s*0.1); ctx.lineTo(s*0.3,-s*0.1);
ctx.moveTo(-s*0.2,s*0.2); ctx.lineTo(s*0.3,s*0.2); ctx.stroke(); break;
case 'logistics':
ctx.beginPath(); ctx.rect(-s*0.8,-s*0.4,s*1,s*0.8); ctx.stroke();
ctx.beginPath(); ctx.rect(s*0.15,-s*0.3,s*0.6,s*0.7); ctx.stroke();
ctx.beginPath(); ctx.arc(-s*0.3,s*0.5,s*0.2,0,PI2); ctx.arc(s*0.55,s*0.5,s*0.2,0,PI2); ctx.stroke(); break;
case 'cert':
ctx.beginPath(); ctx.arc(0,-s*0.15,s*0.55,0,PI2); ctx.stroke();
ctx.beginPath(); ctx.moveTo(-s*0.2,s*0.35); ctx.lineTo(0,s*0.85); ctx.lineTo(s*0.2,s*0.35); ctx.stroke(); break;
case 'warehouse':
ctx.beginPath(); ctx.moveTo(-s*0.7,s*0.1); ctx.lineTo(0,-s*0.7); ctx.lineTo(s*0.7,s*0.1); ctx.stroke();
ctx.beginPath(); ctx.rect(-s*0.55,s*0.1,s*1.1,s*0.7); ctx.stroke();
ctx.fillRect(-s*0.15,s*0.3,s*0.3,s*0.5); break;
case 'analytics':
ctx.beginPath(); ctx.moveTo(-s*0.5,s*0.4); ctx.lineTo(-s*0.15,-s*0.1); ctx.lineTo(s*0.15,s*0.15); ctx.lineTo(s*0.5,-s*0.5); ctx.stroke();
ctx.beginPath(); ctx.arc(s*0.5,-s*0.5,s*0.15,0,PI2); ctx.fill(); break;
case 'support':
ctx.beginPath(); ctx.arc(0,-s*0.1,s*0.55,0,PI2); ctx.stroke();
ctx.font = 'bold '+(s*1.1)+'px Inter,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
ctx.fillText('?',0,0); break;}
ctx.restore();}
function bezierPoint(p0x, p0y, p1x, p1y, p2x, p2y, t) {var it = 1 - t;
return {x: it*it*p0x + 2*it*t*p1x + t*t*p2x,
y: it*it*p0y + 2*it*t*p1y + t*t*p2y};}
function drawComet(headX, headY, trail, color, alpha, isGolden) {if (trail.length < 2) return;
for (var ti = 1; ti < trail.length; ti++) {var ta = alpha * (1 - ti / trail.length) * 0.8;
var tw = isGolden ? (3.5 - ti * 0.2) : (2.5 - ti * 0.15);
if (tw < 0.3) tw = 0.3;
ctx.beginPath();
ctx.moveTo(trail[ti-1].x, trail[ti-1].y);
ctx.lineTo(trail[ti].x, trail[ti].y);
ctx.strokeStyle = isGolden ? rgba('#fbbf24', ta) : rgba(color, ta);
ctx.lineWidth = tw;
ctx.stroke();}
var gr = isGolden ? 8 : 5;
var hg = ctx.createRadialGradient(headX, headY, 0, headX, headY, gr);
hg.addColorStop(0, isGolden ? 'rgba(251,191,36,'+alpha*0.9+')' : rgba(color, alpha*0.8));
hg.addColorStop(0.4, isGolden ? 'rgba(251,191,36,'+alpha*0.3+')' : rgba(color, alpha*0.3));
hg.addColorStop(1, 'transparent');
ctx.beginPath(); ctx.arc(headX, headY, gr, 0, PI2);
ctx.fillStyle = hg; ctx.fill();
ctx.beginPath(); ctx.arc(headX, headY, isGolden ? 2.5 : 1.8, 0, PI2);
ctx.fillStyle = 'rgba(255,255,255,' + alpha * 0.95 + ')';
ctx.fill();}
var pulseWaves = [];
var cometTrails = {};
function draw(ts) {var t = ts * 0.001;
ctx.clearRect(0, 0, W, H);
var cx = W * 0.58, cy = H * 0.48;
var baseR = Math.min(W * 0.10, H * 0.13, 75);
var orbit1R = Math.min(baseR * 2.6, W * 0.22);
var orbit2R = Math.min(baseR * 3.5, W * 0.30);
var clientX = Math.min(cx + orbit2R + 60, W - 100);
var clientY = cy + 5;
CLIENT._sx = clientX; CLIENT._sy = clientY;
var mx = mouse.active ? (mouse.x - W*0.5) * 0.015 : 0;
var my = mouse.active ? (mouse.y - H*0.5) * 0.01 : 0;
for (var bpi = 0; bpi < bgParts.length; bpi++) {var bp = bgParts[bpi];
bp.x += bp.vx; bp.y += bp.vy;
if (bp.x < -0.05 || bp.x > 1.05) bp.vx *= -1;
if (bp.y < -0.05 || bp.y > 1.05) bp.vy *= -1;
var ba = 0.06 + 0.06 * Math.sin(t * 0.7 + bp.phase);
var bpx = bp.x * W + mx * bp.r * 3;
var bpy = bp.y * H + my * bp.r * 3;
ctx.beginPath(); ctx.arc(bpx, bpy, bp.r, 0, PI2);
ctx.fillStyle = 'rgba(148,163,184,' + ba + ')';
ctx.fill();}
var g0 = ctx.createRadialGradient(cx+mx, cy+my, baseR*0.5, cx+mx, cy+my, orbit2R*1.2);
g0.addColorStop(0, 'rgba(37,99,235,0.08)');
g0.addColorStop(0.5, 'rgba(99,102,241,0.03)');
g0.addColorStop(1, 'transparent');
ctx.beginPath(); ctx.arc(cx+mx, cy+my, orbit2R*1.2, 0, PI2);
ctx.fillStyle = g0; ctx.fill();
function drawOrbit(radius, alpha, dash) {ctx.save(); ctx.translate(cx + mx*0.5, cy + my*0.5);
ctx.scale(1, 0.38);
ctx.beginPath(); ctx.arc(0, 0, radius, 0, PI2);
ctx.setLineDash(dash ? [dash, dash*1.8] : []);
ctx.lineDashOffset = -t * 12;
ctx.strokeStyle = 'rgba(96,165,250,' + alpha + ')';
ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
ctx.restore();}
drawOrbit(orbit1R, 0.10, 5);
drawOrbit(orbit2R, 0.06, 7);
var hx = cx + mx*0.5, hy = cy + my*0.5;
var gHub = ctx.createRadialGradient(hx - baseR*0.15, hy - baseR*0.15, baseR*0.05, hx, hy, baseR);
gHub.addColorStop(0, 'rgba(37,99,235,0.3)');
gHub.addColorStop(0.6, 'rgba(30,58,138,0.18)');
gHub.addColorStop(1, 'rgba(15,23,42,0.35)');
ctx.beginPath(); ctx.arc(hx, hy, baseR, 0, PI2);
ctx.fillStyle = gHub; ctx.fill();
var hubPulse = 0.25 + 0.1 * Math.sin(t * 1.5);
ctx.beginPath(); ctx.arc(hx, hy, baseR, 0, PI2);
ctx.strokeStyle = 'rgba(96,165,250,' + hubPulse + ')';
ctx.lineWidth = 1.5; ctx.stroke();
for (var hr = 0; hr < 3; hr++) {var hrr = baseR * (1.08 + hr * 0.12) + Math.sin(t * 2 + hr) * 2;
ctx.beginPath(); ctx.arc(hx, hy, hrr, 0, PI2);
ctx.strokeStyle = 'rgba(96,165,250,' + (0.07 - hr * 0.02) + ')';
ctx.lineWidth = 0.7; ctx.stroke();}
if (logoReady) {var lp = Math.min(1, t / 2.0);
var ep = ease(lp);
var logoS = baseR * 1.4;
var ly = hy + Math.sin(t * 0.4) * 2;
ctx.save();
ctx.shadowColor = 'rgba(53,129,155,' + (0.6 * ep) + ')';
ctx.shadowBlur = 25 * ep;
ctx.globalAlpha = 0.9 * ep;
ctx.drawImage(logoImg, hx - logoS/2, ly - logoS/2, logoS, logoS);
ctx.shadowBlur = 0;
ctx.globalAlpha = 0.12 * ep;
ctx.globalCompositeOperation = 'lighter';
ctx.drawImage(logoImg, hx - logoS/2, ly - logoS/2, logoS, logoS);
ctx.globalCompositeOperation = 'source-over';
ctx.restore();}
var newHovered = -1;
for (var ni = 0; ni < NODES.length; ni++) {var nd = NODES[ni];
var oR = nd.orbit === 1 ? orbit1R : orbit2R;
var a = nd.angle + t * nd.speed;
var px = mx * (nd.orbit === 1 ? 0.7 : 1.0);
var py = my * (nd.orbit === 1 ? 0.5 : 0.8);
nd._sx = cx + Math.cos(a) * oR + px;
nd._sy = cy + Math.sin(a) * oR * 0.38 + py;
nd._z = Math.sin(a);
nd._a = a;
if (mouse.active) {var ddx = mouse.x - nd._sx, ddy = mouse.y - nd._sy;
if (ddx*ddx + ddy*ddy < 900) newHovered = ni;}}
if (newHovered !== hoveredNode) {hoveredNode = newHovered;
if (hoveredNode >= 0 && tooltip) {var hn = NODES[hoveredNode];
tooltip.innerHTML = '<b style="color:'+hn.color+'">'+hn.label+'</b><br><span style="opacity:0.7">'+hn.desc+'</span>';
tooltip.style.opacity = '1';
canvas.style.cursor = 'pointer';} else if (tooltip) {tooltip.style.opacity = '0';
canvas.style.cursor = 'default';}}
if (hoveredNode >= 0 && tooltip) {var cr = canvas.getBoundingClientRect();
tooltip.style.left = (cr.left + NODES[hoveredNode]._sx + 20) + 'px';
tooltip.style.top = (cr.top + NODES[hoveredNode]._sy - 15) + 'px';}
if (mouse.active) {var cdx = mouse.x - clientX, cdy = mouse.y - clientY;
if (cdx*cdx + cdy*cdy < 1200 && hoveredNode < 0) {if (tooltip) {tooltip.innerHTML = '<b style="color:'+CLIENT.color+'">'+CLIENT.label+'</b><br><span style="opacity:0.7">'+CLIENT.desc+'</span>';
tooltip.style.opacity = '1';
var cr2 = canvas.getBoundingClientRect();
tooltip.style.left = (cr2.left + clientX + 25) + 'px';
tooltip.style.top = (cr2.top + clientY - 15) + 'px';
canvas.style.cursor = 'pointer';}}}
for (var li = 0; li < NODES.length; li++) {var ln = NODES[li];
var la = 0.04 + (ln._z + 1) * 0.04;
if (li === hoveredNode) la *= 3;
ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(ln._sx, ln._sy);
ctx.setLineDash([3, 7]); ctx.lineDashOffset = -t * 18;
ctx.strokeStyle = rgba(ln.color, la);
ctx.lineWidth = 0.7; ctx.stroke(); ctx.setLineDash([]);}
var cla = 0.15 + 0.05 * Math.sin(t * 2);
ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(clientX, clientY);
ctx.setLineDash([4, 6]); ctx.lineDashOffset = -t * 25;
ctx.strokeStyle = rgba('#fbbf24', cla);
ctx.lineWidth = 1.2; ctx.stroke(); ctx.setLineDash([]);
for (var di = 0; di < NODES.length; di++) {var dn = NODES[di];
var dz = dn._z;
var dAlpha = 0.35 + (dz + 1) * 0.325;
var dR = (dn.orbit === 1 ? 20 : 16) * (0.75 + (dz + 1) * 0.125);
var isHov = (di === hoveredNode);
if (isHov) { dR *= 1.3; dAlpha = 1; }
var ng = ctx.createRadialGradient(dn._sx, dn._sy, 0, dn._sx, dn._sy, dR * (isHov ? 3.5 : 2.5));
ng.addColorStop(0, rgba(dn.color, (isHov ? 0.25 : 0.1) * dAlpha));
ng.addColorStop(1, 'transparent');
ctx.beginPath(); ctx.arc(dn._sx, dn._sy, dR * (isHov ? 3.5 : 2.5), 0, PI2);
ctx.fillStyle = ng; ctx.fill();
ctx.beginPath(); ctx.arc(dn._sx, dn._sy, dR, 0, PI2);
var nf = ctx.createRadialGradient(dn._sx-dR*0.2, dn._sy-dR*0.2, dR*0.1, dn._sx, dn._sy, dR);
nf.addColorStop(0, rgba(dn.color, 0.22 * dAlpha));
nf.addColorStop(1, rgba(dn.color, 0.08 * dAlpha));
ctx.fillStyle = nf; ctx.fill();
ctx.strokeStyle = rgba(dn.color, (isHov ? 0.8 : 0.45) * dAlpha);
ctx.lineWidth = isHov ? 2 : 1.2; ctx.stroke();
ctx.globalAlpha = dAlpha;
drawNodeIcon(dn.icon, dn._sx, dn._sy, dR, rgba(dn.color, 0.9));
ctx.globalAlpha = 1;
ctx.font = (isHov ? '700 11' : (dn.orbit===1 ? '600 9' : '500 9')) + 'px Inter,system-ui,sans-serif';
ctx.fillStyle = rgba(dn.color, (isHov ? 1 : 0.65) * dAlpha);
ctx.textAlign = 'center'; ctx.textBaseline = 'top';
ctx.fillText(dn.label, dn._sx, dn._sy + dR + 6);
if (dn._pulse > 0) {dn._pulseTime += 0.04;
var pw = dR + dn._pulseTime * 80;
var pa = dn._pulse * (1 - dn._pulseTime);
if (pa > 0) {ctx.beginPath(); ctx.arc(dn._sx, dn._sy, pw, 0, PI2);
ctx.strokeStyle = rgba(dn.color, pa * 0.5);
ctx.lineWidth = 2; ctx.stroke();}
if (dn._pulseTime > 1) { dn._pulse = 0; dn._pulseTime = 0; }}}
var clR = 28;
var clg1 = ctx.createRadialGradient(clientX, clientY, 0, clientX, clientY, clR * 4);
clg1.addColorStop(0, 'rgba(251,191,36,0.12)');
clg1.addColorStop(0.5, 'rgba(16,185,129,0.06)');
clg1.addColorStop(1, 'transparent');
ctx.beginPath(); ctx.arc(clientX, clientY, clR * 4, 0, PI2);
ctx.fillStyle = clg1; ctx.fill();
ctx.beginPath(); ctx.arc(clientX, clientY, clR, 0, PI2);
var clf = ctx.createRadialGradient(clientX-clR*0.2, clientY-clR*0.2, clR*0.1, clientX, clientY, clR);
clf.addColorStop(0, 'rgba(16,185,129,0.3)');
clf.addColorStop(1, 'rgba(16,185,129,0.1)');
ctx.fillStyle = clf; ctx.fill();
ctx.strokeStyle = 'rgba(251,191,36,' + (0.5 + 0.2 * Math.sin(t * 2)) + ')';
ctx.lineWidth = 2; ctx.stroke();
ctx.beginPath(); ctx.arc(clientX, clientY, clR + 5, 0, PI2);
ctx.strokeStyle = 'rgba(251,191,36,' + (0.15 + 0.1 * Math.sin(t * 1.5)) + ')';
ctx.lineWidth = 1; ctx.stroke();
drawNodeIcon('client', clientX, clientY, clR, 'rgba(16,185,129,0.9)');
ctx.font = '700 12px Inter,system-ui,sans-serif';
ctx.fillStyle = 'rgba(251,191,36,0.85)';
ctx.textAlign = 'center'; ctx.textBaseline = 'top';
ctx.fillText(CLIENT.label, clientX, clientY + clR + 8);
if (CLIENT._pulse > 0) {CLIENT._pulseTime += 0.04;
var cpw = clR + CLIENT._pulseTime * 100;
var cpa = CLIENT._pulse * (1 - CLIENT._pulseTime);
if (cpa > 0) {ctx.beginPath(); ctx.arc(clientX, clientY, cpw, 0, PI2);
ctx.strokeStyle = 'rgba(251,191,36,' + cpa * 0.4 + ')';
ctx.lineWidth = 2.5; ctx.stroke();}
if (CLIENT._pulseTime > 1) { CLIENT._pulse = 0; CLIENT._pulseTime = 0; }}
for (var ki = 0; ki < comets.length; ki++) {var c = comets[ki];
var baseSpd = c.dir === 'out' ? 0.005 : 0.004;
if (c.speed > baseSpd * 3) c.speed *= 0.97;
c.t += c.speed;
if (c.t > 1) {c.t = 0;
if (c.dir === 'out' && Math.random() < 0.4) { CLIENT._pulse = 0.8; CLIENT._pulseTime = 0; }}
var startX, startY, endX, endY, ctrlX, ctrlY, cColor;
if (c.dir === 'in') {var sn = NODES[c.node];
if (!sn._sx) continue;
startX = sn._sx; startY = sn._sy;
endX = hx; endY = hy;
cColor = sn.color;
ctrlX = (startX + endX) * 0.5 + (startY - endY) * 0.3;
ctrlY = (startY + endY) * 0.5 - Math.abs(startX - endX) * 0.2;} else {startX = hx; startY = hy;
endX = clientX; endY = clientY;
cColor = '#fbbf24';
ctrlX = (startX + endX) * 0.5;
ctrlY = (startY + endY) * 0.5 - 40 - Math.sin(t + ki) * 15;}
var key = 'c' + ki;
if (!cometTrails[key]) cometTrails[key] = [];
var head = bezierPoint(startX, startY, ctrlX, ctrlY, endX, endY, c.t);
cometTrails[key].unshift({ x: head.x, y: head.y });
if (cometTrails[key].length > c.tailLen) cometTrails[key].length = c.tailLen;
var cAlpha = Math.sin(c.t * Math.PI) * 0.85;
if (cAlpha < 0.05) { cometTrails[key].length = 0; continue; }
drawComet(head.x, head.y, cometTrails[key], cColor, cAlpha, c.dir === 'out');}
raf = requestAnimationFrame(draw);}
raf = requestAnimationFrame(draw);}
function initHeroTypewriter() {const el = document.getElementById('heroTypewriter');
if (!el) return;
const KEYS = ['tw_1', 'tw_2', 'tw_3', 'tw_4', 'tw_5'];
const FALLBACK = ['Ж/Д комплектующие', 'Промышленное оборудование', 'Технический консалтинг', 'Таможенное оформление', 'Официальные поставки'];
function getPhrases() {const t = window.i18n?.t;
return KEYS.map((k, i) => {const val = t ? t(k) : null;
return (val && val !== k) ? val : FALLBACK[i];});}
let pi = 0, ci = 0, dir = 1;
let phrases = getPhrases();
let tickTimer = null;
function tick() {const phrase = phrases[pi];
ci += dir;
el.textContent = phrase.substring(0, ci);
if (dir === 1 && ci === phrase.length) {tickTimer = setTimeout(() => { dir = -1; tick(); }, 2200);
return;}
if (dir === -1 && ci === 0) {pi = (pi + 1) % phrases.length;
dir = 1;
tickTimer = setTimeout(tick, 380);
return;}
tickTimer = setTimeout(tick, dir === 1 ? 68 : 32);}
tickTimer = setTimeout(tick, 1400);
document.addEventListener('langchange', () => {phrases = getPhrases();
clearTimeout(tickTimer);
pi = 0; ci = 0; dir = 1;
el.textContent = '';
tickTimer = setTimeout(tick, 400);});}
function initFAQ() {document.querySelectorAll('.faq-item').forEach(item => {const btn = item.querySelector('.faq-trigger');
const body = item.querySelector('.faq-body');
const icon = item.querySelector('.faq-icon');
if (!btn || !body) return;
btn.addEventListener('click', () => {const isOpen = !body.classList.contains('hidden');
document.querySelectorAll('.faq-item').forEach(other => {other.querySelector('.faq-body')?.classList.add('hidden');
other.querySelector('.faq-icon')?.classList.remove('rotate-45');
other.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');});
if (!isOpen) {body.classList.remove('hidden');
icon?.classList.add('rotate-45');
btn.setAttribute('aria-expanded', 'true');}});});}
function initStickyNav() {const nav = document.getElementById('mainNav');
if (!nav) return;
window.addEventListener('scroll', () => {if (window.scrollY > 20) {nav.classList.add('shadow-md', 'py-3');
nav.classList.remove('py-5');} else {nav.classList.remove('shadow-md', 'py-3');
nav.classList.add('py-5');}}, { passive: true });}
function initContactForm() {const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const statusEl = document.getElementById('formStatus');
if (!form) return;
const keyInput = document.getElementById('w3f_key');
const hasKey = keyInput && keyInput.value && keyInput.value !== 'YOUR_ACCESS_KEY_HERE';
form.addEventListener('submit', async (e) => {e.preventDefault();
const t = window.i18n?.t || (k => k);
if (submitBtn) {submitBtn.disabled = true;
submitBtn.textContent = t('form_sending') || 'Отправка…';}
if (statusEl) statusEl.className = 'hidden';
if (!hasKey) {await new Promise(r => setTimeout(r, 900));
if (statusEl) {statusEl.textContent = '⚠️ Форма не настроена. Добавьте ключ Web3Forms в index.html (см. инструкцию в main.js).';
statusEl.className = 'block text-center p-4 rounded-xl font-semibold bg-amber-50 text-amber-700 border border-amber-200 mt-4';}
if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = t('btn_send') || 'Отправить'; }
return;}
try {const formData = new FormData(form);
const name = formData.get('name') || '';
const company = formData.get('company') || '';
formData.set('subject', `Заявка RailTech: ${name}${company ? ' (' + company + ')' : ''}`);
const resp = await fetch('https://api.web3forms.com/submit', {method: 'POST',
body: formData,});
const json = await resp.json();
if (json.success) {if (statusEl) {statusEl.textContent = t('form_success') || '✓ Заявка отправлена. Мы свяжемся с вами в ближайшее время.';
statusEl.className = 'block text-center p-4 rounded-xl font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-4';}
form.reset();} else {throw new Error(json.message || 'Submission failed');}} catch (err) {console.warn('Form error:', err);
if (statusEl) {statusEl.textContent = t('form_error') || '✗ Не удалось отправить. Напишите нам на info@railtech.uz';
statusEl.className = 'block text-center p-4 rounded-xl font-semibold bg-red-50 text-red-700 border border-red-200 mt-4';}} finally {if (submitBtn) {submitBtn.disabled = false;
submitBtn.textContent = t('btn_send') || 'Отправить запрос';}}});}
function initMarquee() {const track = document.getElementById('marqueeTrack');
if (!track) return;
track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');}
function init() {initStickyNav();
initMobileMenu();
initScrollReveal();
initCounters();
initPlatformShowcase();
initFAQ();
initContactForm();
initMarquee();
initHeroCanvas();
initHeroTypewriter();}
if (document.readyState === 'loading') {document.addEventListener('DOMContentLoaded', init);} else {init();}})();