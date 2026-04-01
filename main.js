(function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars   = '01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEF0123456789<>{}[]//\\';
    const fontSize = 13;
    const cols    = Math.floor(canvas.width / fontSize);
    const drops   = Array(cols).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(6, 10, 15, 0.06)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff9c';
        ctx.font      = fontSize + 'px "Fira Code", monospace';
        drops.forEach((y, i) => {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * fontSize, y * fontSize);
            if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }

    let matrixInterval = setInterval(draw, 50);

    // Pause rendering when tab is hidden — saves CPU & battery
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(matrixInterval);
        } else {
            matrixInterval = setInterval(draw, 50);
        }
    });

    window.addEventListener('resize', () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        drops.length  = Math.floor(canvas.width / fontSize);
        drops.fill(1);
    });
})();

(function initCursor() {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let raf;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function animate() {
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';

        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        raf = requestAnimationFrame(animate);
    }
    animate();

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.style.width  = '44px';
            ring.style.height = '44px';
            ring.style.opacity = '0.8';
        });
        el.addEventListener('mouseleave', () => {
            ring.style.width  = '28px';
            ring.style.height = '28px';
            ring.style.opacity = '0.5';
        });
    });
})();

(function initNav() {
    const navbar       = document.getElementById('navbar');
    const burger       = document.getElementById('burger');
    const navList      = document.getElementById('nav-links');
    const progressBar  = document.getElementById('nav-progress');
    const progressFill = document.getElementById('nav-progress-fill');
    if (!navbar) return;

    const navSections = ['about', 'projects', 'skills', 'certs', 'contact'];

    function positionTrack() {
        const aboutLink   = document.querySelector('.nav-links a[href="#about"]');
        const contactLink = document.querySelector('.nav-links a[href="#contact"]');
        if (!aboutLink || !contactLink || !progressBar) return;

        const navRect     = navbar.getBoundingClientRect();
        const aboutRect   = aboutLink.getBoundingClientRect();
        const contactRect = contactLink.getBoundingClientRect();

        const left  = (aboutRect.left + aboutRect.width / 2) - navRect.left - 70;
        const right = (contactRect.left + contactRect.width / 2) - navRect.left + 30;

        progressBar.style.setProperty('--progress-left',  left + 'px');
        progressBar.style.setProperty('--progress-width', (right - left) + 'px');
    }

    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 20);

        // Active nav link highlight
        const trigger = window.scrollY + window.innerHeight * 0.45;
        navSections.forEach(id => {
            const sec  = document.getElementById(id);
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (!sec || !link) return;
            const inView = trigger >= sec.offsetTop && trigger < sec.offsetTop + sec.offsetHeight;
            link.classList.toggle('active', inView);
        });

        if (progressFill) {
            const sections = navSections.map(id => document.getElementById(id)).filter(Boolean);
            if (sections.length < 2) return;

            const firstSec = sections[0];
            const lastSec  = sections[sections.length - 1];

            const triggerOffset = window.innerHeight * 0.5;
            const start = firstSec.offsetTop - triggerOffset;
            const end   = lastSec.offsetTop  - triggerOffset;

            const pct = Math.min(Math.max((window.scrollY - start) / (end - start), 0), 1) * 100;
            progressFill.style.width = pct.toFixed(2) + '%';
        }
    }

    positionTrack();
    window.addEventListener('resize', positionTrack);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (burger && navList) {
        burger.addEventListener('click', () => navList.classList.toggle('open'));
        navList.querySelectorAll('a').forEach(a =>
            a.addEventListener('click', () => navList.classList.remove('open'))
        );
    }
})();

(function initTypedCmd() {
    const el = document.getElementById('typed-cmd');
    if (!el) return;
    const text = './run_portfolio.sh';
    let i = 0;
    setTimeout(() => {
        const t = setInterval(() => {
            el.textContent += text[i++];
            if (i >= text.length) clearInterval(t);
        }, 70);
    }, 300);
})();

(function initRoles() {
    const el = document.getElementById('role-text');
    if (!el) return;

    const roles = [
        'Offensive Security Learner',
        'Penetration Tester (in training)',
        'Full-Stack Developer',
        'ML Pipeline Builder',
        'Freelance Developer',
    ];
    let ri = 0, ci = 0, deleting = false;

    function type() {
        const cur = roles[ri];
        el.textContent = deleting ? cur.substring(0, ci--) : cur.substring(0, ci++);

        let speed = deleting ? 40 : 80;

        if (!deleting && ci > cur.length) {
            deleting = true;
            speed = 1800;
        } else if (deleting && ci < 0) {
            deleting = false;
            ri = (ri + 1) % roles.length;
            speed = 400;
        }
        setTimeout(type, speed);
    }
    setTimeout(type, 1200);
})();

(function initPing() {
    const el = document.querySelector('.ping-time');
    if (!el) return;
    setInterval(() => {
        el.textContent = (Math.random() * 15 + 1).toFixed(3);
    }, 2000);
    el.textContent = (Math.random() * 15 + 1).toFixed(3);
})();

