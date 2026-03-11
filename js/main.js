/* ============================================================
   main.js — Lógica principal de la landing page
   - Scroll reveal con IntersectionObserver
   - Navbar scroll effect
   - Smooth scroll para anclas
   - Service Worker (solo HTTP/HTTPS)
   ============================================================ */

'use strict';

/* ══════════════════════════════════════
   1. SCROLL REVEAL
══════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(
            () => entry.target.classList.add('visible'),
            i * 80
          );
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════
   2. NAVBAR SCROLL EFFECT
══════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ══════════════════════════════════════
   3. SMOOTH SCROLL para anclas internas
══════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.querySelector('nav')?.offsetHeight || 80;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
}

/* ══════════════════════════════════════
   4. SERVICE WORKER (PWA)
   ⚠️  Solo funciona en HTTP/HTTPS.
   En file:// se omite silenciosamente.
══════════════════════════════════════ */
function registerSW() {
  const protocol = window.location.protocol;

  if (protocol !== 'http:' && protocol !== 'https:') {
    console.info('[SW] Omitido: requiere servidor HTTP. Funcionará en Netlify.');
    return;
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then(reg => console.log('[SW] Registrado:', reg.scope))
        .catch(err => console.warn('[SW] Error:', err));
    });
  }
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavbar();
  initSmoothScroll();
  registerSW();
});
