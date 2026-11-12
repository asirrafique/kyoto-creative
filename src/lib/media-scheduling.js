/** Start decorative project loops near the viewport, preserving their source/crop. */
export function installMediaScheduling() {
  const videoSources = [
    
    
    
    
    
  ];

  function ensureSources() {
    for (const { selector, src } of videoSources) {
      const videos = document.querySelectorAll(selector);
      for (const video of videos) {
        if (!video.src && !video.querySelector('source')) {
          video.src = src;
          video.muted = true;
          video.defaultMuted = true;
          video.loop = true;
          video.playsInline = true;
          video.play().catch(() => {});
        }
      }
    }
  }

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
  }, { rootMargin: '100px 0px' });

  function discover() {
    ensureSources();
    for (const video of document.querySelectorAll('video')) {
      if (observed.has(video)) continue;
      observed.add(video);
      observer.observe(video);
      if (video.parentElement && video.getBoundingClientRect().top < window.innerHeight) {
        video.play().catch(() => {});
      }
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', discover);
  } else {
    discover();
  }

  new MutationObserver(discover).observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(discover, 100);
  setTimeout(discover, 500);
  setTimeout(discover, 1000);
}
