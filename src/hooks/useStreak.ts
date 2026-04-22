import { useMemo } from 'react';
import type { ReadingLogEntry } from '../types';
import { calculateStreak } from '../utils/streaks';

export function useStreak(entries: ReadingLogEntry[]) {
  return useMemo(() => calculateStreak(entries), [entries]);
}
