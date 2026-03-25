/* ============================================================
   FREE PDF TOOL KIT — Shared Application Logic
   app.js — loaded on every page
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Splash Screen ---------- */
  window.addEventListener('load', () => {
    const splash = document.querySelector('.splash-screen');
    if (splash) {
      setTimeout(() => splash.classList.add('hidden'), 1800);
      setTimeout(() => splash.remove(), 2400);
    }
    initApp();
  });

  function initApp() {
    initHeader();
    initMobileNav();
    initParticles();
    initScrollAnimations();
    initFAQ();
    initFAB();
    initRipple();
    initStats();
    initStreak();
    initBadges();
    initToast();
    init3DTilt();
  }

  /* ============================================================
     HEADER SCROLL EFFECT
     ============================================================ */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    const check = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ============================================================
     MOBILE NAV
     ============================================================ */
  function initMobileNav() {
    const btn = document.querySelector('.menu-btn');
    const nav = document.querySelector('.mobile-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        btn.classList.remove('active');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============================================================
     PARTICLE BACKGROUND (Canvas)
     ============================================================ */
  function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [], mouse = { x: -1000, y: -1000 };
    const PARTICLE_COUNT = window.innerWidth < 600 ? 40 : 80;
    const MAX_DIST = 120;

    function resize() {
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.r = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
        // Mouse repel
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x += dx / dist * 1.5;
          this.y += dy / dist * 1.5;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        // Alternate between forest green, sage, and amber particles
        const colors = [
          `rgba(43,122,75,${this.alpha})`,
          `rgba(61,163,101,${this.alpha})`,
          `rgba(217,119,6,${this.alpha * 0.6})`
        ];
        ctx.fillStyle = colors[Math.floor(this.x + this.y) % 3];
        ctx.fill();
      }
    }
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(43,122,75,${0.12 * (1 - dist / MAX_DIST)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ============================================================
     SCROLL ANIMATIONS (Intersection Observer)
     ============================================================ */
  function initScrollAnimations() {
    const els = document.querySelectorAll('.animate-on-scroll');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
  }

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.parentElement;
        const isActive = item.classList.contains('active');
        // Close all
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  }

  /* ============================================================
     FLOATING ACTION BUTTON
     ============================================================ */
  function initFAB() {
    const fab = document.querySelector('.fab');
    const menu = document.querySelector('.fab-menu');
    if (!fab || !menu) return;
    fab.addEventListener('click', () => {
      menu.classList.toggle('open');
      fab.querySelector('i').classList.toggle('fa-plus');
      fab.querySelector('i').classList.toggle('fa-times');
    });
    document.addEventListener('click', e => {
      if (!fab.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        const icon = fab.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-plus');
      }
    });
  }

  /* ============================================================
     BUTTON RIPPLE EFFECT
     ============================================================ */
  function initRipple() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn');
      if (!btn) return;
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  }

  /* ============================================================
     CONVERSION STATISTICS (Local Storage)
     ============================================================ */
  function initStats() {
    window.FreePDFStats = {
      data: JSON.parse(localStorage.getItem('fpdf-stats') || '{"total":0,"byTool":{}}'),
      save() { localStorage.setItem('fpdf-stats', JSON.stringify(this.data)); },
      record(tool) {
        this.data.total++;
        this.data.byTool[tool] = (this.data.byTool[tool] || 0) + 1;
        this.save();
        updateStatsUI();
        checkBadges();
      },
      getTotal() { return this.data.total; },
      getByTool(t) { return this.data.byTool[t] || 0; }
    };
    updateStatsUI();
  }
  function updateStatsUI() {
    const el = document.getElementById('stat-total');
    if (el) el.textContent = window.FreePDFStats.getTotal();
  }

  /* ============================================================
     USAGE STREAK TRACKER
     ============================================================ */
  function initStreak() {
    const today = new Date().toDateString();
    const streakData = JSON.parse(localStorage.getItem('fpdf-streak') || '{"count":0,"last":""}');
    if (streakData.last === today) {
      // already counted today
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (streakData.last === yesterday) {
        streakData.count++;
      } else {
        streakData.count = 1;
      }
      streakData.last = today;
      localStorage.setItem('fpdf-streak', JSON.stringify(streakData));
    }
    window.FreePDFStreak = streakData;
    const el = document.getElementById('stat-streak');
    if (el) el.textContent = streakData.count;
  }

  /* ============================================================
     ACHIEVEMENT BADGES
     ============================================================ */
  function initBadges() {
    window.FreePDFBadges = {
      defs: [
        { id: 'first', icon: '🌟', label: 'First Conversion', check: () => window.FreePDFStats.getTotal() >= 1 },
        { id: 'ten', icon: '🔥', label: '10 Conversions', check: () => window.FreePDFStats.getTotal() >= 10 },
        { id: 'fifty', icon: '💎', label: '50 Conversions', check: () => window.FreePDFStats.getTotal() >= 50 },
        { id: 'streak3', icon: '⚡', label: '3-Day Streak', check: () => window.FreePDFStreak.count >= 3 },
        { id: 'streak7', icon: '🏆', label: '7-Day Streak', check: () => window.FreePDFStreak.count >= 7 },
        { id: 'alltools', icon: '🛠️', label: 'Used All Tools', check: () => Object.keys(window.FreePDFStats.data.byTool).length >= 5 },
      ],
      unlocked: JSON.parse(localStorage.getItem('fpdf-badges') || '[]'),
      save() { localStorage.setItem('fpdf-badges', JSON.stringify(this.unlocked)); }
    };
    checkBadges();
    renderBadgesUI();
  }
  function checkBadges() {
    if (!window.FreePDFBadges) return;
    const b = window.FreePDFBadges;
    b.defs.forEach(d => {
      if (!b.unlocked.includes(d.id) && d.check()) {
        b.unlocked.push(d.id);
        b.save();
        showToast(`Badge Unlocked: ${d.icon} ${d.label}`, 'success');
      }
    });
    renderBadgesUI();
  }
  function renderBadgesUI() {
    const grid = document.querySelector('.badge-grid');
    if (!grid || !window.FreePDFBadges) return;
    grid.innerHTML = '';
    window.FreePDFBadges.defs.forEach(d => {
      const el = document.createElement('div');
      el.className = 'badge-item ' + (window.FreePDFBadges.unlocked.includes(d.id) ? 'unlocked' : 'locked');
      el.title = d.label;
      el.textContent = d.icon;
      grid.appendChild(el);
    });
  }

  /* ============================================================
     DOWNLOAD HISTORY (Local Storage)
     ============================================================ */
  window.FreePDFHistory = {
    data: JSON.parse(localStorage.getItem('fpdf-history') || '[]'),
    save() { localStorage.setItem('fpdf-history', JSON.stringify(this.data)); },
    add(name, tool, size) {
      this.data.unshift({ name, tool, size, date: new Date().toISOString() });
      if (this.data.length > 50) this.data.pop();
      this.save();
      this.renderUI();
    },
    renderUI() {
      const list = document.querySelector('.history-list');
      if (!list) return;
      if (!this.data.length) {
        list.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:24px;">No downloads yet.</p>';
        return;
      }
      list.innerHTML = this.data.slice(0, 20).map(h => `
        <div class="history-item">
          <div class="history-item-icon"><i class="fas fa-file-pdf"></i></div>
          <div class="history-item-info">
            <div class="history-item-name">${escapeHTML(h.name)}</div>
            <div class="history-item-meta">${h.tool} · ${formatBytes(h.size)} · ${timeAgo(h.date)}</div>
          </div>
        </div>`).join('');
    }
  };

  /* ============================================================
     TOAST SYSTEM
     ============================================================ */
  function initToast() {
    if (!document.querySelector('.toast-container')) {
      const c = document.createElement('div');
      c.className = 'toast-container';
      document.body.appendChild(c);
    }
  }
  window.showToast = function (msg, type = 'info') {
    const container = document.querySelector('.toast-container');
    if (!container) return;
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    t.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${msg}</span>`;
    container.appendChild(t);
    setTimeout(() => { t.classList.add('removing'); setTimeout(() => t.remove(), 300); }, 3500);
  };

  /* ============================================================
     SHARE FUNCTIONALITY
     ============================================================ */
  window.shareTool = function (title, url) {
    if (navigator.share) {
      navigator.share({ title, text: `Check out ${title} on Free PDF Flash!`, url });
    } else {
      navigator.clipboard.writeText(url || window.location.href).then(() => {
        showToast('Link copied to clipboard!', 'success');
      });
    }
  };

  /* ============================================================
     COMMON DRAG & DROP HANDLER
     ============================================================ */
  window.initDropZone = function (zone, fileInput, onFiles) {
    if (!zone) return;
    ['dragenter', 'dragover'].forEach(e => zone.addEventListener(e, ev => { ev.preventDefault(); zone.classList.add('drag-over'); }));
    ['dragleave', 'drop'].forEach(e => zone.addEventListener(e, ev => { ev.preventDefault(); zone.classList.remove('drag-over'); }));
    zone.addEventListener('drop', e => { if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files); });
    zone.addEventListener('click', () => fileInput && fileInput.click());
    if (fileInput) fileInput.addEventListener('change', () => { if (fileInput.files.length) onFiles(fileInput.files); });
  };

  /* ============================================================
     FILE REORDER (Sortable via Drag)
     ============================================================ */
  window.initSortable = function (container) {
    if (!container) return;
    let dragged = null;
    container.addEventListener('dragstart', e => {
      dragged = e.target.closest('.file-item');
      if (dragged) { dragged.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; }
    });
    container.addEventListener('dragover', e => {
      e.preventDefault();
      const target = e.target.closest('.file-item');
      if (target && target !== dragged) {
        const rect = target.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        if (e.clientY < mid) container.insertBefore(dragged, target);
        else container.insertBefore(dragged, target.nextSibling);
      }
    });
    container.addEventListener('dragend', () => { if (dragged) dragged.classList.remove('dragging'); dragged = null; });
  };

  /* ============================================================
     UTILITY HELPERS
     ============================================================ */
  window.escapeHTML = function (str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  };
  window.formatBytes = function (bytes) {
    if (!bytes) return '0 B';
    const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };
  window.timeAgo = function (date) {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    return Math.floor(s / 86400) + 'd ago';
  };
  window.downloadBlob = function (blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 100);
    window.FreePDFHistory.add(name, name.split('.').pop().toUpperCase(), blob.size);
  };

  /* ============================================================
     3D TILT EFFECT ON TOOL CARDS
     ============================================================ */
  function init3DTilt() {
    const cards = document.querySelectorAll('.tool-card');
    cards.forEach(card => {
      // Create glow element
      const glow = document.createElement('div');
      glow.className = 'card-glow';
      card.appendChild(glow);

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        // Move glow
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ============================================================
     SERVICE WORKER REGISTRATION
     ============================================================ */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => { });
  }
})();
