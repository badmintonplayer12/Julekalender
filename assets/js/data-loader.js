function getBasePath() {
  const path = window.location.pathname || '/';
  return path.endsWith('/') ? path : path.replace(/[^/]*$/, '');
}

const BASE_PATH = getBasePath();
const CALENDAR_URL = `${BASE_PATH}data/calendar.json`;
const MEDIA_BASE = `${BASE_PATH}assets/media/`;

export async function loadCalendar() {
  const res = await fetch(CALENDAR_URL);
  if (!res.ok) throw new Error(`Failed to load calendar.json (${res.status})`);
  const data = await res.json();
  const days = (data.days || []).slice().sort((a, b) => a.id.localeCompare(b.id));
  return { ...data, days };
}

export function getMediaUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${MEDIA_BASE}${path}`;
}
