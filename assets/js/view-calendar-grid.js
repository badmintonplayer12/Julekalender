import { getMediaUrl } from './data-loader.js';

/**
 * Renderer kalender-grid over bakgrunn.
 * @param {Object} params
 * @param {Object} params.calendar - Kalenderdata
 * @param {function(string): boolean} params.isOpened - Sjekk åpnet status
 * @param {function(Object): boolean} params.isAvailable - Sjekk tilgjengelighet
 * @param {function(Object, HTMLElement): void} params.onDaySelected - Callback ved klikk (får day, pin)
 * @param {string} [params.backgroundImage] - Bakgrunnsbilde-URL
 * @returns {HTMLElement}
 */
export function renderCalendarGrid({ calendar, isOpened, isAvailable, onDaySelected, backgroundImage }) {
  const container = document.createElement('div');
  container.className = 'calendar-bg';

  const frame = document.createElement('div');
  frame.className = 'calendar-bg__frame';

  if (backgroundImage) {
    const img = document.createElement('img');
    img.className = 'calendar-bg__image';
    img.src = backgroundImage;
    img.alt = 'Julekalender bakgrunn';
    frame.appendChild(img);
  }

  const overlay = document.createElement('div');
  overlay.className = 'calendar-overlay';
  frame.appendChild(overlay);

  (calendar?.days || []).forEach((day) => {
    const pin = document.createElement('button');
    pin.className = 'calendar-pin';
    pin.type = 'button';
    pin.style.left = `${day.position?.xPercent ?? 50}%`;
    pin.style.top = `${day.position?.yPercent ?? 50}%`;
    pin.setAttribute('aria-label', `Luke ${day.id}`);

    const opened = isOpened(day.id);
    const available = isAvailable(day);

    if (!available) {
      pin.classList.add('calendar-pin--locked');
      pin.disabled = true;
    }
    if (opened) {
      pin.classList.add('calendar-pin--opened');
    }

    const number = document.createElement('span');
    number.textContent = day.id?.replace(/^0+/, '') || day.id;
    pin.appendChild(number);

    pin.addEventListener('click', () => onDaySelected(day, pin));
    overlay.appendChild(pin);
  });

  container.appendChild(frame);
  return container;
}
