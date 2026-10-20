/** File downloads must use the browser, rather than React page navigation. */
export function installLinkControls() {
  document.addEventListener('click', event => {
    const anchor = event.target.closest && event.target.closest('a[href]');
    if (!anchor) return;
    const destination = new URL(anchor.getAttribute('href'), location.href);
    const originalSite = destination.hostname === 'kota.co.uk';
    if (originalSite) {
      destination.host = location.host;
      destination.protocol = location.protocol;
      anchor.href = destination.href;
    }
    if (destination.origin !== location.origin) return;
    if (/\.(?:zip|pdf)$/i.test(destination.pathname)) {
      // Keep the native default action but bypass the captured Link component's
      // route transition, which otherwise leaves its loading cover over the page.
      if (/\.zip$/i.test(destination.pathname)) anchor.download = destination.pathname.split('/').pop();
      event.stopImmediatePropagation();
    } else if (originalSite || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target === '_blank') {
      event.stopImmediatePropagation();
    }
  }, true);
}
