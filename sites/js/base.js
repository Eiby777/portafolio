/* ============================================================
   base.js — Interacciones compartidas (nav, scroll reveal,
   validación de formulario, enlace de WhatsApp).
   Vanilla JS, sin dependencias.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Menú móvil ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => nav.classList.remove('open'))
    );
  }

  /* ---------- Header con sombra al hacer scroll ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () =>
      header.style.setProperty('background', window.scrollY > 10
        ? 'color-mix(in oklab, var(--c-bg) 92%, transparent)'
        : 'color-mix(in oklab, var(--c-bg) 78%, transparent)');
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Aparición de elementos (reveal) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Año dinámico en el footer ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Construcción del enlace de WhatsApp ----------
     Uso: un formulario con data-wa-form y data-wa-number="1XXXXXXXXXX".
     Al enviar: valida y abre WhatsApp con el mensaje armado.       */
  const waForm = document.querySelector('[data-wa-form]');
  if (waForm) {
    waForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      let valid = true;

      waForm.querySelectorAll('[required]').forEach((field) => {
        const err = field.closest('.form-field')?.querySelector('.form-error');
        const empty = !field.value.trim();
        field.style.borderColor = empty ? '#ff6b81' : '';
        if (err) err.textContent = empty ? 'Este campo es obligatorio.' : '';
        if (empty) valid = false;
      });

      if (!valid) return;

      const number = waForm.getAttribute('data-wa-number');
      if (!number) {
        const ok = waForm.querySelector('.form-ok');
        if (ok) {
          ok.style.display = 'block';
          ok.textContent = 'El contacto de esta página todavía está en configuración.';
        }
        return;
      }
      const data = new FormData(waForm);
      const nombre = data.get('nombre') || '';
      const telefono = data.get('telefono') || '';
      const servicio = data.get('servicio') || '';
      const mensaje = data.get('mensaje') || '';

      const text =
        `Hola, soy ${nombre}.` +
        (telefono ? ` Mi teléfono: ${telefono}.` : '') +
        (servicio ? ` Me interesa: ${servicio}.` : '') +
        (mensaje ? ` ${mensaje}` : '');

      window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank');

      const ok = waForm.querySelector('.form-ok');
      if (ok) {
        ok.style.display = 'block';
        ok.textContent = '¡Listo! Se abrió WhatsApp con tu mensaje.';
        setTimeout(() => (ok.style.display = 'none'), 6000);
      }
      waForm.reset();
    });
  }

  /* ---------- Slider centrado de especialidades ---------- */
  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const viewport = slider.querySelector('.specialty-viewport');
    const track = slider.querySelector('.specialty-track');
    const slides = [...slider.querySelectorAll('.specialty-slide')];
    const dots = slider.querySelector('.slider-dots');
    const prev = slider.querySelector('[data-slider-prev]');
    const next = slider.querySelector('[data-slider-next]');
    if (!viewport || !track || !slides.length) return;

    let active = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slider-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Ver especialidad ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dots?.appendChild(dot);
    });

    function goTo(index) {
      active = (index + slides.length) % slides.length;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const offset = viewport.clientWidth / 2 - slides[active].offsetWidth / 2 - active * (slides[active].offsetWidth + gap);
      track.style.transform = `translateX(${offset}px)`;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === active));
      dots?.querySelectorAll('.slider-dot').forEach((dot, i) => dot.classList.toggle('is-active', i === active));
    }

    function restart() {
      clearInterval(timer);
      timer = setInterval(() => goTo(active + 1), 6000);
    }

    prev?.addEventListener('click', () => { goTo(active - 1); restart(); });
    next?.addEventListener('click', () => { goTo(active + 1); restart(); });
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', restart);
    window.addEventListener('resize', () => goTo(active));
    goTo(0);
    restart();
  });
})();
