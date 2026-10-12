/**
 * Station dots down the right edge. Clicking one flies the camera there.
 */
export function createNav({ el, stations, onSelect }) {
  const buttons = new Map();

  for (const station of stations) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav__item';
    btn.innerHTML = `<span class="nav__label">${station.label}</span><span class="nav__dot"></span>`;
    btn.setAttribute('aria-label', `Go to ${station.label}`);
    btn.addEventListener('click', () => onSelect(station.id));
    el.appendChild(btn);
    buttons.set(station.id, btn);
  }

  function setActive(id) {
    for (const [key, btn] of buttons) {
      btn.setAttribute('aria-current', String(key === id));
    }
  }

  return { setActive };
}
