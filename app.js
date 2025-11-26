// Año dinámico (si existe el span)
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Carrusel del hero (autoplay seguro)
const heroImgs = document.querySelectorAll('.hero-slides img');
let heroIdx = 0;
if (heroImgs.length) {
  setInterval(() => {
    heroImgs[heroIdx].classList.remove('active');
    heroIdx = (heroIdx + 1) % heroImgs.length;
    heroImgs[heroIdx].classList.add('active');
  }, 4000);
}

// Carrusel de EVENTOS
const track = document.getElementById('eventosTrack');
const slides = Array.from(track ? track.children : []);
const prev = document.getElementById('evPrev');
const next = document.getElementById('evNext');
const dotsWrap = document.getElementById('evDots');
let idx = 0;

function renderDots(){
  if(!dotsWrap) return;
  dotsWrap.innerHTML = '';
  slides.forEach((_,i)=>{
    const d = document.createElement('div');
    d.className = 'dot'+(i===idx?' active':'');
    d.addEventListener('click',()=>go(i));
    dotsWrap.appendChild(d);
  });
}
function go(i){
  if(!track || !slides.length) return;
  idx = (i + slides.length) % slides.length;
  track.style.transform = `translateX(-${idx*100}%)`;
  renderDots();
}
if(prev && next && slides.length){
  prev.addEventListener('click',()=>go(idx-1));
  next.addEventListener('click',()=>go(idx+1));
  renderDots();
  setInterval(()=>go(idx+1), 5000);
}

// ===== Footer: mapa y formulario =====
(() => {
  const LAT = '19.52627344151608';
  const LNG = '-96.89595757467613';

  // Mapa (sin API key)
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

  // Formulario del footer → WhatsApp
  const footerForm = document.getElementById('footerForm');
  if (footerForm) {
    footerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('fNombre').value.trim();
      const correo = document.getElementById('fCorreo').value.trim();
      const asunto = document.getElementById('fAsunto').value.trim();
      if(!nombre || !correo || !asunto) return;

      const mensaje = `Hola, soy ${nombre}. ${asunto}. Mi correo es: ${correo}.`;
      const phone = '522289881856'; // WhatsApp CMIC Veracruz Centro
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');
    });
  }
})();

// ====== Coverflow Damas CMIC ======
(() => {
  const stage = document.getElementById('cfDamas');
  if (!stage) return;

  const cards = Array.from(stage.querySelectorAll('.cf-card'));
  const prev = stage.parentElement.querySelector('.cf-prev');
  const next = stage.parentElement.querySelector('.cf-next');
  const titleEl = stage.parentElement.querySelector('.cf-title');
  const subEl = stage.parentElement.querySelector('.cf-sub');

  let idx = Math.floor(cards.length / 2); // inicia centrado
  const gapX = 90;          // separación horizontal
  const rotY = -22;         // rotación lateral
  const scaleStep = 0.12;   // escala por lado
  const depth = 160;        // desplazamiento Z

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

      card.classList.toggle('is-center', delta === 0);
      card.classList.toggle('is-left', delta < 0);
      card.classList.toggle('is-right', delta > 0);
    });

    // Actualiza etiquetas
    const c = cards[idx];
    titleEl.textContent = c?.dataset.title || '';
    subEl.textContent   = c?.dataset.sub || '';
  }

  function go(n) {
    idx = (n + cards.length) % cards.length;
    paint();
  }

  // Botones
  prev?.addEventListener('click', () => go(idx - 1));
  next?.addEventListener('click', () => go(idx + 1));

  // Teclado
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  go(idx - 1);
    if (e.key === 'ArrowRight') go(idx + 1);
  });

  // Drag / touch
  let startX = null;
  stage.addEventListener('pointerdown', e => { startX = e.clientX; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointerup',   e => {
    if (startX == null) return;
    const dx = e.clientX - startX;
    if (dx > 40) go(idx - 1);
    if (dx < -40) go(idx + 1);
    startX = null;
  });

  // Autoplay opcional (descomenta si lo quieres):
  // setInterval(() => go(idx + 1), 5000);

  // ==== Inicio centrado cuando las imágenes estén listas ====
  let imgsCargadas = 0;
  const totalImgs = cards.length;
  let fallback = setTimeout(() => paint(), 1500);

  cards.forEach((card) => {
    const img = card.querySelector('img');
    if (!img) {
      imgsCargadas++;
      return;
    }

    if (img.complete) {
      imgsCargadas++;
      if (imgsCargadas === totalImgs) {
        clearTimeout(fallback);
        paint();
      }
    } else {
      img.addEventListener('load', () => {
        imgsCargadas++;
        if (imgsCargadas === totalImgs) {
          clearTimeout(fallback);
          paint();
        }
      });
      img.addEventListener('error', () => {
        imgsCargadas++;
        if (imgsCargadas === totalImgs) {
          clearTimeout(fallback);
          paint();
        }
      });
    }
  });

  if (imgsCargadas === totalImgs) {
    clearTimeout(fallback);
    paint();
  }
})();

