/* about.js
   Revela con fade-up el texto y las tarjetas de la sección About.
   IMPORTANTE: esta función se exporta y debe llamarse MANUALMENTE desde
   home/app.js, después de que Promise.all() haya inyectado about.html —
   nunca envuelta en DOMContentLoaded (ese evento ya pasó para cuando el
   fetch() del componente resuelve, y #about-container seguiría vacío). */

export function initAboutAnimations() {
  const animatedElements = Array.from(document.querySelectorAll('.fade-up'));

  if (!animatedElements.length) {
    console.warn('[about.js] No se encontraron elementos .fade-up — ¿se llamó antes de inyectar about.html?');
    return;
  }

  if (document.body.dataset.aboutAnimationsReady === 'true') {
    return;
  }

  document.body.dataset.aboutAnimationsReady = 'true';

  const revealElement = (element) => {
    if (!(element instanceof HTMLElement) || element.classList.contains('is-visible')) return;
    element.classList.add('is-visible');
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  };

  const revealVisibleElements = () => {
    const viewportOffset = window.innerHeight * 0.22;
    animatedElements.forEach((element) => {
      if (!(element instanceof HTMLElement)) return;
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight + viewportOffset) {
        revealElement(element);
      }
    });
  };

  if (!('IntersectionObserver' in window)) {
    revealVisibleElements();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    },
  );

  animatedElements.forEach((el) => {
    if (el instanceof HTMLElement) observer.observe(el);
  });

  requestAnimationFrame(() => {
    revealVisibleElements();
  });
}