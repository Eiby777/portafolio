/* ==========================================================================
   Catopa Auto Detailing Car Spa — lógica propia de la landing
   Sticky header · menú móvil · reveal on scroll · contadores ·
   galería horizontal (flechas + arrastre) · WhatsApp (form + servicios)
   ========================================================================== */
(function () {
  "use strict";

  var WA_NUMBER = "18093176913";
  var WA_SERVICE_PREFIX =
    "Hola Catopa Auto Detailing Car Spa. Quiero informacion sobre el servicio: ";
  var WA_FORM_PREFIX = "Hola Catopa Auto Detailing Car Spa. Nueva solicitud:";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
   * Utilidades
   * ------------------------------------------------------------- */
  function waLink(message) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message);
  }

  function openWhatsApp(message) {
    window.open(waLink(message), "_blank", "noopener");
  }

  /* ---------------------------------------------------------------
   * Sticky header
   * ------------------------------------------------------------- */
  var header = document.getElementById("siteHeader");

  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------------------------------------------------------
   * Menú móvil
   * ------------------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  function closeMenu() {
    if (!mainNav || !navToggle) return;
    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });

    mainNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 820) closeMenu();
    });
  }

  /* ---------------------------------------------------------------
   * Reveal on scroll (IntersectionObserver)
   * ------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el, i) {
      el.style.setProperty("--reveal-delay", (i % 6) * 80 + "ms");
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------------------------------------------------------
   * Contadores
   * ------------------------------------------------------------- */
  var counters = document.querySelectorAll("[data-counter]");

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (isNaN(target)) return;

    if (reduceMotion) {
      el.textContent = target.toLocaleString("es-DO") + suffix;
      return;
    }

    var duration = 1600;
    var startTime = null;

    function tick(now) {
      if (startTime === null) startTime = now;
      var progress = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = value.toLocaleString("es-DO") + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window && !reduceMotion) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------------------------------------------------------------
   * Galería horizontal: flechas + arrastre + snap
   * ------------------------------------------------------------- */
  var track = document.getElementById("galleryTrack");
  var prevBtn = document.getElementById("galleryPrev");
  var nextBtn = document.getElementById("galleryNext");

  if (track && prevBtn && nextBtn) {
    var hasNativeScroll = "scrollBy" in window;

    function scrollByCard(dir) {
      var card = track.querySelector(".service-card");
      var amount = card ? card.offsetWidth + 20 : 320;
      track.scrollBy({ left: dir * amount, behavior: reduceMotion ? "auto" : "smooth" });
    }

    function updateButtons() {
      var maxScroll = track.scrollWidth - track.clientWidth - 2;
      prevBtn.disabled = track.scrollLeft <= 2;
      nextBtn.disabled = track.scrollLeft >= maxScroll;
    }

    if (hasNativeScroll) {
      prevBtn.addEventListener("click", function () {
        scrollByCard(-1);
      });
      nextBtn.addEventListener("click", function () {
        scrollByCard(1);
      });

      track.addEventListener("scroll", updateButtons, { passive: true });
      window.addEventListener("resize", updateButtons);
      updateButtons();
    } else {
      prevBtn.disabled = true;
      nextBtn.disabled = true;
    }

    /* Arrastre con el puntero */
    var isDragging = false;
    var startX = 0;
    var startScroll = 0;
    var dragged = false;

    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      isDragging = true;
      dragged = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.classList.add("is-dragging");
    });

    window.addEventListener("pointermove", function (e) {
      if (!isDragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 6) dragged = true;
      track.scrollLeft = startScroll - dx;
    });

    function endDrag() {
      isDragging = false;
      track.classList.remove("is-dragging");
    }

    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    /* Evitar clic fantasma tras arrastrar */
    track.addEventListener("click", function (e) {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    /* Navegación con teclado */
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollByCard(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollByCard(-1);
      }
    });
  }

  /* ---------------------------------------------------------------
   * Botones "Consultar" de los servicios
   * ------------------------------------------------------------- */
  document.querySelectorAll(".service-card[data-wa-service]").forEach(function (card) {
    var cta = card.querySelector(".link-wa");
    if (!cta) return;

    cta.addEventListener("click", function () {
      var service = card.getAttribute("data-wa-service") || "servicio";
      openWhatsApp(WA_SERVICE_PREFIX + service);
    });
  });

  /* ---------------------------------------------------------------
   * Formulario de contacto → WhatsApp
   * ------------------------------------------------------------- */
  var form = document.getElementById("contactForm");
  if (form) {
    var nameInput = document.getElementById("fNombre");
    var phoneInput = document.getElementById("fTelefono");
    var serviceSelect = document.getElementById("fServicio");
    var messageInput = document.getElementById("fMensaje");
    var formError = document.getElementById("formError");

    function markInvalid(input, invalid) {
      if (!input) return;
      input.classList.toggle("is-invalid", invalid);
    }

    function showError(msg) {
      if (!formError) return;
      formError.textContent = msg;
      formError.hidden = false;
    }

    function clearError() {
      if (!formError) return;
      formError.hidden = true;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = (nameInput ? nameInput.value : "").trim();
      var phone = (phoneInput ? phoneInput.value : "").trim();
      var service = serviceSelect ? serviceSelect.value : "";
      var message = (messageInput ? messageInput.value : "").trim();

      var ok = true;

      if (!name) {
        markInvalid(nameInput, true);
        ok = false;
      } else {
        markInvalid(nameInput, false);
      }

      if (!phone) {
        markInvalid(phoneInput, true);
        ok = false;
      } else {
        markInvalid(phoneInput, false);
      }

      if (!service) {
        markInvalid(serviceSelect, true);
        ok = false;
      } else {
        markInvalid(serviceSelect, false);
      }

      if (!ok) {
        showError("Por favor completa tu nombre, teléfono y el servicio que necesitas.");
        return;
      }

      clearError();

      var lines = [
        WA_FORM_PREFIX,
        "",
        "Nombre: " + name,
        "Teléfono: " + phone,
        "Servicio: " + service
      ];

      if (message) {
        lines.push("Mensaje: " + message);
      }

      openWhatsApp(lines.join("\n"));
    });

    [nameInput, phoneInput, serviceSelect].forEach(function (input) {
      if (!input) return;
      input.addEventListener("input", function () {
        markInvalid(input, false);
      });
      input.addEventListener("change", function () {
        markInvalid(input, false);
      });
    });
  }

  /* ---------------------------------------------------------------
   * Año del pie de página
   * ------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
