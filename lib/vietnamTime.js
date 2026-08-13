export const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

export function parseVietnamDateTimeInput(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value !== "string") return new Date(value);

  if (/(Z|[+-]\d{2}:\d{2})$/.test(value)) {
    return new Date(value);
  }

  const withSeconds = value.length === 16 ? `${value}:00` : value;
  return new Date(`${withSeconds}+07:00`);
}

export function formatVietnamDateTimeInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: VIETNAM_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

export function formatVietnamDate(value, options = {}) {
  return new Date(value).toLocaleDateString("vi-VN", {
    timeZone: VIETNAM_TIME_ZONE,
    ...options,
  });
}

export function formatVietnamDateTime(value, options = {}) {
  return new Date(value).toLocaleString("vi-VN", {
    timeZone: VIETNAM_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  });
}
