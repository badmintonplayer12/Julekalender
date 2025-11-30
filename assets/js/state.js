const STORAGE_KEY = 'adventCalendar.opened';

let appState = {
  calendar: null,
  currentDayId: null,
  openedDayIds: new Set(loadOpenedFromStorage()),
  previewMode: false
};

export function getState() {
  return {
    ...appState,
    openedDayIds: new Set(appState.openedDayIds)
  };
}

export function updateState(updates) {
  appState = { ...appState, ...updates };
  return getState();
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

export function setPreviewMode(value) {
  appState = { ...appState, previewMode: Boolean(value) };
}

function loadOpenedFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function persistOpened(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // Best effort; ikke kast.
  }
}
