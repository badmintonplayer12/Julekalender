# Implementasjonsguide

Hvordan koden skal organiseres og hvilke signaturer som gjelder for julekalender-prosjektet. Følg mønstrene under; ikke innfør nye varianter uten å oppdatere denne filen.

## Prinsipper

- Moderne JavaScript (ES modules, `const`/`let`, arrow functions).
- Named exports, ingen default exports.
- Små, fokuserte funksjoner (<50 linjer).
- Ingen direkte DOM-manipulasjon i data/state-moduler.
- BEM-klassenavn fra [CSS_GUIDELINES.md](./CSS_GUIDELINES.md).

## Moduloversikt

### main.js
Entry point og koordinator. Ingen egen DOM-rendering.

```javascript
import { init as initRouter, parseHash, updateHash } from './router.js';
import { loadCalendar } from './data-loader.js';
import { getState, updateState, markDayOpened, isDayOpened } from './state.js';
import { renderCalendarGrid } from './view-calendar-grid.js';
import { renderDayView } from './view-day.js';
import { isDayAvailable } from './utils.js'; // helper for låsing

export async function init() {
  initRouter(handleRoute);
  const initial = parseHash(window.location.hash);
  await handleRoute(initial);
}

export async function handleRoute(route) {
  const root = document.getElementById('app');
  root.innerHTML = '';

  if (!getState().calendar) {
    const calendar = await loadCalendar();
    updateState({ calendar });
  }

  if (route.type === 'root') {
    const view = renderCalendarGrid({
      calendar: getState().calendar,
      isOpened: isDayOpened,
      isAvailable: (day) => isDayAvailable(day, { now: new Date(), preview: getState().previewMode })
    }, (id) => updateHash({ type: 'day', id }));
    root.appendChild(view);
  } else if (route.type === 'day') {
    const day = getState().calendar?.days.find(d => d.id === route.id);
    const view = renderDayView(day, {
      isOpened: isDayOpened(day?.id),
      isAvailable: isDayAvailable(day, { now: new Date(), preview: getState().previewMode }),
      onOpen: () => markDayOpened(route.id),
      onBack: () => updateHash({ type: 'root' })
    });
    root.appendChild(view);
  }
}
```

### router.js
Hash-basert ruting.

{% raw %}
```javascript
/**
 * @typedef {{ type: 'root' } | { type: 'day', id: string }} Route
 */

export function init(onRouteChange) {
  window.addEventListener('hashchange', () => onRouteChange(parseHash(location.hash)));
}

export function parseHash(hash) {
  const value = hash.replace(/^#/, '');
  if (!value || value === '/')
    return { type: 'root' };
  const match = value.match(/^\/d\/([^/]+)$/);
  if (!match) return { type: 'root' };
  return { type: 'day', id: match[1] };
}

export function updateHash(route) {
  if (route.type === 'root') {
    window.location.hash = '#/';
  } else {
    window.location.hash = `#/d/${route.id}`;
  }
}
```
{% endraw %}

### state.js
Holder runtime-state og lagrer åpne luker i localStorage.

```javascript
const STORAGE_KEY = 'adventCalendar.opened';

let appState = {
  calendar: null,
  currentDayId: null,
  openedDayIds: new Set(loadOpenedFromStorage()),
  previewMode: false
};

export function getState() { return { ...appState, openedDayIds: new Set(appState.openedDayIds) }; }
export function updateState(updates) { appState = { ...appState, ...updates }; return getState(); }

export function loadOpenedFromStorage() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function persistOpened(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
}

export function markDayOpened(id) {
  if (!id) return;
  const updated = new Set(appState.openedDayIds);
  updated.add(id);
  appState = { ...appState, openedDayIds: updated };
  persistOpened(updated);
}

export function isDayOpened(id) {
  return id ? appState.openedDayIds.has(id) : false;
}
```

### data-loader.js
Henter kalenderdata og bygger URL-er til media.

```javascript
const CALENDAR_URL = '/data/calendar.json';
const MEDIA_BASE = '/assets/media/';

export async function loadCalendar() {
  const res = await fetch(CALENDAR_URL);
  if (!res.ok) throw new Error(`Failed to load calendar.json (${res.status})`);
  const data = await res.json();
  data.days = (data.days || []).sort((a, b) => a.id.localeCompare(b.id));
  return data;
}

export function getMediaUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  return `${MEDIA_BASE}${path}`;
}
```

### utils.js
Samler små helpers (låsing, datoformat).

```javascript
export function isDayAvailable(day, { now = new Date(), preview = false } = {}) {
  if (!day) return false;
  if (preview) return true;
  if (!day.openAt) return true;
  const openAt = new Date(day.openAt);
  return !isNaN(openAt.getTime()) && openAt.getTime() <= now.getTime();
}
```

### view-calendar-grid.js
Renderer lukene over bakgrunnsbildet. Skal ikke hente data eller skrive til localStorage.

```javascript
import { getMediaUrl } from './data-loader.js';

