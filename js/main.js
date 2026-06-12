/* ============================================================
   Giulia Sorrentino Interiors — Main JS
   ============================================================ */

// ── Navigation ──────────────────────────────────────────────

const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.nav__hamburger');
const mobileMenu = document.querySelector('.nav__mobile');

if (nav) {
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Mark active nav link
(function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const isHome = (path === '/' || path.endsWith('index.html')) && (href === 'index.html' || href === '/');
    const isMatch = !isHome && href !== '' && href !== 'index.html' && path.includes(href.replace('../', '').replace('.html', ''));
    if (isHome || isMatch) a.classList.add('active');
  });
})();

// ── Scroll Fade-In Animations ────────────────────────────────

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ── Lightbox ─────────────────────────────────────────────────

let lightboxImages = [];
let lightboxIndex = 0;

function buildLightbox() {
  const existing = document.getElementById('lightbox');
  if (existing) return;

  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lightbox__close" aria-label="Chiudi">&times;</button>
    <button class="lightbox__prev" aria-label="Precedente">&#8592;</button>
    <img class="lightbox__img" src="" alt="" />
    <button class="lightbox__next" aria-label="Successivo">&#8594;</button>
    <div class="lightbox__counter"></div>
  `;
  document.body.appendChild(lb);

  lb.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
  lb.querySelector('.lightbox__prev').addEventListener('click', () => navigateLightbox(-1));
  lb.querySelector('.lightbox__next').addEventListener('click', () => navigateLightbox(1));

  lb.addEventListener('click', e => {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function openLightbox(images, index) {
  buildLightbox();
  lightboxImages = images;
  lightboxIndex = index;
  const lb = document.getElementById('lightbox');
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
  showLightboxImage();
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function navigateLightbox(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  showLightboxImage();
}

function showLightboxImage() {
  const lb = document.getElementById('lightbox');
  const img = lb.querySelector('.lightbox__img');
  const counter = lb.querySelector('.lightbox__counter');
  img.style.opacity = '0';
  img.src = lightboxImages[lightboxIndex].src;
  img.alt = lightboxImages[lightboxIndex].alt || '';
  img.onload = () => { img.style.transition = 'opacity 0.25s ease'; img.style.opacity = '1'; };
  counter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

// Init gallery lightboxes
(function initGalleries() {
  const galleries = document.querySelectorAll('.project-gallery, .gallery-section');
  galleries.forEach(gallery => {
    const imgs = gallery.querySelectorAll('.gallery-img img');
    const srcs = Array.from(imgs).map(img => ({ src: img.src, alt: img.alt }));

    imgs.forEach((img, i) => {
      img.parentElement.addEventListener('click', () => openLightbox(srcs, i));
    });
  });
})();

// ── Page transitions ─────────────────────────────────────────

(function initPageTransitions() {
  const overlay = document.createElement('div');
  overlay.className = 'page-overlay';
  document.body.appendChild(overlay);

  // Fade in on load
  window.addEventListener('load', () => {
    overlay.classList.remove('active');
  });

  // Fade out on internal link click
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => { window.location.href = href; }, 350);
    });
  });
})();

// ── Contact Form (Netlify) ───────────────────────────────────

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(contactForm);
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
      if (res.ok) {
        contactForm.style.display = 'none';
        const success = document.getElementById('form-success');
        if (success) success.style.display = 'block';
      }
    } catch (err) {
      console.error('Form error:', err);
    }
  });
}
