/** Start decorative project loops near the viewport, preserving their source/crop. */
export function installMediaScheduling() {
  const observed = new Set();
  const nearby = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const { target: video, isIntersecting } of entries) {
      if (isIntersecting) {
        nearby.add(video);
        if (!document.hidden) video.play().catch(() => {});
      } else {
        nearby.delete(video);
        video.pause();
      }
    }
  }, { rootMargin: '600px 0px' });
  function discover() {
    for (const video of document.querySelectorAll('video[preload="none"][loop]')) {
      if (observed.has(video) || video.autoplay || (!video.muted && !video.defaultMuted)) continue;
      observed.add(video);
      observer.observe(video);
    }
    for (const video of observed) {
      if (!video.isConnected) { observed.delete(video); nearby.delete(video); observer.unobserve(video); }
    }
  }
  document.addEventListener('visibilitychange', () => {
    for (const video of nearby) {
      if (document.hidden) video.pause();
      else video.play().catch(() => {});
    }
  });
  new MutationObserver(discover).observe(document.documentElement, { childList: true, subtree: true });
  discover();
}
