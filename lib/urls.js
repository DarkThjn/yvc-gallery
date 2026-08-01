export function normalizeFacebookUrl(value) {
  const raw = value?.trim();
  if (!raw) return null;

  const normalized = raw.replace(/^@+/, "");

  if (/^https?:\/\//i.test(normalized)) {
    return normalized.replace(/^http:\/\//i, "https://");
  }

  if (
    /^(www\.|m\.|web\.)?((facebook|fb)\.com|instagram\.com)\//i.test(
      normalized,
    )
  ) {
    return `https://${normalized}`;
  }

  return `https://facebook.com/${normalized}`;
}

const SOCIAL_DOMAINS = ["facebook.com", "fb.com", "instagram.com"];

export function normalizeSocialUrl(value) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return null;

  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(candidate);
    const hostname = url.hostname.toLowerCase();
    const isSupported = SOCIAL_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );

    if (!isSupported) return null;

    url.protocol = "https:";
    return url.toString();
  } catch {
    return null;
  }
}

export function getSocialPlatformLabel(value) {
  return value?.toLowerCase().includes("instagram.com")
    ? "Instagram"
    : "Facebook";
}