/**
 * @param {Object} params
 * @param {Object} params.calendar - Kalenderdata
 * @param {function(string): boolean} params.isOpened - Sjekk åpnet status
 * @param {function(Object): boolean} params.isAvailable - Sjekk tilgjengelighet
 * @param {function(Object, HTMLElement): void} params.onDaySelected - Callback ved klikk (day, pin)
 * @param {string} [params.backgroundImage] - Bakgrunnsbilde-URL
 */
export function renderCalendarGrid({ calendar, isOpened, isAvailable, onDaySelected, backgroundImage }) {
  const container = document.createElement('div');
  container.className = 'calendar-bg';
  if (backgroundImage) container.style.backgroundImage = `url('${backgroundImage}')`;

  const overlay = document.createElement('div');
  overlay.className = 'calendar-overlay';
  container.appendChild(overlay);

  (calendar?.days || []).forEach((day) => {
    const pin = document.createElement('button');
    pin.className = 'calendar-pin';
    pin.style.left = `${day.position?.xPercent ?? 50}%`;
    pin.style.top = `${day.position?.yPercent ?? 50}%`;
    pin.setAttribute('aria-label', `Luke ${day.id}`);

    const opened = isOpened(day.id);
    const available = isAvailable(day);
    if (!available) pin.classList.add('calendar-pin--locked');
    if (opened) pin.classList.add('calendar-pin--opened');

    pin.textContent = day.id;
    pin.addEventListener('click', () => onDaySelected(day, pin));
    container.appendChild(pin);
  });

  return container;
}
```

### view-day.js
Renderer én dag. Viser låst-tilstand når `isAvailable` er false.

```javascript
import { getMediaUrl } from './data-loader.js';

export function renderDayView(day, { isOpened, isAvailable, onOpen, onBack }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'day-view';

  const header = document.createElement('div');
  header.className = 'day-view__header';
  header.textContent = day?.title || 'Ukjent dag';

  const back = document.createElement('button');
  back.className = 'day-view__button';
  back.textContent = 'Tilbake';
  back.addEventListener('click', onBack);
  header.appendChild(back);

  const body = document.createElement('div');
  body.className = 'day-view__body';

  if (!day) {
    body.textContent = 'Fant ikke denne luken.';
  } else if (!isAvailable) {
    const status = document.createElement('div');
    status.className = 'day-view__status';
    status.textContent = 'Ikke tilgjengelig ennå.';
    body.appendChild(status);
  } else {
    if (day.image) {
      const media = document.createElement('img');
      media.className = 'day-view__media';
      media.src = getMediaUrl(day.image);
      media.alt = day.title;
      body.appendChild(media);
    }

    const content = document.createElement('div');
    content.className = 'day-view__content';
    if (day.body) {
      day.body.split('\n').forEach(line => {
        const p = document.createElement('p');
        p.textContent = line.trim();
        content.appendChild(p);
      });
    }
    body.appendChild(content);

    if (day.ctaUrl) {
      const actions = document.createElement('div');
      actions.className = 'day-view__actions';
      const btn = document.createElement('a');
      btn.className = 'day-view__button';
      btn.href = day.ctaUrl;
      btn.textContent = day.ctaLabel || 'Åpne';
      btn.target = '_blank';
      actions.appendChild(btn);
      body.appendChild(actions);
    }

    if (!isOpened) {
      onOpen?.();
    }
  }

  wrapper.append(header, body);
  return wrapper;
}
```

## Feilhåndtering

- Logg fetch-feil til konsollen og vis en enkel feilmelding i UI.
- Ved ugyldig `calendar.json`: vis “Kunne ikke laste kalenderen” og ikke krasj appen.
- Manglende bilder: sett `onerror`-fallback til et nøytralt ikon/bakgrunn.

## Eventer og callbacks

- Views skal kun kalle callbacks (`onDaySelected`, `onOpen`, `onBack`). Ingen direkte hash- eller state-endringer.
- `main.js` eier all URL/state-manipulasjon.

## Testing (manuell)

- Start siden og verifiser at grid lastes uten feil i Network-tab.
- Åpne en tilgjengelig dag og sjekk at `opened` status lagres (localStorage).
- Sett en `openAt` i fremtiden og verifiser låst visning.
- Del/lim inn `/#/d/<id>` og bekreft at riktig dag åpnes.

## Beste praksis

1. Hold helpers rene (ingen DOM sideeffekter).
2. Navn skal være selvforklarende; kommenter kun komplisert logikk.
3. Ikke dupliser låse-/tilgjengelighetslogikk; bruk `isDayAvailable`.
4. Sørg for at klassenavn samsvarer med CSS-guiden.
5. Oppdater dokumentasjonen hvis du etablerer nye mønstre.