/* ==== Carrusel Cards CMIC (debajo de Maestrías) ==== */
/* 1) Edita aquí tus tarjetas: href = enlace destino, img = link de la imagen */
const CC_CARDS = [
  {
    title: "Maestría en Administración de la Construcción",
    meta: "Modalidad: ONLINE",
    href: "https://itc-ac.edu.mx/maestria-en-administracion-de-la-construccion/",
    img:  "https://i.pinimg.com/736x/4b/95/81/4b9581cd47f11be317d1e424312a2b49.jpg"
  },
  {
    title: "Maestría en construcción",
    meta: "Modalidad: ONLINE",
    href: "https://itc-ac.edu.mx/maestria-en-construccion/",
    img:  "https://i.pinimg.com/736x/4a/b2/c4/4ab2c41162b1b922ad9b36152ca75b29.jpg"  
  },
  {
    title: "Maestría en Eficiencia Energética, Transporte y Almacenamiento de Hidrocarburos",
    meta: "Modalidad: ONLINE",
    href: "https://itc-ac.edu.mx/maestria-en-eficiencia-energetica-transporte-almacenamiento-hidrocarburos/",
    img:  "https://i.pinimg.com/736x/3e/0b/ab/3e0babd1d03f06028d5e9c35f0f9c133.jpg"
  },
  {
    title: "Maestría en Eficiencia y Sostenibilidad en Sistemas Energéticos",
    meta: "Modalidad: ONLINE",
    href: "https://itc-ac.edu.mx/maestria-en-eficiencia-y-sostenibilidad-en-sistemas-energeticos/",
    img:  "https://i.pinimg.com/736x/7d/0d/8f/7d0d8f18cca411fc3d29a2bef858e0b0.jpg"
  }
];

(function cardsCarousel(){
  const viewport = document.getElementById("ccViewport");
  const prevBtn  = document.getElementById("ccPrev");
  const nextBtn  = document.getElementById("ccNext");
  if (!viewport) return;

  const AUTOPLAY = true;
  const INTERVALO_MS = 4200;
  let timer = null;

  const track = document.createElement("div");
  track.className = "cc-track";
  viewport.appendChild(track);

  const els = [];
  CC_CARDS.forEach((c) => {
    const card = document.createElement("article");
    card.className = "cc-card";

    const link = document.createElement("a");
    link.href = c.href || "#";
    link.target = "_blank";
    link.rel = "noopener";

    const img = document.createElement("img");
    img.src = c.img;
    img.alt = c.title || "CMIC";
    img.loading = "lazy";
    img.addEventListener("load", ajustarAltura);

    const overlay = document.createElement("div");
    overlay.className = "cc-overlay";

    const content = document.createElement("div");
    content.className = "cc-content";
    content.innerHTML = `
      <h3 class="cc-title">${c.title || ""}</h3>
      <div class="cc-meta">${c.meta || ""}</div>
      <span class="cc-btn">Ver más →</span>
    `;

    link.appendChild(img);
    card.appendChild(link);
    card.appendChild(overlay);
    card.appendChild(content);
    track.appendChild(card);
    els.push(card);
  });

  let current = 0;

  function setPos(el, x, scale){
    if (!el) return;
    el.style.transform = `translate(-50%,-50%) translateX(${x}px) scale(${scale})`;
  }

  function layout(){
    els.forEach(el => el.className = "cc-card");

    const total = els.length;
    const idx = i => (i + total) % total;

    const center = els[current];
    const prev1  = els[idx(current - 1)];
    const prev2  = els[idx(current - 2)];
    const next1  = els[idx(current + 1)];
    const next2  = els[idx(current + 2)];

    center.classList.add("active");
    prev1.classList.add("prev1"); prev2.classList.add("prev2");
    next1.classList.add("next1"); next2.classList.add("next2");

    const baseW = center.clientWidth || 320;
    const gap = Math.max(220, Math.round(baseW * 0.75));

    setPos(center,   0,   1.00);
    setPos(prev1, -gap,  .94);
    setPos(prev2, -gap*2,.88);
    setPos(next1,  gap,  .94);
    setPos(next2,  gap*2,.88);

    ajustarAltura();
  }

  function ajustarAltura(){
    const img = els[current]?.querySelector("img");
    if (!img) return;
    const trySet = () => {
      const h = img.clientHeight;
      if (h > 0) viewport.style.height = h + "px";
      else requestAnimationFrame(trySet);
    };
    trySet();
  }

  function siguiente(){ current = (current + 1) % els.length; layout(); }
  function anterior(){ current = (current - 1 + els.length) % els.length; layout(); }

  prevBtn?.addEventListener("click", () => { anterior(); reiniciar(); });
  nextBtn?.addEventListener("click", () => { siguiente(); reiniciar(); });
  window.addEventListener("resize", () => { layout(); });

  function iniciar(){ if (AUTOPLAY){ detener(); timer = setInterval(siguiente, INTERVALO_MS); } }
  function detener(){ if (timer){ clearInterval(timer); timer = null; } }
  function reiniciar(){ detener(); iniciar(); }

  layout();
  iniciar();
})();

// ====== OMV: botones que despliegan definición ======
(() => {
  const cards = document.querySelectorAll('.omv-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const btn = card.querySelector('.omv-btn');
    const text = card.querySelector('.omv-text');
    const definition = card.dataset.text;

    btn.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      
      // Cierra todos los demás
      cards.forEach(c => c.classList.remove('active'));

      // Si no estaba activo, ábrelo
      if (!isActive) {
        card.classList.add('active');
        text.textContent = `"${definition}"`;
      } else {
        text.textContent = "";
      }
    });
  });
})();
 // Efecto ripple exclusivo del botón CMIC ICIC
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-cursos-icic");

  if (btn) {
    btn.addEventListener("click", function(e) {
      const circle = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = size + "px";
      circle.style.left = (e.clientX - rect.left - size / 2) + "px";
      circle.style.top = (e.clientY - rect.top - size / 2) + "px";
      circle.className = "ripple";

      const ripple = this.querySelector(".ripple");
      if (ripple) ripple.remove();

      this.appendChild(circle);
    });
  }
});
// Animación suave al hacer clic en el botón "Ir al formulario"
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".btn-afiliate");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(btn.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
