/* ==========================================================================
   FISIOTERAPIA VITALCARE — Interacciones (autocontenido)
   Menú móvil · Header sticky · Reveal on scroll · Smooth scroll · Año actual
   ========================================================================== */

(function () {
    "use strict";

    var header = document.getElementById("site-header");
    var nav = document.getElementById("site-nav");
    var navToggle = document.getElementById("nav-toggle");

    /* ---------- Header sticky ---------- */
    function onScroll() {
        if (window.scrollY > 12) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- Menú móvil ---------- */
    function closeMenu() {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menú");
        document.body.style.overflow = "";
    }

    function toggleMenu() {
        var isOpen = nav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
        document.body.style.overflow = isOpen ? "hidden" : "";
    }

    if (navToggle) {
        navToggle.addEventListener("click", toggleMenu);
    }

    /* ---------- Smooth scroll (anclas internas) ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            var targetId = link.getAttribute("href");
            if (targetId.length < 2) return;

            var target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            var headerOffset = header ? header.offsetHeight : 0;
            var top =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                headerOffset +
                6;

            window.scrollTo({ top: top, behavior: "smooth" });
            closeMenu();
        });
    });

    /* ---------- Reveal on scroll ---------- */
    var revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(function (el) {
            el.classList.add("is-visible");
        });
    }

    /* ---------- Año actual ---------- */
    var yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }
})();
