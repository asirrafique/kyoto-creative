/** Enhance the captured hero's controls without changing its GSAP Flip animation. */
export function installHeroVideoControls() {
  const previewSelector = 'div[class*="HeroVideo_video"]';
  const closeSelector = 'button[class*="HeroVideo_icon"]';
  const initialized = new WeakSet();

  function initialize() {
    document.querySelectorAll(previewSelector).forEach(preview => {
      if (initialized.has(preview)) return;
      initialized.add(preview);
      const close = preview.parentElement.querySelector(closeSelector);
      const update = () => {
        const expanded = preview.dataset.fullscreen === 'true';
        preview.tabIndex = 0;
        preview.setAttribute('role', 'button');
        preview.setAttribute('aria-label', expanded ? 'Close showreel' : 'Play KOTA showreel');
        preview.setAttribute('aria-expanded', String(expanded));
        if (close) {
          close.setAttribute('aria-label', 'Close showreel');
          close.tabIndex = expanded ? 0 : -1;
        }
        const video = preview.querySelector('video');
        if (video) {
          video.preload = 'auto';
          video.playsInline = true;
        }
      };
      update();
      new MutationObserver(update).observe(preview, {
        attributes: true, attributeFilter: ['data-fullscreen'], childList: true, subtree: true,
      });
    });
  }

  // The original cross is decorative and passes pointer events to the video.
  // Make it a real operable control, keeping its position, appearance and timing.
  const style = document.createElement('style');
  style.textContent = 'body:has(' + previewSelector + '[data-fullscreen="true"]) ' + closeSelector + '{pointer-events:auto!important}';
  document.head.appendChild(style);

  document.addEventListener('click', event => {
    const close = event.target.closest && event.target.closest(closeSelector);
    if (!close) return;
    const preview = document.querySelector(previewSelector + '[data-fullscreen="true"]');
    if (!preview) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    preview.click();
  }, true);

  document.addEventListener('keydown', event => {
    const fullscreen = document.querySelector(previewSelector + '[data-fullscreen="true"]');
    if (event.key === 'Escape' && fullscreen) {
      event.preventDefault();
      fullscreen.click();
    } else if ((event.key === 'Enter' || event.key === ' ') && event.target.matches(previewSelector)) {
      event.preventDefault();
      event.target.click();
    }
  });

  // Also initialize when the homepage arrives through React client navigation.
  new MutationObserver(initialize).observe(document.documentElement, { childList: true, subtree: true });
  initialize();
}
