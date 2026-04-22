import type { ReadingLogEntry } from '../types';
import { today, daysBetween } from './dates';

export function calculateStreak(log: ReadingLogEntry[]): { current: number; best: number } {
  const physicalDates = [...new Set(
    log.filter(e => e.medium === 'physical').map(e => e.date)
  )].sort((a, b) => b.localeCompare(a));

  if (physicalDates.length === 0) return { current: 0, best: 0 };

  const todayStr = today();
  const startDate = physicalDates[0] === todayStr || daysBetween(physicalDates[0], todayStr) === 1
    ? physicalDates[0]
    : null;

  let current = 0;
  if (startDate) {
    current = 1;
    for (let i = 1; i < physicalDates.length; i++) {
      if (daysBetween(physicalDates[i - 1], physicalDates[i]) === 1) {
        current++;
      } else {
        break;
      }
    }
  }

  let best = 0;
  let run = 1;
  for (let i = 1; i < physicalDates.length; i++) {
    if (daysBetween(physicalDates[i - 1], physicalDates[i]) === 1) {
      run++;
    } else {
      best = Math.max(best, run);
      run = 1;
    }
  }
  best = Math.max(best, run);

  return { current, best };
}
