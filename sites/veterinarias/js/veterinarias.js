/* ==========================================================
   Clínica Veterinaria Amigo Fiel — js/veterinarias.js
   Menú móvil, header sticky, reveal on scroll,
   smooth scroll y año actual.
   ========================================================== */

(function () {
  "use strict";

  /* ---------- Menú móvil ---------- */
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");

  function closeMenu() {
    if (!siteNav || !navToggle) return;
    siteNav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = siteNav.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", function (event) {
      if (
        siteNav.classList.contains("open") &&
        !siteNav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  /* ---------- Header sticky / sombra al hacer scroll ---------- */
  const header = document.getElementById("siteHeader");
  const navLinks = document.querySelectorAll(".nav-list a");

  function onScroll() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 12);
    }
    updateActiveLink();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Resaltar enlace activo según sección ---------- */
  function updateActiveLink() {
    if (navLinks.length === 0) return;
    const scrollPos = window.scrollY + 130;

    let currentId = "inicio";
    navLinks.forEach(function (link) {
      const target = document.querySelector(link.getAttribute("href"));
      if (target && target.offsetTop <= scrollPos) {
        currentId = link.getAttribute("href").slice(1);
      }
    });

    navLinks.forEach(function (link) {
      const isActive = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("active", isActive);
    });
  }

  /* ---------- Smooth scroll para anclas ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      const href = anchor.getAttribute("href");
      if (href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el, index) {
      const delay = el.getAttribute("data-delay");
      if (delay) {
        el.style.transitionDelay = delay + "ms";
      } else if (index % 4 === 0) {
        el.style.transitionDelay = "0ms";
      }
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- Año actual en el footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
