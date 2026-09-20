/**
 * Inicializa el carrusel de testimonios.
 * Llama a esta función después de que el HTML de "Sobre Nosotros" se haya cargado en el DOM.
 */
function initTestimonialCarousel() {
  const track = document.getElementById('testimonialTrack');
  const btnPrev = document.querySelector('.btn-prev');
  const btnNext = document.querySelector('.btn-next');

  // Si no encuentra el track, salimos para evitar errores en otras páginas
  if (!track || !btnPrev || !btnNext) return;

  // Función para mover el carrusel
  const scrollAmount = () => {
    // Tomamos el ancho de la primera tarjeta + el gap (32px = 2rem en CSS)
    const cardElement = track.querySelector('.testimonial-card');
    if (!cardElement) return 0;
    
    // Obtenemos el gap computado dinámicamente
    const gap = parseFloat(window.getComputedStyle(track).gap) || 32; 
    return cardElement.offsetWidth + gap;
  };

  // Evento Siguiente
  btnNext.addEventListener('click', () => {
    track.scrollBy({
      left: scrollAmount(),
      behavior: 'smooth'
    });
  });

  // Evento Anterior
  btnPrev.addEventListener('click', () => {
    track.scrollBy({
      left: -scrollAmount(),
      behavior: 'smooth'
    });
  });
}

// EJEMPLO DE USO:
// Si usas un evento normal al cargar la página:
document.addEventListener('DOMContentLoaded', initTestimonialCarousel);

// Si usas inyección dinámica (como tu app.js), asegúrate de llamar a `initTestimonialCarousel()` justo debajo de tu console.log("[App] ✓ Estructura renderizada con éxito.")