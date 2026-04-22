export function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const KEYS = {
  library: 'reading_tracker_library',
  log: 'reading_tracker_log',
  notifications: 'reading_tracker_notifications',
} as const;
