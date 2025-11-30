export function isDayAvailable(day, { now = new Date(), preview = false } = {}) {
  if (!day) return false;
  if (preview) return true;
  // Id som tall styrer lås: 1 => 1. des, ... 24 => 24. des. Alt etter 24. des er åpent.
  const dayNum = parseInt((day.id || '').replace(/^0+/, ''), 10);
  if (!Number.isFinite(dayNum)) return false;

  const year = now.getFullYear();
  const unlockDate = new Date(year, 11, dayNum, 0, 0, 0); // desember = 11
  const cutoff = new Date(year, 11, 25, 0, 0, 0); // alt åpent etter 24. des
  if (now >= cutoff) return true;
  return now >= unlockDate;
}

export function formatAvailableAt(day) {
  if (!day?.openAt) return '';
  const date = new Date(day.openAt);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
}

export function copyToClipboard(text) {
  if (!text) return Promise.reject(new Error('Empty text'));
  if (navigator?.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    try {
      const tmp = document.createElement('textarea');
      tmp.value = text;
      tmp.style.position = 'fixed';
      tmp.style.opacity = '0';
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      document.body.removeChild(tmp);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
