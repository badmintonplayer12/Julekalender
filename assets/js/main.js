import { init as initRouter, parseHash, updateHash } from './router.js';
import { loadCalendar, BASE_PATH } from './data-loader.js';
import { getState, updateState, markDayOpened, isDayOpened } from './state.js';
import { renderCalendarGrid } from './view-calendar-grid.js';
import { renderDayView } from './view-day.js';
import { isDayAvailable, formatAvailableAt, copyToClipboard } from './utils.js';

const APP_ROOT_ID = 'app';
const BACKGROUND_PLACEHOLDER = `${BASE_PATH}assets/media/background.png`;
let currentOverlay = null;

async function bootstrap() {
  initRouter(handleRoute);
  const initialRoute = parseHash(window.location.hash);
  await handleRoute(initialRoute);
}

async function ensureCalendarLoaded() {
  if (getState().calendar) return;
  const calendar = await loadCalendar();
  updateState({ calendar });
}

function mount(element) {
  const root = document.getElementById(APP_ROOT_ID);
  root.innerHTML = '';
  root.appendChild(element);
}

async function handleRoute(route) {
  try {
    await ensureCalendarLoaded();
    if (route.type === 'root') {
      const state = getState();
      const grid = renderCalendarGrid({
        calendar: state.calendar,
        isOpened: isDayOpened,
        isAvailable: (day) => isDayAvailable(day, { now: new Date(), preview: state.previewMode }),
        onDaySelected: (day, pin) => {
          const available = isDayAvailable(day, { now: new Date(), preview: state.previewMode });
          if (!available) return;
          playOpenEffect(pin);
          setTimeout(() => updateHash({ type: 'day', id: day.id }), 1200);
        },
        backgroundImage: BACKGROUND_PLACEHOLDER ? BACKGROUND_PLACEHOLDER : undefined
      });
      mount(grid);
      closeOverlay(false);
      return;
    }

    if (route.type === 'day') {
      const state = getState();
      const day = state.calendar?.days.find((d) => d.id === route.id);
      const available = isDayAvailable(day, { now: new Date(), preview: state.previewMode });
      // Render grid first so pins stay visible
      const grid = renderCalendarGrid({
        calendar: state.calendar,
        isOpened: isDayOpened,
        isAvailable: (d) => isDayAvailable(d, { now: new Date(), preview: state.previewMode }),
        onDaySelected: () => {},
        backgroundImage: BACKGROUND_PLACEHOLDER ? BACKGROUND_PLACEHOLDER : undefined
      });
      mount(grid);
      openOverlay(day, {
        isOpened: isDayOpened(route.id),
        isAvailable: available,
        availableAtText: formatAvailableAt(day),
        showBack: false
      });
      return;
    }
  } catch (error) {
    console.error(error);
    mount(renderError('Kunne ikke laste kalenderen. Prøv å laste siden på nytt.'));
  }
}

function renderError(message) {
  const div = document.createElement('div');
  div.className = 'day-view';
  const status = document.createElement('div');
  status.className = 'day-view__status';
  status.textContent = message;
  div.appendChild(status);
  return div;
}

function playOpenEffect(pin) {
  if (!pin || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const glow = document.createElement('div');
  glow.className = 'bg-glow';
  document.body.appendChild(glow);
  setTimeout(() => glow.remove(), 800);
}

function openOverlay(day, { isOpened, isAvailable, availableAtText, onCopyLink, showBack }) {
  closeOverlay(false);
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeOverlay(true);
    }
  });

  const panel = document.createElement('div');
  panel.className = 'overlay__panel';

  const view = renderDayView(day, {
    isOpened,
    isAvailable,
    availableAtText,
    onOpen: () => markDayOpened(day?.id),
    onBack: () => closeOverlay(true),
    onCopyLink,
    showBack
  });

  panel.appendChild(view);
  overlay.appendChild(panel);

  document.body.appendChild(overlay);
  currentOverlay = overlay;

  const onEsc = (ev) => {
    if (ev.key === 'Escape') {
      closeOverlay(true);
    }
  };
  overlay._escHandler = onEsc;
  document.addEventListener('keydown', onEsc);
}

function closeOverlay(updateHashToRoot = true) {
  if (currentOverlay) {
    document.removeEventListener('keydown', currentOverlay._escHandler);
    currentOverlay.remove();
    currentOverlay = null;
  }
  if (updateHashToRoot) {
    updateHash({ type: 'root' });
  }
}

bootstrap();
