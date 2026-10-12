import { renderStation } from './render.js';

/**
 * The sliding content panel. It holds one station at a time and is the
 * accessible source of truth for that station's text.
 */
export function createPanel({ el, toggle, onClose, onOpenChange }) {
  let open = false;
  let currentId = null;
  let lastFocused = null;

  const close = () => setOpen(false);

  // The close button and the article wrapper are built once. Rebuilding them on
  // every station change used to destroy whatever the visitor had focused, which
  // dropped focus to the document and lost their place.
  const closeButton = document.createElement('button');
  closeButton.className = 'panel__close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close panel');
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', close);

  const article = document.createElement('article');
  el.replaceChildren(closeButton, article);

  function setContent(station) {
    currentId = station.id;
    article.innerHTML = renderStation(station);
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

  // Esc closes. Tab is deliberately not trapped: the panel is a sidebar, not a
  // modal dialog. It has no backdrop, blocks nothing, and leaves the station nav
  // visible beside it, so confining focus here made that nav unreachable by
  // keyboard with no way to tell.
  function onKeydown(e) {
    if (!open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
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
