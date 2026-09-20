/* offices.js
   Carga perezosa de los mapas embebidos de la sección Oficinas: cada
   iframe solo obtiene su src real cuando su tarjeta entra en el
   viewport, y se desvanece sobre el esqueleto animado cuando termina
   de cargar (evento 'load').

   Exportada para invocación manual desde el script de la página,
   después de que Promise.all() haya inyectado offices.html — nunca
   envuelta en DOMContentLoaded. */

export function initOfficesMaps() {
  // Escopado a .offices: evita tocar mapas o iframes de otras secciones.
  const mapContainers = document.querySelectorAll('.offices [data-office-map]');

  if (mapContainers.length === 0) {
    console.warn('[offices.js] No se encontraron mapas dentro de .offices — ¿se llamó antes de inyectar offices.html?');
    return;
  }

  const loadMap = (container) => {
    const iframe = container.querySelector('.office-card__map-frame');
    const skeleton = container.querySelector('.office-card__map-skeleton');

    if (!iframe) return;

    if (!iframe.dataset.src) {
      iframe.classList.add('is-loaded');
      if (skeleton) skeleton.remove();
      return;
    }

    if (!iframe.src && iframe.dataset.src) {
      iframe.addEventListener(
        'load',
        () => {
          iframe.classList.add('is-loaded');
          if (skeleton) skeleton.remove();
        },
        { once: true },
      );

      iframe.src = iframe.dataset.src;
    } else {
      iframe.classList.add('is-loaded');
      if (skeleton) skeleton.remove();
    }
  };

  // Sin soporte de IntersectionObserver: carga todo de inmediato
  // en vez de dejar los mapas vacíos para siempre.
  if (!('IntersectionObserver' in window)) {
    mapContainers.forEach(loadMap);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMap(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '200px', // Empieza a cargar un poco antes de ser visible
      threshold: 0.01,
    },
  );

  mapContainers.forEach((el) => observer.observe(el));
}