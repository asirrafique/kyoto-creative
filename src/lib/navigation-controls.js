export function installNavigationControls() {
  function closeMenu() {
    const container = document.querySelector('.PrimaryNavigation_page__DgiUM');
    if (container && container.classList.contains('PrimaryNavigation_active__gdInn')) {
      container.classList.remove('PrimaryNavigation_active__gdInn');
    }
  }

  // Use capture phase on window so nothing can stopImmediatePropagation before us
  window.addEventListener('click', (event) => {
    const btn = event.target && event.target.closest && event.target.closest('button.PrimaryNavigation_icon__qAQCe');
    if (btn) {
      event.preventDefault();
      event.stopPropagation();
      const container = btn.parentElement || document.querySelector('.PrimaryNavigation_page__DgiUM');
      if (container) {
        container.classList.toggle('PrimaryNavigation_active__gdInn');
      }
      return;
    }

    const overlay = event.target && event.target.closest && event.target.closest('.PrimaryNavigation_pageOverlay__QD6me');
    if (overlay) {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
      return;
    }

    const flyoutLink = event.target && event.target.closest && event.target.closest('aside.PrimaryNavigation_flyout__nH7QV a');
    if (flyoutLink) {
      closeMenu();
      return;
    }

    const parentItem = event.target && event.target.closest && event.target.closest('.PrimaryNavigation_parent__bfX37');
    if (parentItem) {
      event.preventDefault();
      event.stopPropagation();
      const toggleSign = parentItem.querySelector('.PrimaryNavigation_toggleSign__XESvT');
      const submenu = parentItem.nextElementSibling;
      if (submenu && submenu.classList.contains('PrimaryNavigation_submenu__ryGWu')) {
        submenu.classList.toggle('PrimaryNavigation_submenuOpen__uJhU7');
        if (toggleSign) toggleSign.classList.toggle('PrimaryNavigation_toggleOpen__b_ys6');
      }
      return;
    }
  }, true);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  }, true);
}
