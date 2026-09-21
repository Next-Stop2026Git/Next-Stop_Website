/* app.js-Motor central de carga de componentes de Next Stop. */
import { runPreloaderSequence } from './preloader.js';
import { initNavbar } from '../app/home/navbar.js';
runPreloaderSequence();

// Carga un fragmento HTML en un contenedor dado por su ID
async function loadComponent(id, path) {
  const container = document.getElementById(id);
  if (!container) {
    console.warn(`[App] Contenedor ID "${id}" no encontrado en el DOM.`);
    return false;
  }
  
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status} en ${path}`);
    
    const html = await response.text();
    const fragment = document.createRange().createContextualFragment(html);
    container.replaceChildren(fragment);
    
    return true;
  } catch (error) {
    console.error(`[App] ✗ Fallo al cargar "${id}":`, error);
    container.replaceChildren();
    
    const msg = document.createElement("p");
    msg.className = "component-error"; 
    msg.style.color = "var(--color-error)";
    msg.textContent = "Error al cargar esta sección.";
    container.append(msg);
    return false;
  }
}

// Componentes globales
const commonComponents = [
  ["navbar-container", "components/navbar/navbar.html"],
  ["footer-container", "components/footer/footer.html"]
];

// Componentes específicos por página
const pageComponents = {
  home: [
    ["hero-container", "pages/home/hero.html"],
    ["about-container", "pages/home/about.html"],
    ["schedules-container", "pages/home/schedules.html"],
    ["services-container", "pages/home/services.html"],
    ["guide-container", "pages/home/center-guide.html"],
    ["offices-container", "pages/home/offices.html"],
    ["faq-container", "pages/home/faq.html"],
    ["cta-container", "pages/home/cta.html"],
    ["forms-container", "pages/home/forms.html"],
  ],
  about: [
    ["about-hero-container", "pages/about/about-hero.html"],
    ["about-history-container", "pages/about/our-history.html"],
    ["about-purpose-container", "pages/about/our-purpose.html"],
    ["about-difference-container", "pages/about/difference.html"],
    ["about-testimony-container", "pages/about/testimony.html"],
  ], 
  services: [], 
  "help-center": [
    ["help-center-hero-container", "pages/help-center/help-hero.html"],
  ], 
};

// Script propio de cada página
async function initPageScripts(page) {
  const pageScripts = {
    home: () => import("../app/home/app.js"),
    about: () => import("../app/about/app.js"),
    services: () => import("../app/services/app.js"),
    "help-center": () => import("../app/help-center/app.js"),
  };

  const loadPageScript = pageScripts[page];
  if (!loadPageScript) return;

  try {
    await loadPageScript();
  } catch (error) {
    console.error(`[App] Error cargando scripts de la página "${page}":`, error);
  }
}

// ---- Motor de Inicialización ----
async function init() {
  if (document.readyState === "loading") {
    await new Promise((resolve) =>
      document.addEventListener("DOMContentLoaded", resolve, { once: true }),
    );
  }

  const page = document.body.dataset.page || "home";
  console.log(`[App] 🚀 Iniciando Next Stop - Página: ${page}`);

  // 1. CARGA DEL RESTO EN PARALELO (Navbar, Hero, About, etc.)
  const componentsToLoad = [...commonComponents, ...(pageComponents[page] || [])];
  await Promise.all(componentsToLoad.map(([id, path]) => loadComponent(id, path)));

  // 2. INICIALIZACIÓN JS MANUAL (Una vez que el HTML ya existe en el DOM)
  try {
    initNavbar();
  } catch (error) {
    console.error("[App] Error iniciando navbar:", error);
  }

  // 3. SCRIPTS DE PÁGINA (Animaciones, timers, etc.)
  await initPageScripts(page);
  
  console.log(`[App] ✓ Estructura renderizada con éxito.`);
}

init().catch((error) =>
  console.error("[App] 💥 Error crítico de inicialización:", error),
);