/* ==========================================================
   Barbería Estilo Real · js/barberias.js
   Menú móvil · Header sticky · Reveal on scroll ·
   Smooth scroll · Año actual · Contadores
   ========================================================== */

(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.getElementById("navToggle");
  var siteNav = document.getElementById("siteNav");

  /* ---------- Header sticky ---------- */
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-stuck", window.scrollY > 24);
  }

  /* ---------- Menú móvil ---------- */
  function closeMenu() {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
    document.body.style.overflow = "";
  }

  function toggleMenu() {
    var isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", toggleMenu);

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Smooth scroll con offset ---------- */
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href");
      if (targetId.length < 2) return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      var offset =
        header && header.classList.contains("is-stuck") ? 70 : 90;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: Math.max(top, 0),
        behavior: REDUCED ? "auto" : "smooth"
      });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !REDUCED) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Navegación activa ---------- */
  var navLinks = document.querySelectorAll(".nav-link");
  var sections = [];

  navLinks.forEach(function (link) {
    var id = link.getAttribute("href");
    if (id && id.length > 1) {
      var section = document.querySelector(id);
      if (section) sections.push({ id: id, el: section, link: link });
    }
  });

  function onScrollActive() {
    var pos = window.scrollY + 140;
    var current = null;

    sections.forEach(function (item) {
      if (item.el.offsetTop <= pos) current = item;
    });

    navLinks.forEach(function (link) {
      link.classList.remove("is-active");
    });

    if (current) current.link.classList.add("is-active");
  }

  /* ---------- Contadores de estadísticas ---------- */
  function animateCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1400;
      var start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.round(target * eased);

        el.textContent = value.toLocaleString("es-DO") + suffix;

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString("es-DO") + suffix;
        }
      }

      window.requestAnimationFrame(step);
    });
  }

  if ("IntersectionObserver" in window && !REDUCED) {
    var stats = document.querySelector(".stats");
    if (stats) {
      var statsObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounters();
              statsObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      statsObserver.observe(stats);
    }
  }

  /* ---------- Año actual en el footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Init ---------- */
  onScrollHeader();
  onScrollActive();

  window.addEventListener("scroll", function () {
    onScrollHeader();
    onScrollActive();
  }, { passive: true });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 920) closeMenu();
  });
})();
