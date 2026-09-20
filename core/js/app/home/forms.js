/* ==========================================================================
   booking-logic.js
   ========================================================================== */

/**
 * Activa o desactiva el formulario dependiendo de si el vuelo sigue abierto.
 * @param {boolean} isOpen - true si el timer sigue activo, false si ya terminó.
 */
export function toggleBookingForm(isOpen) {
  const activeForm = document.getElementById('booking-active-state');
  const closedMessage = document.getElementById('booking-closed-state');

  if (!activeForm || !closedMessage) return;

  if (isOpen) {
    activeForm.style.display = 'block';
    closedMessage.style.display = 'none';
  } else {
    activeForm.style.display = 'none';
    closedMessage.style.display = 'block';
  }
}

/**
 * Intercepta el envío del formulario para enviarlo a Tally/Webhook sin recargar la página,
 * y actualiza automáticamente la barra de capacidad de cupos.
 */
export function initBookingForm() {
  const form = document.getElementById('nextstop-booking-form');
  const msgEl = document.getElementById('form-message');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    
    // 1. Estado de carga visual
    btn.textContent = 'Procesando reserva...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    msgEl.textContent = ''; 

    try {
      // Preparamos los datos
      const formData = new FormData(form);
      
      // 2. Envío en segundo plano (Fetch)
      const response = await fetch(form.action, {
        method: form.method || 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // 3. Éxito: Mensaje y reseteo
        msgEl.textContent = "¡Paquete registrado exitosamente!";
        msgEl.style.color = "var(--color-success, #4ade80)";
        form.reset();

        // ===================================================================
        // 4. AUTOMATIZACIÓN DE LA BARRA: 
        // Disparamos la alerta que escucha event-timer.js para sumar un cupo
        // ===================================================================
        const payload = Object.fromEntries(formData.entries());
        window.dispatchEvent(new CustomEvent('nextstop:package-registered', {
          detail: payload 
        }));

      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('[Booking Error]:', error);
      msgEl.textContent = "Hubo un error al registrar. Revisa tu conexión o intenta de nuevo.";
      msgEl.style.color = "var(--color-error, #f87171)";
    } finally {
      // Restauramos el botón
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
      
      // Limpiamos el mensaje de éxito después de 5 segundos
      if (msgEl.style.color === "var(--color-success, #4ade80)") {
         setTimeout(() => {
            msgEl.textContent = '';
         }, 5000);
      }
    }
  });
}