/* ==========================================================
   GIMNASIO IRONHOUSE — Interactividad (100% propia)
   Menú móvil · Header sticky · Reveal on scroll · Smooth
   scroll · Contadores · Enlace activo · Año actual
   ========================================================== */

(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');

  /* ---------- Header sticky ---------- */
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle('is-sticky', window.scrollY > 10);
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Menú móvil ---------- */
  function closeMenu() {
    if (!siteNav || !navToggle) return;
    siteNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var open = siteNav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  /* ---------- Smooth scroll (anclas) ---------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var targetId = link.getAttribute('href');
    if (targetId === '#') return;

    var target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    closeMenu();

    var top = target.getBoundingClientRect().top + window.scrollY - (header ? 68 : 0);
    window.scrollTo({ top: top, behavior: 'smooth' });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  /* ---------- Contadores de estadísticas ---------- */
  var counters = document.querySelectorAll('.stat-num[data-count]');
  var countAnimated = false;

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1600;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  function maybeAnimateCounters() {
    if (!counters.length || countAnimated) return;
    var last = counters[counters.length - 1];
    var rect = last.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      countAnimated = true;
      counters.forEach(animateCount);
      window.removeEventListener('scroll', maybeAnimateCounters);
    }
  }

  window.addEventListener('scroll', maybeAnimateCounters, { passive: true });
  maybeAnimateCounters();

  /* ---------- Enlace activo en el nav ---------- */
  var sections = [];
  document.querySelectorAll('.nav-list a[href^="#"]').forEach(function (a) {
    var target = document.querySelector(a.getAttribute('href'));
    if (target) sections.push({ link: a, target: target });
  });

  function setActiveLink() {
    var pos = window.scrollY + (header ? 80 : 0);
    var current = null;

    sections.forEach(function (item) {
      if (item.target.offsetTop <= pos) {
        current = item.link;
      }
    });

    sections.forEach(function (item) {
      item.link.classList.toggle('active', item.link === current);
    });
  }

  setActiveLink();
  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* ---------- Año actual ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
