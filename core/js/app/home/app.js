import { initHeroStats } from './hero_config.js';
import { initAboutAnimations } from './about-config.js';
import { initOfficesMaps } from './offices.js';
import { initFaqAccordion } from './faq.js';


// En entornos de módulos de ES6, el código ya espera a que el DOM 
// esté listo. Ejecutamos las inicializaciones directamente.

initHeroStats();
initAboutAnimations();
initOfficesMaps();
initFaqAccordion();
