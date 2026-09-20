/* faq.js
   Acordeón de preguntas frecuentes: un solo panel abierto a la vez.
   Solo alterna clases/atributos — la animación de altura la resuelve
   el CSS con grid-template-rows, no hay medición de scrollHeight aquí.

   Exportada para invocación manual desde el script de la página,
   después de que Promise.all() haya inyectado faq.html — nunca
   envuelta en DOMContentLoaded. */

export function initFaqAccordion() {
  // Escopado a .faq: evita tocar acordeones de otras secciones si algún
  // día hay más de uno en la misma página.
  const items = document.querySelectorAll('.faq .faq-item');

  if (items.length === 0) {
    console.warn('[faq.js] No se encontraron .faq-item dentro de .faq — ¿se llamó antes de inyectar faq.html?');
    return;
  }

  const closeItem = (item) => {
    item.classList.remove('is-open');
    item.querySelector('.faq-item__trigger')?.setAttribute('aria-expanded', 'false');
  };

  const openItem = (item) => {
    item.classList.add('is-open');
    item.querySelector('.faq-item__trigger')?.setAttribute('aria-expanded', 'true');
  };

  items.forEach((item) => {
    const trigger = item.querySelector('.faq-item__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');

      // Acordeón de un solo panel: cierra los demás antes de decidir este.
      items.forEach((other) => {
        if (other !== item) closeItem(other);
      });

      wasOpen ? closeItem(item) : openItem(item);
    });
  });
}