export function normalizeFacebookUrl(value) {
  const raw = value?.trim();
  if (!raw) return null;

  const normalized = raw.replace(/^@+/, "");

  if (/^https?:\/\//i.test(normalized)) {
    return normalized.replace(/^http:\/\//i, "https://");
  }

  if (/^(www\.|m\.|web\.)?(facebook|fb)\.com\//i.test(normalized)) {
    return `https://${normalized}`;
  }

  return `https://facebook.com/${normalized}`;
}
