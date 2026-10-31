/** File downloads and cross-page routes must use native browser navigation rather than Next.js's captured router transition. */
export function installLinkControls() {
  document.addEventListener('click', event => {
    const anchor = event.target.closest && event.target.closest('a[href]');
    if (!anchor) return;
    const rawHref = anchor.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:')) return;
    const destination = new URL(rawHref, location.href);
    const originalSite = destination.hostname === 'kota.co.uk';
    if (originalSite) {
      destination.host = location.host;
      destination.protocol = location.protocol;
      anchor.href = destination.href;
    }
    if (destination.origin !== location.origin) return;
    if (destination.pathname === '/work/') {
      destination.pathname = '/work';
      anchor.href = destination.pathname + destination.search + destination.hash;
    }
    if (/\.(?:zip|pdf)$/i.test(destination.pathname)) {
      // Keep the native default action but bypass the captured Link component's
      // route transition, which otherwise leaves its loading cover over the page.
      if (/\.zip$/i.test(destination.pathname)) anchor.download = destination.pathname.split('/').pop();
      event.stopImmediatePropagation();
    } else if (originalSite || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target === '_blank') {
      event.stopImmediatePropagation();
    } else if (destination.pathname !== location.pathname) {
      // Internal page route transitions must use standard browser navigation.
      // Next.js App Router client transition (router.push) fails on static replica pages
      // with "Error: Connection closed" / "Application error: a client-side exception has occurred",
      // trapping the user on the current URL.
      event.stopImmediatePropagation();
    }
  }, true);
}
