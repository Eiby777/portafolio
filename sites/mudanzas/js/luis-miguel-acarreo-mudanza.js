/* ==========================================================================
   Vásquez Handyman Services — lógica del sitio (self-contained)
   ========================================================================== */
(function () {
  "use strict";

  var doc = document.documentElement;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WA_NUMBER = "18294673047";
  var WA_BASE = "https://wa.me/" + WA_NUMBER + "?text=";

  /* ---------- Año del footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header pegajoso + botón flotante de WhatsApp ---------- */
  var header = document.querySelector(".site-header");
  var waFloat = document.querySelector(".wa-float");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("scrolled", y > 10);
    if (waFloat) waFloat.classList.toggle("show", y > 480);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  var toggle = document.getElementById("menu-toggle");
  var nav = document.getElementById("site-nav");

  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("open"));
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !nav.contains(e.target) && !toggle.contains(e.target)) {
        setMenu(false);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 899) setMenu(false);
    });
  }

  /* ---------- Aparición al hacer scroll (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll(".js .reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Contadores suaves (datos reales) ---------- */
  var counterEls = document.querySelectorAll("[data-count]");

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (counterEls.length) {
    if (reducedMotion || !("IntersectionObserver" in window)) {
      counterEls.forEach(function (el) {
        el.textContent = parseFloat(el.getAttribute("data-count")).toFixed(parseInt(el.getAttribute("data-decimals") || "0", 10)) + (el.getAttribute("data-suffix") || "");
      });
    } else {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counterEls.forEach(function (el) { counterObserver.observe(el); });
    }
  }

  /* ---------- Formulario → WhatsApp ---------- */
  var form = document.getElementById("contact-form");

  function markInvalid(input) {
    var field = input.closest(".field");
    if (field) field.classList.add("invalid");
  }
  function clearInvalid(input) {
    var field = input.closest(".field");
    if (field) field.classList.remove("invalid");
  }

  if (form) {
    ["#cf-nombre", "#cf-telefono", "#cf-servicio"].forEach(function (sel) {
      var input = form.querySelector(sel);
      if (input) {
        input.addEventListener("input", function () { clearInvalid(input); });
        input.addEventListener("change", function () { clearInvalid(input); });
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nombre = form.querySelector("#cf-nombre");
      var telefono = form.querySelector("#cf-telefono");
      var servicio = form.querySelector("#cf-servicio");
      var mensaje = form.querySelector("#cf-mensaje");

      var ok = true;
      [nombre, telefono, servicio].forEach(function (input) {
        if (!input.value.trim()) { markInvalid(input); ok = false; }
      });
      if (!ok) return;

      var partes = [
        "Hola, mi nombre es " + nombre.value.trim() + "."
      ];
      if (servicio.value) partes.push("Servicio: " + servicio.value + ".");
      if (mensaje && mensaje.value.trim()) partes.push("Detalle: " + mensaje.value.trim());
      partes.push("Mi teléfono es " + telefono.value.trim() + ".");
      partes.push("Quisiera una cotización.");

      var texto = partes.join(" ");
      var waUrl = WA_BASE + encodeURIComponent(texto);

      var nuevaVentana = window.open(waUrl, "_blank", "noopener");
      if (!nuevaVentana) window.location.href = waUrl;

      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        var original = btn.textContent;
        btn.textContent = "Abriendo WhatsApp…";
        setTimeout(function () {
          btn.textContent = original;
          form.reset();
        }, 2500);
      }
    });
  }
})();
