// main.js — скрипты сайта кинотеатра «Октябрь»
console.log('Сайт кинотеатра загружен');

/* ========================================================
   0. ПРОВЕРКА: ждём загрузку DOM
   ======================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Шапка: фон при скролле + прогресс-бар ---------- */
  const header = document.getElementById('header');
  const progress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 30);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? (window.scrollY / h) * 100 : 0;
      progress.style.width = p + '%';
    }
  });

  /* ---------- Курсор-софит ---------- */
  const glow = document.getElementById('cursorGlow');
  if (glow) {
    window.addEventListener('mousemove', (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  }

  /* ---------- Parallax фона в hero ---------- */
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) heroBg.style.transform = `translateY(${y * 0.3}px)`;
    });
  }

  /* ---------- Reveal-анимации при скролле ---------- */
  const reveals = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('is-visible'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach((el) => io.observe(el));

  /* ---------- Счётчики в hero ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 30));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current;
      }, 40);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => counterIO.observe(el));

  /* ---------- Фильмы (афиша) ---------- */
  const movies = [
    { title: 'Дюна: Часть 3', genre: 'Фантастика', time: '165 мин', age: '16+', price: 450, rating: 8.9, emoji: '🎞️', grad: 'linear-gradient(135deg,#7c5cff,#3b0764)', tag: 'Премьера', tagClass: '' },
    { title: 'Тёмный рыцарь', genre: 'Боевик', time: '152 мин', age: '16+', price: 350, rating: 9.0, emoji: '🔥', grad: 'linear-gradient(135deg,#c2410c,#7f1d1d)', tag: 'Хит', tagClass: 'card__tag--hit' },
    { title: 'Интерстеллар', genre: 'Фантастика', time: '169 мин', age: '12+', price: 400, rating: 8.7, emoji: '🌌', grad: 'linear-gradient(135deg,#0891b2,#0c4a6e)', tag: 'Хит', tagClass: 'card__tag--hit' },
    { title: 'Оппенгеймер', genre: 'Драма', time: '180 мин', age: '18+', price: 500, rating: 8.5, emoji: '💥', grad: 'linear-gradient(135deg,#ea580c,#facc15)', tag: 'Премьера', tagClass: '' },
    { title: 'Аватар 3', genre: 'Фантастика', time: '190 мин', age: '12+', price: 550, rating: 8.2, emoji: '🌊', grad: 'linear-gradient(135deg,#16a34a,#064e3b)', tag: '', tagClass: '' },
    { title: 'Джокер 2', genre: 'Триллер', time: '138 мин', age: '18+', price: 450, rating: 7.8, emoji: '🃏', grad: 'linear-gradient(135deg,#dc2626,#450a0a)', tag: '', tagClass: '' },
    { title: 'Гладиатор 2', genre: 'Исторический', time: '148 мин', age: '16+', price: 450, rating: 8.1, emoji: '🏛️', grad: 'linear-gradient(135deg,#b45309,#78350f)', tag: 'Хит', tagClass: 'card__tag--hit' },
    { title: 'Властелин колец', genre: 'Фэнтези', time: '178 мин', age: '12+', price: 400, rating: 9.1, emoji: '💍', grad: 'linear-gradient(135deg,#7e22ce,#4c1d95)', tag: '', tagClass: '' }
  ];

  const grid = document.getElementById('moviesGrid');
  if (grid) {
    movies.forEach((m) => {
      const el = document.createElement('article');
      el.className = 'card';
      el.innerHTML = `
        <div class="card__cover" style="background:${m.grad}">
          ${m.tag ? `<span class="card__tag ${m.tagClass}">${m.tag}</span>` : ''}
          ${m.emoji}
        </div>
        <div class="card__body">
          <h3 class="card__title">${m.title}</h3>
          <p class="card__meta">${m.genre} · ${m.time} · ${m.age}</p>
          <p class="card__price">${m.rating} · от ${m.price} ₽</p>
        </div>
      `;
      el.addEventListener('click', () => {
        document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' });
      });
      grid.appendChild(el);
    });
  }

  /* ---------- Даты в расписании ---------- */
  const datesEl = document.getElementById('dates');
  if (datesEl) {
    const weekdays = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'date' + (i === 0 ? ' active' : '');
      btn.innerHTML = `<span class="date__d">${d.getDate()}</span><span class="date__w">${i === 0 ? 'Сегодня' : weekdays[d.getDay()]}</span>`;
      btn.addEventListener('click', () => {
        datesEl.querySelectorAll('.date').forEach((x) => x.classList.remove('active'));
        btn.classList.add('active');
      });
      datesEl.appendChild(btn);
    }
  }

  /* ---------- Время в расписании ---------- */
  const timesEl = document.getElementById('times');
  if (timesEl) {
    const sessions = [
      { t: '10:30', f: '2D', p: '450 ₽' },
      { t: '12:15', f: '3D', p: '550 ₽' },
      { t: '14:40', f: '2D', p: '450 ₽' },
      { t: '16:20', f: 'IMAX', p: '850 ₽' },
      { t: '19:20', f: 'IMAX', p: '950 ₽' },
      { t: '21:45', f: '4DX', p: '1100 ₽' },
      { t: '23:30', f: '2D', p: '400 ₽' }
    ];
    sessions.forEach((s) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'time';
      btn.innerHTML = `${s.t}<small>${s.f} · ${s.p}</small>`;
      btn.addEventListener('click', () => {
        document.getElementById('hall')?.scrollIntoView({ behavior: 'smooth' });
      });
      timesEl.appendChild(btn);
    });
  }

  /* ---------- Схема зала + панель заказа ---------- */
  const seatsEl = document.getElementById('seats');
  const selSeatsEl = document.getElementById('selSeats');
  const totalEl = document.getElementById('total');

  if (seatsEl) {
    const ROWS = 7, COLS = 12;
    const PRICE = 450;
    const VIP_PRICE = 900;
    const selected = new Map(); // key -> price

    const occupied = new Set(['0-1','0-2','1-5','2-3','2-4','3-8','4-0','5-6','6-10','6-11']);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const key = `${r}-${c}`;
        const seat = document.createElement('div');
        seat.className = 'seat';
        if (occupied.has(key)) {
          seat.classList.add('occupied');
        } else {
          const isVip = r >= 5;
          if (isVip) seat.classList.add('vip');
          seat.dataset.key = key;
          seat.addEventListener('click', () => {
            if (selected.has(key)) {
              selected.delete(key);
              seat.classList.remove('selected');
            } else {
              selected.set(key, isVip ? VIP_PRICE : PRICE);
              seat.classList.add('selected');
            }
            updateOrder();
          });
        }
        seatsEl.appendChild(seat);
      }
    }

    function updateOrder() {
      const count = selected.size;
      let sum = 0;
      selected.forEach((p) => { sum += p; });
      if (selSeatsEl) selSeatsEl.textContent = count ? `${count} шт.` : '—';
      if (totalEl) totalEl.textContent = `${sum} ₽`;
    }
  }

  /* ---------- Модалка трейлера ---------- */
  const modal = document.getElementById('trailerModal');
  const trailerBtn = document.getElementById('trailerBtn');

  if (trailerBtn && modal) {
    const openModal = () => {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    trailerBtn.addEventListener('click', openModal);
    modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
        });
    }

});