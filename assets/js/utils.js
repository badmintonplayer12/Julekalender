export function isDayAvailable(day, { now = new Date(), preview = false } = {}) {
  if (!day) return false;
  if (preview) return true;
  if (!day.openAt) return true;
  const openAt = new Date(day.openAt);
  if (Number.isNaN(openAt.getTime())) return true;
  // Alle luker åpnes etter 24. desember uansett år
  const decemberCutoff = new Date(openAt.getFullYear(), 11, 25, 0, 0, 0);
  if (now >= decemberCutoff) return true;
  return openAt.getTime() <= now.getTime();
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
