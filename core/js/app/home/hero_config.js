/* ==========================================================================
   hero-config.js
   ========================================================================== */

const ANIMATION_DURATION = 1500;

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function animateCounter(el) {
  const target = Number(el.dataset.target);
  if (!Number.isFinite(target)) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    el.textContent = target;
    return;
  }

  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
    const easedProgress = easeOutExpo(progress);

    el.textContent = Math.round(target * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(tick);
}

export function initHeroStats() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  if (!('IntersectionObserver' in window)) {
    counters.forEach((el) => {
      el.textContent = el.dataset.target;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5, rootMargin: '0px' }
  );

  counters.forEach((el) => observer.observe(el));
}

/**
 * Control Dinámico para la Glass Card de Rastreo
 */
export function initHeroTracking() {
  const trackingCard = document.querySelector('.tracking-card');
  if (!trackingCard) return;

  const statusBadge = trackingCard.querySelector('.status-badge');
  const timelineSteps = Array.from(trackingCard.querySelectorAll('.timeline-step'));
  
  if (!statusBadge || !timelineSteps.length) return;

  const currentStep = trackingCard.querySelector('.timeline-step.status-current');
  const errorStep = trackingCard.querySelector('.timeline-step.status-error');
  const isDone = timelineSteps.every(step => step.classList.contains('status-done'));

  if (errorStep) {
    statusBadge.textContent = 'Retenido en aduana';
    statusBadge.className = 'status-badge badge-error';
  } else if (isDone) {
    statusBadge.textContent = 'Listo para retiro';
    statusBadge.className = 'status-badge badge-success';
  } else if (currentStep) {
    statusBadge.textContent = 'En tránsito';
    statusBadge.className = 'status-badge badge-warning';
  } else {
    statusBadge.textContent = 'Pendiente';
    statusBadge.className = 'status-badge'; 
  }
}

/**
 * Rotación Automática Autónoma para la Glass Card de Reseñas (Basada en Diapositivas HTML)
 */
export function initHeroReviews() {
  const carousels = document.querySelectorAll('[data-carousel="reviews"]');
  if (!carousels || !carousels.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DISPLAY_TIME = 4500; // 4.5s por reseña

  carousels.forEach((container) => {
    const slides = Array.from(container.querySelectorAll('.review-slide'));
    if (!slides.length) return;

    let currentIndex = slides.findIndex((slide) => slide.classList.contains('active'));
    if (currentIndex === -1) {
      currentIndex = 0;
      slides[0].classList.add('active');
    }

    let timerId = null;
    let isPaused = false;

    // Si el usuario prefiere movimiento reducido, no iniciamos la animación automática
    if (prefersReduced) return;

    function showSlide(index) {
      // Ocultar slide actual
      slides[currentIndex].classList.remove('active');
      // Calcular siguiente índice (soporta valores negativos para las flechas)
      currentIndex = (index + slides.length) % slides.length;
      // Mostrar nuevo slide
      slides[currentIndex].classList.add('active');
    }

    function scheduleNext() {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        showSlide(currentIndex + 1);
        scheduleNext();
      }, DISPLAY_TIME);
    }

    function pause() {
      if (isPaused) return;
      isPaused = true;
      clearTimeout(timerId);
    }

    function resume() {
      if (!isPaused) return;
      isPaused = false;
      scheduleNext();
    }

    // Pausar en hover / foco para mejorar UX
    container.addEventListener('mouseenter', pause, { passive: true });
    container.addEventListener('mouseleave', resume, { passive: true });
    container.addEventListener('focusin', pause);
    container.addEventListener('focusout', resume);

    // Navegación con teclado (Flecha Izquierda / Derecha)
    container.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowRight') {
        pause();
        showSlide(currentIndex + 1);
      } else if (ev.key === 'ArrowLeft') {
        pause();
        showSlide(currentIndex - 1);
      }
    });

    // Iniciar la rotación
    scheduleNext();
  });
}

export function initHero() {
  initHeroStats();
  initHeroTracking();
  initHeroReviews(); 
}