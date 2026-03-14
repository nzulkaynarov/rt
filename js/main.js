/**
 * RailTech Landing — main interactions
 * Covers: mobile menu, scroll reveal, stat counters, platform showcase,
 *         FAQ accordion, contact form.
 */
(function () {
    'use strict';

    /* ═══════════════════════════════════════════════
       1. MOBILE MENU
    ═══════════════════════════════════════════════ */
    function initMobileMenu() {
        const btn = document.getElementById('menuToggle');
        const overlay = document.getElementById('mobileMenu');
        const closeBtn = document.getElementById('menuClose');
        if (!btn || !overlay) return;

        function open() {
            overlay.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
            overlay.classList.add('opacity-100', 'translate-y-0');
            document.body.style.overflow = 'hidden';
            btn.setAttribute('aria-expanded', 'true');
        }
        function close() {
            overlay.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
            overlay.classList.remove('opacity-100', 'translate-y-0');
            document.body.style.overflow = '';
            btn.setAttribute('aria-expanded', 'false');
        }

        btn.addEventListener('click', open);
        if (closeBtn) closeBtn.addEventListener('click', close);

        // Close on nav link click
        overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

        // Escape key
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    }

    /* ═══════════════════════════════════════════════
       2. SCROLL REVEAL (Intersection Observer)
    ═══════════════════════════════════════════════ */
    function initScrollReveal() {
        const els = document.querySelectorAll('[data-reveal]');
        if (!els.length) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const delay = el.dataset.revealDelay || '0';
                setTimeout(() => {
                    el.classList.remove('opacity-0', 'translate-y-8', 'translate-x-8', '-translate-x-8', 'scale-95');
                    el.classList.add('opacity-100', 'translate-y-0', 'translate-x-0', 'scale-100');
                }, parseInt(delay));
                obs.unobserve(el);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        els.forEach(el => {
            el.classList.add('transition-all', 'duration-700', 'ease-out');
            obs.observe(el);
        });
    }

    /* ═══════════════════════════════════════════════
       3. STAT COUNTERS
    ═══════════════════════════════════════════════ */
    function animateCounter(el, target, suffix = '', duration = 1800) {
        let start = null;
        const startVal = 0;

        function step(ts) {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startVal + (target - startVal) * eased);
            el.textContent = current.toLocaleString('ru') + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function initCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        if (!counters.length) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.counter, 10);
                const suffix = el.dataset.counterSuffix || '';
                animateCounter(el, target, suffix);
                obs.unobserve(el);
            });
        }, { threshold: 0.5 });

        counters.forEach(el => obs.observe(el));
    }

    /* ═══════════════════════════════════════════════
       4. PLATFORM SHOWCASE — Tab-based with autoplay
    ═══════════════════════════════════════════════ */
    function initPlatformShowcase() {
        const slides = document.querySelectorAll('.platform-slide');
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

        // ── Progress bar ─────────────────────────────
        function startProgress() {
            if (!progressEl) return;
            if (progressRaf) cancelAnimationFrame(progressRaf);
            progressEl.style.transition = 'none';
            progressEl.style.width = '0%';
            progressStart = null;
            function animateProgress(ts) {
                if (!progressStart) progressStart = ts;
                const pct = Math.min(((ts - progressStart) / AUTOPLAY_DELAY) * 100, 100);
                progressEl.style.width = pct + '%';
                if (pct < 100) progressRaf = requestAnimationFrame(animateProgress);
            }
            progressRaf = requestAnimationFrame(animateProgress);
        }
        function stopProgress() {
            if (progressRaf) { cancelAnimationFrame(progressRaf); progressRaf = null; }
            if (progressEl) { progressEl.style.transition = 'none'; progressEl.style.width = '0%'; }
        }

        function goToSlide(idx) {
            if (idx === currentSlide) return;
            currentSlide = idx;

            slides.forEach((slide, i) => {
                if (i === idx) {
                    slide.classList.remove('opacity-0', 'translate-x-8');
                    slide.classList.add('opacity-100', 'translate-x-0');
                    slide.removeAttribute('aria-hidden');
                } else {
                    slide.classList.add('opacity-0', 'translate-x-8');
                    slide.classList.remove('opacity-100', 'translate-x-0');
                    slide.setAttribute('aria-hidden', 'true');
                }
            });

            // Side dots (if present)
            dots.forEach((dot, i) => {
                dot.classList.toggle('bg-blue-500', i === idx);
                dot.classList.toggle('scale-125', i === idx);
                dot.classList.toggle('bg-white/30', i !== idx);
                dot.classList.toggle('scale-100', i !== idx);
            });

            // Horizontal tab buttons (if present)
            tabs.forEach((tab, i) => {
                if (i === idx) {
                    tab.classList.add('text-white', 'border-blue-500', 'bg-blue-500/10');
                    tab.classList.remove('text-slate-500', 'border-transparent', 'hover:text-slate-300');
                    tab.setAttribute('aria-selected', 'true');
                } else {
                    tab.classList.remove('text-white', 'border-blue-500', 'bg-blue-500/10');
                    tab.classList.add('text-slate-500', 'border-transparent', 'hover:text-slate-300');
                    tab.setAttribute('aria-selected', 'false');
                }
            });
        }

        function startAutoplay() {
            clearInterval(autoplayTimer);
            startProgress();
            autoplayTimer = setInterval(() => {
                goToSlide((currentSlide + 1) % SLIDE_COUNT);
                startProgress();
            }, AUTOPLAY_DELAY);
        }

        // Dot click navigation
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                goToSlide(i);
                startAutoplay(); // reset timer
            });
        });

        // Tab click navigation
        tabs.forEach((tab, i) => {
            tab.addEventListener('click', () => {
                goToSlide(i);
                startAutoplay(); // reset timer
            });
        });

        // Pause on hover / resume on leave
        const showcaseEl = document.getElementById('platform');
        if (showcaseEl) {
            showcaseEl.addEventListener('mouseenter', () => {
                clearInterval(autoplayTimer);
                stopProgress();
            });
            showcaseEl.addEventListener('mouseleave', startAutoplay);
        }

        goToSlide(0);
        startAutoplay();
    }

    /* ═══════════════════════════════════════════════
       5. HERO CANVAS — live supply-chain network
    ═══════════════════════════════════════════════ */
    function initHeroCanvas() {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas || !canvas.getContext) return;
        const ctx = canvas.getContext('2d');
        let W = 0, H = 0, raf = null;
        let mouseNX = 0.5, mouseNY = 0.5;

        const parent = canvas.parentElement;
        function resize() {
            const r = parent.getBoundingClientRect();
            W = canvas.width = r.width || 480;
            H = canvas.height = r.height || 460;
        }
        resize();
        window.addEventListener('resize', resize, { passive: true });
        parent.addEventListener('mousemove', e => {
            const r = canvas.getBoundingClientRect();
            mouseNX = (e.clientX - r.left) / r.width;
            mouseNY = (e.clientY - r.top) / r.height;
        });

        // ─── Node definitions (rx/ry = fractional 0–1 of canvas size) ───
        const NODES = [
            { id: 'factory',   label: 'Производство', rx: 0.10, ry: 0.28, r: 22, color: '#3b82f6', phase: 0.0 },
            { id: 'import',    label: 'Импорт',        rx: 0.40, ry: 0.15, r: 15, color: '#8b5cf6', phase: 2.1 },
            { id: 'hub',       label: 'RailTech',      rx: 0.50, ry: 0.50, r: 30, color: '#2563eb', phase: 1.0, hub: true },
            { id: 'customs',   label: 'Таможня',       rx: 0.80, ry: 0.24, r: 15, color: '#f59e0b', phase: 3.2 },
            { id: 'client',    label: 'Клиент',        rx: 0.88, ry: 0.66, r: 22, color: '#10b981', phase: 4.1 },
            { id: 'docs',      label: 'КП / Docs',     rx: 0.18, ry: 0.76, r: 14, color: '#06b6d4', phase: 5.5 },
            { id: 'logistics', label: 'Логистика',     rx: 0.66, ry: 0.82, r: 14, color: '#6366f1', phase: 6.3 },
        ];
        const EDGES = [
            ['factory','hub'], ['factory','import'], ['import','hub'],
            ['hub','customs'], ['hub','client'], ['hub','docs'],
            ['hub','logistics'], ['customs','client'], ['logistics','client'],
        ];
        const packets = EDGES.map((edge, i) => ({
            edge, t: i / EDGES.length, speed: 0.003 + (i % 3) * 0.0008
        }));

        // ─── Helpers ───
        function hex2rgb(h) {
            return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
        }
        function rgba(h, a) {
            const [r,g,b] = hex2rgb(h);
            return `rgba(${r},${g},${b},${a})`;
        }
        function nodePos(def, t) {
            const bob = Math.sin(t * 0.7 + def.phase) * H * 0.016;
            const px  = (mouseNX - 0.5) * (def.hub ? 4 : 16);
            const py  = (mouseNY - 0.5) * (def.hub ? 4 : 12);
            return { x: def.rx * W + px, y: def.ry * H + bob + py };
        }
        function roundRect(ctx, x, y, w, h, r) {
            ctx.beginPath();
            ctx.moveTo(x+r, y);
            ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r);
            ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
            ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+h-r);
            ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y);
            ctx.closePath();
        }

        // ─── Node icons (minimal line-art drawn on canvas) ───
        function drawIcon(id, x, y, r, col) {
            const s = r * 0.42;
            ctx.save();
            ctx.translate(x, y);
            ctx.strokeStyle = col; ctx.fillStyle = col;
            ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            switch (id) {
                case 'hub':
                    ctx.font = `bold ${r*0.6}px Inter,Arial,sans-serif`;
                    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillText('RT', 0, 1); break;
                case 'factory':
                    ctx.beginPath();
                    ctx.rect(-s, -s*0.5, s*2, s*1.3);
                    ctx.stroke();
                    ctx.fillRect(-s*0.25, s*0.1, s*0.5, s*0.7);
                    // Chimney
                    ctx.beginPath(); ctx.rect(-s*0.65, -s*1.1, s*0.35, s*0.65); ctx.stroke();
                    break;
                case 'import':
                    ctx.beginPath();
                    ctx.rect(-s*0.9, -s*0.9, s*1.8, s*1.8); ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(0, s*0.5); ctx.lineTo(0, -s*0.3);
                    ctx.moveTo(-s*0.4, -s*0.0); ctx.lineTo(0, -s*0.45); ctx.lineTo(s*0.4, -s*0.0);
                    ctx.stroke(); break;
                case 'customs':
                    ctx.beginPath(); ctx.arc(0, 0, s*0.9, 0, Math.PI*2); ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(-s*0.45, 0); ctx.lineTo(-s*0.1, s*0.38); ctx.lineTo(s*0.52, -s*0.38);
                    ctx.stroke(); break;
                case 'client':
                    ctx.beginPath(); ctx.arc(0, -s*0.35, s*0.38, 0, Math.PI*2); ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(-s*0.7, s*0.65);
                    ctx.bezierCurveTo(-s*0.7, s*0.1, s*0.7, s*0.1, s*0.7, s*0.65);
                    ctx.stroke(); break;
                case 'docs':
                    ctx.beginPath();
                    ctx.moveTo(-s*0.55, -s); ctx.lineTo(s*0.25, -s);
                    ctx.lineTo(s*0.75, -s*0.35); ctx.lineTo(s*0.75, s);
                    ctx.lineTo(-s*0.55, s); ctx.closePath(); ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(-s*0.25, -s*0.15); ctx.lineTo(s*0.3, -s*0.15);
                    ctx.moveTo(-s*0.25, s*0.15); ctx.lineTo(s*0.3, s*0.15);
                    ctx.moveTo(-s*0.25, s*0.45); ctx.lineTo(s*0.1, s*0.45);
                    ctx.stroke(); break;
                case 'logistics':
                    ctx.beginPath();
                    ctx.rect(-s*0.85, -s*0.45, s*1.1, s*0.85); ctx.stroke();
                    ctx.beginPath();
                    ctx.rect(s*0.18, -s*0.35, s*0.67, s*0.75); ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(-s*0.35, s*0.55, s*0.22, 0, Math.PI*2);
                    ctx.arc(s*0.62, s*0.55, s*0.22, 0, Math.PI*2);
                    ctx.stroke(); break;
            }
            ctx.restore();
        }

        // ─── Main draw loop ───
        function draw(ts) {
            const t = ts * 0.001;
            ctx.clearRect(0, 0, W, H);

            // Background hex grid
            ctx.save();
            ctx.strokeStyle = 'rgba(148,163,184,0.055)';
            ctx.lineWidth = 1;
            const R = 26;
            const dx = R * Math.sqrt(3), dy = R * 1.5;
            for (let row = -1; row * dy < H + dy * 2; row++) {
                for (let col = -1; col * dx < W + dx * 2; col++) {
                    const cx = col * dx + (row % 2 === 0 ? 0 : dx * 0.5);
                    const cy = row * dy;
                    ctx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const a = (Math.PI / 3) * i - Math.PI / 6;
                        const px = cx + (R - 1) * Math.cos(a);
                        const py = cy + (R - 1) * Math.sin(a);
                        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                    }
                    ctx.closePath(); ctx.stroke();
                }
            }
            ctx.restore();

            // Compute all positions
            const nmap = {};
            NODES.forEach(d => { nmap[d.id] = { ...d, ...nodePos(d, t) }; });

            // Edges — animated dashed lines
            EDGES.forEach(([aid, bid]) => {
                const a = nmap[aid], b = nmap[bid];
                const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
                g.addColorStop(0, rgba(a.color, 0.38));
                g.addColorStop(1, rgba(b.color, 0.38));
                ctx.save();
                ctx.setLineDash([5, 9]);
                ctx.lineDashOffset = -(t * 24) % 14;
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = g; ctx.lineWidth = 1.3; ctx.stroke();
                ctx.restore();
            });

            // Data packets — glowing dots traveling on edges
            packets.forEach(p => {
                const [aid, bid] = p.edge;
                const a = nmap[aid], b = nmap[bid];
                const px = a.x + (b.x - a.x) * p.t;
                const py = a.y + (b.y - a.y) * p.t;
                const g = ctx.createRadialGradient(px, py, 0, px, py, 11);
                g.addColorStop(0, rgba(a.color, 0.9));
                g.addColorStop(0.4, rgba(a.color, 0.4));
                g.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(px, py, 11, 0, Math.PI*2);
                ctx.fillStyle = g; ctx.fill();
                ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI*2);
                ctx.fillStyle = '#fff'; ctx.fill();
                p.t += p.speed;
                if (p.t > 1.05) p.t = 0;
            });

            // Hub pulse rings
            const hub = nmap['hub'];
            for (let i = 0; i < 3; i++) {
                const scale = 1.3 + i * 0.55 + Math.sin(t * 1.8 + i * 1.4) * 0.1;
                ctx.beginPath();
                ctx.arc(hub.x, hub.y, hub.r * scale, 0, Math.PI*2);
                ctx.strokeStyle = rgba(hub.color, 0.18 - i * 0.05);
                ctx.lineWidth = 1.3; ctx.stroke();
            }

            // Nodes
            NODES.forEach(d => {
                const n = nmap[d.id];
                // Glow halo
                const g = ctx.createRadialGradient(n.x, n.y, n.r * 0.4, n.x, n.y, n.r * 3);
                g.addColorStop(0, rgba(d.color, d.hub ? 0.28 : 0.12));
                g.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI*2);
                ctx.fillStyle = g; ctx.fill();
                // Circle
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
                ctx.fillStyle = d.hub ? rgba(d.color, 0.92) : rgba(d.color, 0.10);
                ctx.strokeStyle = rgba(d.color, 0.85);
                ctx.lineWidth = d.hub ? 2.5 : 1.8;
                ctx.fill(); ctx.stroke();
                // Icon
                drawIcon(d.id, n.x, n.y, n.r, d.hub ? '#fff' : d.color);
                // Label
                ctx.font = `${d.hub ? '600 ' : ''}9.5px Inter,Arial,sans-serif`;
                ctx.fillStyle = d.hub ? 'rgba(255,255,255,0.9)' : 'rgba(148,163,184,0.85)';
                ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
                ctx.fillText(d.label, n.x, n.y + n.r + 14);
            });

            raf = requestAnimationFrame(draw);
        }
        raf = requestAnimationFrame(draw);
    }

    /* ═══════════════════════════════════════════════
       5b. HERO TYPEWRITER — cycling categories (i18n-aware)
    ═══════════════════════════════════════════════ */
    function initHeroTypewriter() {
        const el = document.getElementById('heroTypewriter');
        if (!el) return;

        const KEYS = ['tw_1', 'tw_2', 'tw_3', 'tw_4', 'tw_5'];
        const FALLBACK = ['Ж/Д комплектующие', 'Промышленное оборудование', 'Технический консалтинг', 'Таможенное оформление', 'Официальные поставки'];

        function getPhrases() {
            const t = window.i18n?.t;
            return KEYS.map((k, i) => {
                const val = t ? t(k) : null;
                return (val && val !== k) ? val : FALLBACK[i];
            });
        }

        let pi = 0, ci = 0, dir = 1;
        let phrases = getPhrases();
        let tickTimer = null;

        function tick() {
            const phrase = phrases[pi];
            ci += dir;
            el.textContent = phrase.substring(0, ci);
            if (dir === 1 && ci === phrase.length) {
                tickTimer = setTimeout(() => { dir = -1; tick(); }, 2200);
                return;
            }
            if (dir === -1 && ci === 0) {
                pi = (pi + 1) % phrases.length;
                dir = 1;
                tickTimer = setTimeout(tick, 380);
                return;
            }
            tickTimer = setTimeout(tick, dir === 1 ? 68 : 32);
        }

        tickTimer = setTimeout(tick, 1400);

        // Re-init phrases on language change
        document.addEventListener('langchange', () => {
            phrases = getPhrases();
            clearTimeout(tickTimer);
            pi = 0; ci = 0; dir = 1;
            el.textContent = '';
            tickTimer = setTimeout(tick, 400);
        });
    }

    /* ═══════════════════════════════════════════════
       6. FAQ ACCORDION
    ═══════════════════════════════════════════════ */
    function initFAQ() {
        document.querySelectorAll('.faq-item').forEach(item => {
            const btn = item.querySelector('.faq-trigger');
            const body = item.querySelector('.faq-body');
            const icon = item.querySelector('.faq-icon');
            if (!btn || !body) return;

            btn.addEventListener('click', () => {
                const isOpen = !body.classList.contains('hidden');

                // Close all
                document.querySelectorAll('.faq-item').forEach(other => {
                    other.querySelector('.faq-body')?.classList.add('hidden');
                    other.querySelector('.faq-icon')?.classList.remove('rotate-45');
                    other.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
                });

                if (!isOpen) {
                    body.classList.remove('hidden');
                    icon?.classList.add('rotate-45');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    /* ═══════════════════════════════════════════════
       6. STICKY NAV — shrink on scroll
    ═══════════════════════════════════════════════ */
    function initStickyNav() {
        const nav = document.getElementById('mainNav');
        if (!nav) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                nav.classList.add('shadow-md', 'py-3');
                nav.classList.remove('py-5');
            } else {
                nav.classList.remove('shadow-md', 'py-3');
                nav.classList.add('py-5');
            }
        }, { passive: true });
    }

    /* ═══════════════════════════════════════════════
       7. CONTACT FORM — Web3Forms (static-site safe)
       ───────────────────────────────────────────────
       Setup (one-time, 2 minutes):
       1. Go to https://web3forms.com  → "Create Access Key" (free, no card)
       2. Copy your access key
       3. In index.html, replace YOUR_ACCESS_KEY_HERE in the hidden input
       4. Done — all submissions are emailed to the address you registered with
    ═══════════════════════════════════════════════ */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const statusEl = document.getElementById('formStatus');
        if (!form) return;

        // Check if the key is still the placeholder (warn in console)
        const keyInput = document.getElementById('w3f_key');
        const hasKey = keyInput && keyInput.value && keyInput.value !== 'YOUR_ACCESS_KEY_HERE';

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const t = window.i18n?.t || (k => k);

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = t('form_sending') || 'Отправка…';
            }
            if (statusEl) statusEl.className = 'hidden';

            // If no key configured, show a demo message
            if (!hasKey) {
                await new Promise(r => setTimeout(r, 900));
                if (statusEl) {
                    statusEl.textContent = '⚠️ Форма не настроена. Добавьте ключ Web3Forms в index.html (см. инструкцию в main.js).';
                    statusEl.className = 'block text-center p-4 rounded-xl font-semibold bg-amber-50 text-amber-700 border border-amber-200 mt-4';
                }
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = t('btn_send') || 'Отправить'; }
                return;
            }

            try {
                // Web3Forms expects FormData (handles file uploads too)
                const formData = new FormData(form);

                // Enrich subject with submitter details
                const name = formData.get('name') || '';
                const company = formData.get('company') || '';
                formData.set('subject', `Заявка RailTech: ${name}${company ? ' (' + company + ')' : ''}`);

                const resp = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData,
                });
                const json = await resp.json();

                if (json.success) {
                    if (statusEl) {
                        statusEl.textContent = t('form_success') || '✓ Заявка отправлена. Мы свяжемся с вами в ближайшее время.';
                        statusEl.className = 'block text-center p-4 rounded-xl font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-4';
                    }
                    form.reset();
                } else {
                    throw new Error(json.message || 'Submission failed');
                }
            } catch (err) {
                console.warn('Form error:', err);
                if (statusEl) {
                    statusEl.textContent = t('form_error') || '✗ Не удалось отправить. Напишите нам на info@railtech.uz';
                    statusEl.className = 'block text-center p-4 rounded-xl font-semibold bg-red-50 text-red-700 border border-red-200 mt-4';
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = t('btn_send') || 'Отправить запрос';
                }
            }
        });
    }

    /* ═══════════════════════════════════════════════
       8. PARTNERS MARQUEE — pause on hover
    ═══════════════════════════════════════════════ */
    function initMarquee() {
        const track = document.getElementById('marqueeTrack');
        if (!track) return;
        track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
        track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
    }

    /* ═══════════════════════════════════════════════
       INIT ALL
    ═══════════════════════════════════════════════ */
    function init() {
        initStickyNav();
        initMobileMenu();
        initScrollReveal();
        initCounters();
        initPlatformShowcase();
        initFAQ();
        initContactForm();
        initMarquee();
        initHeroCanvas();
        initHeroTypewriter();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
