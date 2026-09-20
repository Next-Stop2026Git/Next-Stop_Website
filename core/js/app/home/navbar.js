/* navbar.js
   Lógica del navbar de Next Stop: estado de scroll (glass + auto-hide),
   menú móvil, y dropdown "Más". */

const DESKTOP_BREAKPOINT = '(min-width: 992px)'; // Debe coincidir con navbar.css (max-width: 991px)

export function initNavbar() {
  // Blindaje contra reinicializaciones duplicadas: si initNavbar() llega a
  // ejecutarse dos veces en la misma carga de página, evita acumular
  // listeners de scroll/click/teclado (causa típica de dropdowns que se
  // abren y cierran solos, o scroll errático).
  if (window.navbarInitialized) return;
  window.navbarInitialized = true;

  const navbar = document.getElementById('site-navbar');
  if (!navbar) return;

  const burgerBtn = document.getElementById('navbar-burger');
  const mobileMenu = document.getElementById('navbar-mobile-menu');
  const moreTrigger = document.getElementById('navbar-more-trigger');
  const morePanel = document.getElementById('navbar-more-panel');

  // ------------------------------------------------------------
  // 1. Estado de scroll: fondo cristal + auto-hide
  // ------------------------------------------------------------
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateNavbarState = () => {
    const currentScrollY = window.scrollY;

    // Fondo cristal al superar 50px
    navbar.classList.toggle('navbar--solid', currentScrollY > 50);

    // Ocultar al bajar, mostrar al subir (nunca mientras el menú móvil está abierto)
    const shouldHide =
      currentScrollY > lastScrollY &&
      currentScrollY > 100 &&
      !(mobileMenu && mobileMenu.classList.contains('is-open'));

    navbar.classList.toggle('navbar--hidden', shouldHide);

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbarState);
        ticking = true;
      }
    },
    { passive: true },
  );

  // ------------------------------------------------------------
  // 2. Menú móvil (hamburguesa)
  // ------------------------------------------------------------
  const closeMobileMenu = () => {
    if (!mobileMenu || !mobileMenu.classList.contains('is-open')) return;
    mobileMenu.classList.remove('is-open');
    burgerBtn?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  if (burgerBtn && mobileMenu) {
    const toggleMobileMenu = () => {
      const isOpen = mobileMenu.classList.contains('is-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        mobileMenu.classList.add('is-open');
        burgerBtn.setAttribute('aria-expanded', 'true');
        document.body.classList.add('no-scroll');
      }
    };

    burgerBtn.addEventListener('click', toggleMobileMenu);

    // Cerrar al tocar cualquier enlace interno
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Si el viewport cruza a escritorio con el menú móvil abierto
    // (rotar tablet, redimensionar ventana), ciérralo — si no, queda
    // flotando sobre el layout de escritorio sin forma de cerrarlo.
    const desktopQuery = window.matchMedia(DESKTOP_BREAKPOINT);
    desktopQuery.addEventListener('change', (event) => {
      if (event.matches) closeMobileMenu();
    });
  }

  // ------------------------------------------------------------
  // 3. Dropdown "Más" (escritorio, con soporte táctil/teclado)
  // ------------------------------------------------------------
  if (moreTrigger && morePanel) {
    const closeDropdown = () => {
      moreTrigger.setAttribute('aria-expanded', 'false');
      morePanel.classList.remove('is-open');
    };

    moreTrigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const isExpanded = moreTrigger.getAttribute('aria-expanded') === 'true';
      moreTrigger.setAttribute('aria-expanded', String(!isExpanded));
      morePanel.classList.toggle('is-open');
    });

    document.addEventListener('click', (event) => {
      if (!morePanel.contains(event.target) && !moreTrigger.contains(event.target)) {
        closeDropdown();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;

      if (morePanel.classList.contains('is-open')) {
        closeDropdown();
        moreTrigger.focus();
        return;
      }

      // Escape también cierra el menú móvil si está abierto
      if (mobileMenu && mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
        burgerBtn?.focus();
      }
    });
  }

  // Lectura inicial por si la página carga con scroll a la mitad
  updateNavbarState();
}