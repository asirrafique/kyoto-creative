/** Keep the original CSS accordion animation and expose usable keyboard controls. */
export function installFaqControls() {
  const selector = 'label[class*="FaqsList_question"]';
  const initialized = new WeakSet();
  function initialize() {
    document.querySelectorAll(selector).forEach((question, index) => {
      if (initialized.has(question)) return;
      const input = question.querySelector('input[type="checkbox"]');
      const answer = question.nextElementSibling;
      if (!input || !answer) return;
      initialized.add(question);
      question.tabIndex = 0;
      question.setAttribute('role', 'button');
      answer.id ||= 'faq-answer-' + location.pathname.replace(/\W/g, '-') + '-' + index;
      question.setAttribute('aria-controls', answer.id);
      const update = () => question.setAttribute('aria-expanded', String(input.checked));
      input.addEventListener('change', update);
      question.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        input.click();
      });
      answer.addEventListener('transitionend', event => {
        if (event.target === answer && event.propertyName === 'grid-template-rows') window.lenis?.resize();
      });
      update();
    });
  }
  new MutationObserver(initialize).observe(document.documentElement, { childList: true, subtree: true });
  initialize();
}
