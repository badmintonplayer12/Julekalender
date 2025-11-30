import { getMediaUrl } from './data-loader.js';

/**
 * @param {Object|null} day
 * @param {Object} opts
 * @param {boolean} opts.isOpened
 * @param {boolean} opts.isAvailable
 * @param {function(): void} opts.onOpen
 * @param {function(): void} opts.onBack
 * @param {function(): void} opts.onCopyLink
 * @param {string} [opts.availableAtText]
 * @returns {HTMLElement}
 */
export function renderDayView(day, { isOpened, isAvailable, onOpen, onBack, onCopyLink, availableAtText, showBack = true }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'day-view';

  const header = document.createElement('div');
  header.className = 'day-view__header';

  const title = document.createElement('div');
  title.className = 'day-view__title';
  title.textContent = day ? `Luke ${day.id}` : 'Ukjent luke';

  if (showBack) {
    const back = document.createElement('button');
    back.className = 'day-view__button';
    back.textContent = 'Tilbake';
    back.addEventListener('click', onBack);
    header.append(title, back);
  } else {
    header.append(title);
  }
  wrapper.appendChild(header);

  const body = document.createElement('div');
  body.className = 'day-view__body';

  if (!day) {
    const status = document.createElement('div');
    status.className = 'day-view__status';
    status.textContent = 'Fant ikke denne luken.';
    body.appendChild(status);
    wrapper.appendChild(body);
    return wrapper;
  }

  if (!isAvailable) {
    const status = document.createElement('div');
    status.className = 'day-view__status';
    status.textContent = availableAtText ? `Tilgjengelig fra ${availableAtText}` : 'Ikke tilgjengelig ennå.';
    body.appendChild(status);
    wrapper.appendChild(body);
    return wrapper;
  }

  if (day.image) {
    const img = document.createElement('img');
    img.className = 'day-view__media';
    img.src = getMediaUrl(day.image);
    img.alt = day.title || `Luke ${day.id}`;
    body.appendChild(img);
  }

  const verse = document.createElement('div');
  verse.className = 'day-view__verse';
  verse.textContent = day.body || 'Ingen tekst lagt inn ennå.';
  body.appendChild(verse);

  if (day.ctaUrl) {
    const actions = document.createElement('div');
    actions.className = 'day-view__actions';
    const link = document.createElement('a');
    link.className = 'day-view__link';
    link.href = day.ctaUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = day.ctaLabel || 'Les mer';
    actions.appendChild(link);
    body.appendChild(actions);
  }
  wrapper.appendChild(body);

  if (!isOpened) {
    onOpen?.();
  }

  return wrapper;
}
