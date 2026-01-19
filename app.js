// ===== Año dinámico =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Hero autoplay =====
(() => {
  const heroImgs = document.querySelectorAll('.hero-slides img');
  if (!heroImgs.length) return;

  let heroIdx = 0;
  setInterval(() => {
    heroImgs[heroIdx].classList.remove('active');
    heroIdx = (heroIdx + 1) % heroImgs.length;
    heroImgs[heroIdx].classList.add('active');
  }, 4000);
})();

// ===== Carrusel EVENTOS =====
(() => {
  const track = document.getElementById('eventosTrack');
  if (!track) return;

  const slides = Array.from(track.children);
  const prev = document.getElementById('evPrev');
  const next = document.getElementById('evNext');
  const dotsWrap = document.getElementById('evDots');

  let idx = 0;

  function renderDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'dot' + (i === idx ? ' active' : '');
      d.addEventListener('click', () => go(i));
      dotsWrap.appendChild(d);
    });
  }

  function go(i) {
    idx = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    renderDots();
  }

  prev?.addEventListener('click', () => go(idx - 1));
  next?.addEventListener('click', () => go(idx + 1));

  renderDots();
  setInterval(() => go(idx + 1), 5000);
})();

// ===== Footer: mapa y formulario =====
(() => {
  const LAT = '19.52627344151608';
  const LNG = '-96.89595757467613';

  const mapEl = document.getElementById('cmicMap2');
  if (mapEl) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(LAT)},${encodeURIComponent(LNG)}&z=16&hl=es&output=embed`;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = '0';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    mapEl.appendChild(iframe);
  }

  const mapLink = document.getElementById('cmicMapLink2');
  if (mapLink) {
    mapLink.href = `https://www.google.com/maps?q=${encodeURIComponent(LAT)},${encodeURIComponent(LNG)}`;
  }

  // Formulario footer -> WhatsApp
  const footerForm = document.getElementById('footerForm');
  if (footerForm) {
    footerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('fNombre')?.value.trim();
      const correo = document.getElementById('fCorreo')?.value.trim();
      const asunto = document.getElementById('fAsunto')?.value.trim();
      if (!nombre || !correo || !asunto) return;

      const mensaje = `Hola, soy ${nombre}. ${asunto}. Mi correo es: ${correo}.`;
      const phone = '522289881856';
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank', 'noopener');
    });
  }
})();

// ===== Coverflow Damas CMIC =====
(() => {
  const stage = document.getElementById('cfDamas');
  if (!stage) return;

  const cards = Array.from(stage.querySelectorAll('.cf-card'));
  const root = stage.parentElement;
  const prevBtn = root.querySelector('.cf-prev');
  const nextBtn = root.querySelector('.cf-next');
  const titleEl = root.querySelector('.cf-title');
  const subEl = root.querySelector('.cf-sub');

  let idx = Math.floor(cards.length / 2);

  const gapX = 90;
  const rotY = -22;
  const scaleStep = 0.12;
  const depth = 160;

  function paint() {
    cards.forEach((card, i) => {
      const delta = i - idx;
      const abs = Math.abs(delta);

      card.style.zIndex = String(100 - abs);

      const translateX = delta * gapX;
      const translateZ = -abs * depth;
      const rotateY = delta === 0 ? 0 : (delta < 0 ? rotY : -rotY);
      const scale = 1 - abs * scaleStep;

      card.style.transform =
        `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
    });

    const c = cards[idx];
    if (titleEl) titleEl.textContent = c?.dataset.title || '';
    if (subEl) subEl.textContent = c?.dataset.sub || '';
  }

  function go(n) {
    idx = (n + cards.length) % cards.length;
    paint();
  }

  prevBtn?.addEventListener('click', () => go(idx - 1));
  nextBtn?.addEventListener('click', () => go(idx + 1));

  // Teclado
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(idx - 1);
    if (e.key === 'ArrowRight') go(idx + 1);
  });

  // Drag / touch
  let startX = null;
  stage.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointerup', (e) => {
    if (startX == null) return;
    const dx = e.clientX - startX;
    if (dx > 40) go(idx - 1);
    if (dx < -40) go(idx + 1);
    startX = null;
  });

  // Esperar imágenes
  let loaded = 0;
  const total = cards.length;
  const fallback = setTimeout(() => paint(), 1200);

  cards.forEach((card) => {
    const img = card.querySelector('img');
    if (!img) {
      loaded++;
      return;
    }
    if (img.complete) {
      loaded++;
      if (loaded === total) clearTimeout(fallback), paint();
    } else {
      img.addEventListener('load', () => {
        loaded++;
        if (loaded === total) clearTimeout(fallback), paint();
      });
      img.addEventListener('error', () => {
        loaded++;
        if (loaded === total) clearTimeout(fallback), paint();
      });
    }
  });

  if (loaded === total) clearTimeout(fallback), paint();
})();

// ===== Ripple botón ICIC =====
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-cursos-icic");
  if (!btn) return;

  btn.addEventListener("click", function(e) {
    const circle = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    circle.style.width = circle.style.height = size + "px";
    circle.style.left = (e.clientX - rect.left - size / 2) + "px";
    circle.style.top  = (e.clientY - rect.top  - size / 2) + "px";
    circle.className = "ripple";

    const existing = this.querySelector(".ripple");
    if (existing) existing.remove();

    this.appendChild(circle);
  });
});

// ===== Scroll suave a formulario (Afíliate) =====
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".btn-afiliate");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(btn.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// ===== Carrusel DESCUENTOS AFILIADOS =====
(() => {
  const afTrack = document.getElementById('afTrack');
  if (!afTrack) return;

  const afSlides = Array.from(afTrack.children);
  const afPrev = document.getElementById('afPrev');
  const afNext = document.getElementById('afNext');
  const afDotsWrap = document.getElementById('afDots');

  let afIdx = 0;

  function renderDots(){
    if (!afDotsWrap) return;
    afDotsWrap.innerHTML = '';
    afSlides.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'dot' + (i === afIdx ? ' active' : '');
      d.addEventListener('click', () => go(i));
      afDotsWrap.appendChild(d);
    });
  }

  function go(i){
    afIdx = (i + afSlides.length) % afSlides.length;
    afTrack.style.transform = `translateX(-${afIdx * 100}%)`;
    renderDots();
  }

  afPrev?.addEventListener('click', () => go(afIdx - 1));
  afNext?.addEventListener('click', () => go(afIdx + 1));

  renderDots();
  setInterval(() => go(afIdx + 1), 6000);
})();
