export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T12:00:00Z');
}

export function daysBetween(a: string, b: string): number {
  const msPerDay = 86400000;
  return Math.round(Math.abs(parseDate(a).getTime() - parseDate(b).getTime()) / msPerDay);
}

export function formatDate(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function startOfWeek(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d.toISOString().slice(0, 10);
}
