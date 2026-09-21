import { initHeroStats } from './hero_config.js';
export function initHeroReviews() {
  const reviewContainer = document.querySelector('.hero-reviews');
  if (!reviewContainer) return;
}
import { initAboutAnimations } from './about-config.js';
import { initOfficesMaps } from './offices.js';
import { initFaqAccordion } from './faq.js';


// En entornos de módulos de ES6, el código ya espera a que el DOM 
// esté listo. Ejecutamos las inicializaciones directamente.

initHeroStats();
initHeroReviews();
initAboutAnimations();
initOfficesMaps();
initFaqAccordion();
