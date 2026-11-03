/* ============================================================
   Abisay Medina — Portafolio
   Navegación, filtros, vista de lista y vista rápida.
   ============================================================ */

(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Header con fondo al hacer scroll ---------- */
  const header = $('.site-head');
  const setHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  /* ---------- Menú móvil ---------- */
  const nav = $('#site-nav');
  const navToggle = $('.nav-toggle');
  const closeNav = () => {
    nav?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Abrir menú');
  };
  navToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(!!open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  $$('#site-nav a').forEach((a) => a.addEventListener('click', closeNav));
  document.addEventListener('click', (e) => {
    if (!nav?.classList.contains('is-open')) return;
    if (nav.contains(e.target) || navToggle?.contains(e.target)) return;
    closeNav();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  /* ---------- Año ---------- */
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -34px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Filtros, búsqueda y vista ---------- */
  const grid = $('#projects-grid');
  const cards = $$('.project-card', grid);
  const filterButtons = $$('.filter');
  const searchInput = $('#project-search');
  const viewButtons = $$('.view-toggle [data-view]');
  const resultsCount = $('#results-count');
  const emptyState = $('#empty-state');
  const clearFilters = $('#clear-filters');

  let activeFilter = 'all';
  let query = '';
  let visibleCards = cards.slice();

  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const cardSearchText = (card) =>
    normalize(
      [
        card.dataset.name,
        card.dataset.desc,
        card.dataset.tags,
        card.dataset.catname,
        card.querySelector('.project-title')?.textContent || '',
      ].join(' ')
    );

  const countLabel = (n) => `${n} ${n === 1 ? 'proyecto' : 'proyectos'}`;

  function applyFilters() {
    visibleCards = [];
    cards.forEach((card) => {
      const matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
      const matchesQuery = !query || cardSearchText(card).includes(query);
      const show = matchesFilter && matchesQuery;
      card.classList.toggle('is-hidden', !show);
      if (show) visibleCards.push(card);
    });

    const suffix = activeFilter === 'all' ? '' : ` en ${$(`.filter[data-filter="${activeFilter}"]`)?.textContent.replace(/\s+\d+$/, '') || ''}`;
    resultsCount.textContent = `${countLabel(visibleCards.length)}${suffix}`;
    emptyState.hidden = visibleCards.length > 0;
    grid.hidden = visibleCards.length === 0;
  }

  filterButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.classList.contains('is-active')));
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((b) => {
        const active = b === button;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      applyFilters();
    });
  });

  searchInput?.addEventListener('input', () => {
    query = normalize(searchInput.value.trim());
    applyFilters();
  });

  clearFilters?.addEventListener('click', () => {
    activeFilter = 'all';
    query = '';
    if (searchInput) searchInput.value = '';
    filterButtons.forEach((b) => {
      const active = b.dataset.filter === 'all';
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    applyFilters();
    searchInput?.focus();
  });

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const isList = button.dataset.view === 'list';
      grid.classList.toggle('is-list', isList);
      viewButtons.forEach((b) => {
        const active = b === button;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
    });
  });

  /* ---------- Vista rápida ---------- */
  const dialog = $('#project-dialog');
  const dialogImage = $('#dialog-image');
  const dialogCat = $('#dialog-cat');
  const dialogTitle = $('#dialog-title');
  const dialogDesc = $('#dialog-desc');
  const dialogTags = $('#dialog-tags');
  const dialogLink = $('#dialog-link');
  const dialogCount = $('#dialog-count');
  const dialogUrl = $('#preview-url');
  const dialogPreview = $('.dialog-preview');
  const deviceButtons = $$('[data-device]');
  let currentIndex = -1;
  let currentDevice = 'desktop';
  let lastFocused = null;

  function setImage(card) {
    if (!dialogImage || !card) return;
    const slug = card.dataset.slug;
    dialogImage.src =
      currentDevice === 'mobile'
        ? `assets/shots/mobile/${slug}.webp`
        : `assets/shots/${slug}.webp`;
    dialogImage.alt = `Vista ${currentDevice === 'mobile' ? 'móvil' : 'de escritorio'} del sitio de ${card.dataset.name}`;
    if (dialogPreview) dialogPreview.dataset.device = currentDevice;
    if (dialogUrl) dialogUrl.textContent = `sites/${slug}/`;
  }

  function renderDialog(card) {
    if (!card) return;
    const cat = card.dataset.catname || '';
    dialogCat.textContent = cat;
    dialogCat.style.setProperty('--cat', card.style.getPropertyValue('--cat'));
    dialogTitle.textContent = card.dataset.name;
    dialogDesc.textContent = card.dataset.desc;
    dialogTags.textContent = (card.dataset.tags || '').split(' · ').join('   /   ');
    dialogLink.href = card.querySelector('.project-image')?.getAttribute('href') || '#';
    dialogCount.textContent = `${currentIndex + 1} / ${visibleCards.length}`;
    setImage(card);
  }

  function openDialog(card) {
    if (!dialog || typeof dialog.showModal !== 'function') return;
    currentIndex = visibleCards.indexOf(card);
    if (currentIndex < 0) {
      visibleCards = cards.filter((c) => !c.classList.contains('is-hidden'));
      currentIndex = Math.max(0, visibleCards.indexOf(card));
    }
    lastFocused = document.activeElement;
    renderDialog(visibleCards[currentIndex]);
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    $('#dialog-prev')?.focus({ preventScroll: true });
  }

  function closeDialog() {
    if (!dialog?.open) return;
    dialog.close();
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus({ preventScroll: true });
  }

  function stepDialog(direction) {
    if (!visibleCards.length) return;
    currentIndex = (currentIndex + direction + visibleCards.length) % visibleCards.length;
    renderDialog(visibleCards[currentIndex]);
    $('.dialog-info')?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  $$('[data-preview]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.project-card');
      if (card) openDialog(card);
    });
  });

  $('.dialog-close')?.addEventListener('click', closeDialog);
  $('#dialog-prev')?.addEventListener('click', () => stepDialog(-1));
  $('#dialog-next')?.addEventListener('click', () => stepDialog(1));

  dialog?.addEventListener('click', (e) => {
    if (e.target === dialog) closeDialog();
  });
  dialog?.addEventListener('close', () => {
    document.body.style.overflow = '';
  });
  dialog?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') stepDialog(-1);
    if (e.key === 'ArrowRight') stepDialog(1);
  });

  deviceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      currentDevice = button.dataset.device;
      deviceButtons.forEach((b) => {
        const active = b === button;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      if (visibleCards[currentIndex]) setImage(visibleCards[currentIndex]);
    });
  });

  /* Abrir la vista rápida desde el enlace del título con Alt/Cmd + clic */
  $$('.project-title a').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (!(e.metaKey || e.altKey)) return;
      e.preventDefault();
      const card = link.closest('.project-card');
      if (card) openDialog(card);
    });
  });

  /* ---------- Marcar primer bloque visible ---------- */
  if (location.hash === '#proyectos') {
    setTimeout(() => {
      $$('.reveal').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) el.classList.add('visible');
      });
    }, 120);
  }
})();
