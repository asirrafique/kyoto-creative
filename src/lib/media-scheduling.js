/** Start decorative project loops near the viewport, preserving their source/crop. */
export function installMediaScheduling() {
  const videoSources = [
    { selector: '.Bento_media1__Zf6n4 video', src: 'https://kota-content.b-cdn.net/app/uploads/2025/04/Square-Rotating-Cube2.mp4' },
    { selector: '.Bento_media2__Z_9Z_ video', src: 'https://kota-content.b-cdn.net/app/uploads/2025/04/Bento-Right2.mp4' },
    { selector: '.Bento_media3__Je_Pc video', src: 'https://kota-content.b-cdn.net/app/uploads/2025/04/Bento-Earth-Spin2.mp4' },
    { selector: '.Bento_media4__xfRDt video', src: 'https://kota-content.b-cdn.net/app/uploads/2025/04/Right-Side-Mobile-Devices5.mp4' },
    { selector: '.Video_loopVideo__1G4By video', src: 'https://kota-content.b-cdn.net/app/uploads/2025/04/All-Pages-3D-2.mp4' },
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
