import { renderStation } from './render.js';

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * The sliding content panel. It holds one station at a time and is the
 * accessible source of truth for that station's text.
 */
export function createPanel({ el, toggle, onClose, onOpenChange }) {
  let open = false;
  let currentId = null;
  let lastFocused = null;

  const close = () => setOpen(false);

  function setContent(station) {
    currentId = station.id;
    el.innerHTML = `
      <button class="panel__close" type="button" aria-label="Close panel">&times;</button>
      <article>${renderStation(station)}</article>
    `;
    el.querySelector('.panel__close')?.addEventListener('click', close);
    el.scrollTop = 0;
  }

  function setOpen(value) {
    if (value === open) return;
    open = value;
    el.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Read more';
    onOpenChange?.(open);

    if (open) {
      lastFocused = document.activeElement;
      // Move focus into the panel so screen readers and keyboards follow.
      el.focus({ preventScroll: true });
    } else {
      if (lastFocused instanceof HTMLElement) lastFocused.focus({ preventScroll: true });
      onClose?.();
    }
  }

  // Esc closes; Tab is trapped inside while open.
  function onKeydown(e) {
    if (!open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab') return;

    const items = [...el.querySelectorAll(FOCUSABLE)].filter(
      (n) => n.offsetParent !== null
    );
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];

    if (e.shiftKey && (document.activeElement === first || document.activeElement === el)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  document.addEventListener('keydown', onKeydown);
  toggle.addEventListener('click', () => setOpen(!open));

  return {
    setContent,
    setOpen,
    close,
    get isOpen() {
      return open;
    },
    get currentId() {
      return currentId;
    },
  };
}
