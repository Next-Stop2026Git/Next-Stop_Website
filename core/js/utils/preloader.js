export function runPreloaderSequence() {
  const preloader = document.getElementById('main-preloader');
  if (!preloader) return;

  const plane = document.getElementById('icon-plane');
  const ship = document.getElementById('icon-ship');
  const bar = document.getElementById('preloader-bar');
  const percentText = document.getElementById('preloader-percent');

  document.body.classList.add('is-loading');

  const TOTAL_DURATION = 1800;
  let startTime = null;
  let animationFrameId = null;

  function hide() {
    preloader.classList.add('is-hidden');
    document.body.classList.remove('is-loading');
    document.dispatchEvent(new CustomEvent('preloader:complete'));
    preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
  }

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    let progress = Math.min((elapsed / TOTAL_DURATION) * 100, 100);

    if (bar) bar.style.width = `${progress}%`;
    if (percentText) percentText.textContent = `${Math.floor(progress)}%`;

    if (progress >= 50 && plane && ship && plane.classList.contains('active')) {
      plane.classList.remove('active');
      ship.classList.add('active');
    }

    if (progress < 100) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      setTimeout(hide, 250);
    }
  }

  animationFrameId = requestAnimationFrame(animate);
}