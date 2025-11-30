/**
 * @typedef {{ type: 'root' } | { type: 'day', id: string }} Route
 */

export function init(onRouteChange) {
  window.addEventListener('hashchange', () => {
    onRouteChange(parseHash(window.location.hash));
  });
}

export function parseHash(hash) {
  const value = hash.replace(/^#/, '');
  if (!value || value === '/') {
    return { type: 'root' };
  }
  const match = value.match(/^\/d\/([^/]+)$/);
  if (!match) return { type: 'root' };
  return { type: 'day', id: match[1] };
}

export function updateHash(route) {
  if (route.type === 'root') {
    window.location.hash = '#/';
    return;
  }
  window.location.hash = `#/d/${route.id}`;
}