document.querySelectorAll('.carousel-container').forEach(container => {
    const cards   = container.querySelectorAll('.card');
    const nextBtn = container.querySelector('.nextBtn');
    const prevBtn = container.querySelector('.prevBtn');
    if (!cards.length || !nextBtn || !prevBtn) return;

    let index = 0;

    function updateCarousel() {
        cards.forEach((card, i) => {
            card.className = 'card';
            const len = cards.length;
            if (i === index)                          card.classList.add('active');
            else if (i === (index - 1 + len) % len)  card.classList.add('prev');
            else if (i === (index + 1) % len)         card.classList.add('next');
            else if (i < index)                        card.classList.add('hidden-left');
            else                                       card.classList.add('hidden-right');
        });
    }

    nextBtn.addEventListener('click', () => { index = (index + 1) % cards.length; updateCarousel(); });
    prevBtn.addEventListener('click', () => { index = (index - 1 + cards.length) % cards.length; updateCarousel(); });

    let startX = 0;
    container.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    container.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (dx < -40)      { index = (index + 1) % cards.length; updateCarousel(); }
        else if (dx > 40)  { index = (index - 1 + cards.length) % cards.length; updateCarousel(); }
    });

    updateCarousel();
});

(function initReveal() {
    const targets = document.querySelectorAll(
        '.project-card, .terminal, .skills-wrapper, .contact-wrapper, .contact-footer, .section-header, .flip-card, .contact-form-section'
    );
    targets.forEach(el => el.classList.add('reveal'));

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(el => obs.observe(el));
})();

(function initSkillBars() {
    const bars = document.querySelectorAll('.sb-fill');
    if (!bars.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const pct = e.target.dataset.pct || '0';
                e.target.style.width = pct + '%';
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(b => obs.observe(b));
})();

(function initGlitchHover() {
    document.querySelectorAll('.project-text h3').forEach(el => {
        el.setAttribute('data-text', el.textContent);
        el.style.position = 'relative';

        el.addEventListener('mouseenter', () => el.classList.add('glitch'));
        el.addEventListener('mouseleave', () => el.classList.remove('glitch'));
    });
})();

(function initHexTooltips() {
    const tooltip = document.getElementById('hex-tooltip');
    const label   = document.getElementById('ht-label');
    const desc    = document.getElementById('ht-desc');
    if (!tooltip) return;

    const hexData = {
        h1: { label: 'TCP/IP',  desc: 'Transport & Internet layer protocols — how packets travel across networks.' },
        h2: { label: 'XSS',     desc: 'Cross-Site Scripting — injecting client-side scripts into trusted web pages.' },
        h3: { label: 'SQLi',    desc: 'SQL Injection — manipulating database queries via unsanitised user input.' },
        h4: { label: 'RECON',   desc: 'Reconnaissance — passive and active information gathering before an attack.' },
        h5: { label: 'ENUM',    desc: 'Enumeration — extracting usernames, shares and services from a live target.' },
        h6: { label: 'CVE',     desc: 'Common Vulnerabilities & Exposures — public registry of known security flaws.' },
    };

    let activeHex = null;

    document.querySelectorAll('.hex-item[data-hex]').forEach(hex => {
        const key  = hex.dataset.hex;
        const data = hexData[key];
        if (!data) return;

        function showTip(e) {
            label.textContent = data.label;
            desc.textContent  = data.desc;

            const vw = window.innerWidth;
            const th = tooltip.offsetHeight || 80;
            let x = e.clientX + 14;
            let y = e.clientY - th / 2;

            if (x + 260 > vw) x = e.clientX - 260;
            if (y < 8) y = 8;

            tooltip.style.left = x + 'px';
            tooltip.style.top  = y + 'px';
            tooltip.classList.add('show');
            hex.classList.add('active-hex');
            activeHex = hex;
        }

        function hideTip() {
            tooltip.classList.remove('show');
            hex.classList.remove('active-hex');
            activeHex = null;
        }

        hex.addEventListener('mouseenter', showTip);
        hex.addEventListener('mousemove',  showTip);
        hex.addEventListener('mouseleave', hideTip);
    });
})();

(function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

(function initContactForm() {
    const FORMSPREE_ID = 'xgopabng';

    const form    = document.getElementById('contact-form');
    const success = document.getElementById('form-success');
    const errEl   = document.getElementById('form-error');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name    = document.getElementById('f-name').value.trim();
        const email   = document.getElementById('f-email').value.trim();
        const msg     = document.getElementById('f-msg').value.trim();
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name)                { errEl.textContent = '// ERROR: NAME field is empty';     return; }
        if (!emailRe.test(email)) { errEl.textContent = '// ERROR: invalid EMAIL address';   return; }
        if (!msg)                 { errEl.textContent = '// ERROR: MESSAGE cannot be empty'; return; }

        errEl.textContent = '';

        const btn = form.querySelector('.form-send-btn');
        btn.textContent = '$ transmitting...';
        btn.disabled    = true;

        try {
            const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ name, email, message: msg }),
            });

            if (res.ok) {
                document.getElementById('form-view').style.display = 'none';
                success.style.display = 'block';
            } else {
                const data = await res.json().catch(() => ({}));
                const hint = data.error || 'server rejected the request';
                errEl.textContent = `// ERROR: ${hint}`;
                btn.textContent   = '$ send --message';
                btn.disabled      = false;
            }
        } catch {
            errEl.textContent = '// ERROR: network failure — check your connection';
            btn.textContent   = '$ send --message';
            btn.disabled      = false;
        }
    });
})();
