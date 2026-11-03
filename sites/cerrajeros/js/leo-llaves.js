(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ *
   * Datos de sucursales (fuente única para el switcher del hero)
   * ------------------------------------------------------------------ */
  var BRANCHES = {
    'cristo-rey': {
      name: 'Sucursal Cristo Rey',
      address: 'Av. José Ortega y Gasset 103, Santo Domingo 10000',
      hours: 'Lun a Vie · 08:30–18:00',
      note: 'Sáb 08:00–15:00 · Dom cerrado',
      phoneText: '+1 809 567 5292',
      phoneHref: 'tel:+180****5292',
      wa: 'https://wa.me/18095675292?text=' + encodeURIComponent('Hola Leo Llaves, los contacto desde la sucursal de Cristo Rey.'),
      map: 'https://maps.google.com/maps?q=' + encodeURIComponent('Av. José Ortega y Gasset 103, Santo Domingo') + '&z=16&output=embed'
    },
    'naco': {
      name: 'Sucursal Naco',
      address: 'C. Mustafá Kemal Ataturk, Santo Domingo',
      hours: 'Lun a Vie · 08:30–18:00',
      note: 'Sáb 08:30–15:00 · Dom cerrado',
      phoneText: '+1 809 299 5452',
      phoneHref: 'tel:+180****5452',
      wa: 'https://wa.me/18092995452?text=' + encodeURIComponent('Hola Leo Llaves, los contacto desde la sucursal de Naco.'),
      map: 'https://maps.google.com/maps?q=' + encodeURIComponent('C. Mustafá Kemal Ataturk, Santo Domingo') + '&z=16&output=embed'
    }
  };

  /* ------------------------------------------------------------------ *
   * Utilidades
   * ------------------------------------------------------------------ */
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /* ------------------------------------------------------------------ *
   * Header pegajoso
   * ------------------------------------------------------------------ */
  function initStickyHeader() {
    var header = document.getElementById('siteHeader');
    if (!header) return;
    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * Menú móvil
   * ------------------------------------------------------------------ */
  function initMobileMenu() {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('siteNav');
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    }

    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 860) setOpen(false);
    });
  }

  /* ------------------------------------------------------------------ *
   * Aparición al hacer scroll (IntersectionObserver)
   * ------------------------------------------------------------------ */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    els.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
        return c.classList.contains('reveal');
      });
      var idx = siblings.indexOf(el);
      el.style.setProperty('--reveal-delay', Math.min(idx * 80, 400) + 'ms');
    });

    if (prefersReduced) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------ *
   * Contadores animados
   * ------------------------------------------------------------------ */
  function initCounters() {
    var counters = document.querySelectorAll('.count');
    if (!counters.length) return;

    function render(el, value, decimals) {
      el.textContent = value.toFixed(decimals);
    }

    function animate(el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);

      if (prefersReduced) {
        render(el, target, decimals);
        return;
      }

      var duration = 1400;
      var startTime = null;

      function frame(now) {
        if (startTime === null) startTime = now;
        var progress = Math.min((now - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        render(el, target * eased, decimals);
        if (progress < 1) requestAnimationFrame(frame);
      }

      requestAnimationFrame(frame);
    }

    if (prefersReduced || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        render(el, parseFloat(el.getAttribute('data-count')) || 0, parseInt(el.getAttribute('data-decimals') || '0', 10));
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------ *
   * Switcher de sucursales (hero)
   * ------------------------------------------------------------------ */
  function initBranchSwitcher() {
    var tabs = document.querySelectorAll('.branch-tab');
    var panel = document.getElementById('panel-sucursal');
    var inner = document.getElementById('branchPanelInner');
    var map = document.getElementById('branchMap');
    if (!tabs.length || !panel || !inner || !map) return;

    var current = 'cristo-rey';
    var loaded = {};

    function apply(branch) {
      var data = BRANCHES[branch];
      document.getElementById('branchName').textContent = data.name;
      document.getElementById('branchAddressText').textContent = data.address;
      document.getElementById('branchHours').textContent = data.hours;
      document.getElementById('branchNote').textContent = data.note;
      document.getElementById('branchPhoneText').textContent = data.phoneText;
      document.getElementById('branchPhone').setAttribute('href', data.phoneHref);
      document.getElementById('branchWa').setAttribute('href', data.wa);

      if (!loaded[branch]) {
        map.setAttribute('src', data.map);
        loaded[branch] = true;
      }
    }

    function activate(branch) {
      if (branch === current) return;
      current = branch;

      tabs.forEach(function (tab) {
        var isActive = tab.getAttribute('data-branch') === branch;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        if (isActive) panel.setAttribute('aria-labelledby', tab.id);
      });

      inner.classList.add('is-swapping');
      window.setTimeout(function () {
        apply(branch);
        inner.classList.remove('is-swapping');
      }, 300);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activate(tab.getAttribute('data-branch'));
      });
    });

    apply(current);
  }

  /* ------------------------------------------------------------------ *
   * Mapas perezosos (sección sucursales)
   * ------------------------------------------------------------------ */
  function initLazyMaps() {
    var frames = document.querySelectorAll('.map-lazy');
    if (!frames.length) return;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      frames.forEach(function (frame) {
        var src = frame.getAttribute('data-src');
        if (src && !frame.getAttribute('src')) frame.setAttribute('src', src);
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var frame = entry.target;
          var src = frame.getAttribute('data-src');
          if (src && !frame.getAttribute('src')) frame.setAttribute('src', src);
          obs.unobserve(frame);
        }
      });
    }, { rootMargin: '300px 0px' });

    frames.forEach(function (frame) { observer.observe(frame); });
  }

  /* ------------------------------------------------------------------ *
   * Acordeón de preguntas frecuentes
   * ------------------------------------------------------------------ */
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    function closeItem(item) {
      var panel = item.querySelector('.faq-a');
      var btn = item.querySelector('.faq-q');
      item.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      if (panel) panel.style.maxHeight = '0px';
    }

    function openItem(item) {
      var panel = item.querySelector('.faq-a');
      var btn = item.querySelector('.faq-q');
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
    }

    items.forEach(function (item) {
      var btn = item.querySelector('.faq-q');
      var panel = item.querySelector('.faq-a');
      if (!btn || !panel) return;
      panel.style.maxHeight = '0px';

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');
        items.forEach(closeItem);
        if (!isOpen) openItem(item);
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Formulario de contacto → WhatsApp
   * ------------------------------------------------------------------ */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var nombre = document.getElementById('cf-nombre');
    var telefono = document.getElementById('cf-telefono');
    var servicio = document.getElementById('cf-servicio');
    var mensaje = document.getElementById('cf-mensaje');
    var note = document.getElementById('formNote');

    function setError(input, message) {
      var wrap = input.closest('.field');
      wrap.classList.add('is-error');
      var existing = wrap.querySelector('.field-error');
      if (existing) {
        existing.textContent = message;
      } else {
        var err = document.createElement('span');
        err.className = 'field-error';
        err.textContent = message;
        wrap.appendChild(err);
      }
      input.setAttribute('aria-invalid', 'true');
    }

    function clearError(input) {
      var wrap = input.closest('.field');
      wrap.classList.remove('is-error');
      var existing = wrap.querySelector('.field-error');
      if (existing) existing.remove();
      input.removeAttribute('aria-invalid');
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var firstInvalid = null;

      [nombre, telefono, servicio].forEach(function (input) {
        if (!input.value.trim()) {
          setError(input, 'Por favor completa este campo.');
          if (!firstInvalid) firstInvalid = input;
        } else {
          clearError(input);
        }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      var text =
        'Hola Leo Llaves, soy ' + nombre.value.trim() + '.\n' +
        'Teléfono: ' + telefono.value.trim() + '\n' +
        'Servicio: ' + servicio.value + (mensaje.value.trim() ? '\n' + mensaje.value.trim() : '');

      if (note) note.textContent = 'Abriendo WhatsApp con tu mensaje…';
      window.open('https://wa.me/18095675292?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }

  /* ------------------------------------------------------------------ *
   * Año en el footer
   * ------------------------------------------------------------------ */
  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------ */
  onReady(function () {
    initStickyHeader();
    initMobileMenu();
    initReveal();
    initCounters();
    initBranchSwitcher();
    initLazyMaps();
    initFaq();
    initContactForm();
    initYear();
  });
})();
