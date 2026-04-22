import { useState, useCallback } from 'react';
import type { ReadingLogEntry } from '../types';
import { getItem, setItem, KEYS } from '../utils/storage';
import { today } from '../utils/dates';

function load(): ReadingLogEntry[] {
  return getItem<ReadingLogEntry[]>(KEYS.log) ?? [];
}

export function useReadingLog() {
  const [entries, setEntries] = useState<ReadingLogEntry[]>(load);

  const persist = useCallback((next: ReadingLogEntry[]) => {
    setItem(KEYS.log, next);
    setEntries(next);
  }, []);

  const addEntry = useCallback((data: Omit<ReadingLogEntry, 'id'>) => {
    const entry: ReadingLogEntry = { ...data, id: crypto.randomUUID() };
    const next = [entry, ...entries];
    persist(next);
  }, [entries, persist]);

  const removeEntry = useCallback((id: string) => {
    persist(entries.filter(e => e.id !== id));
  }, [entries, persist]);

  const quickLog = useCallback((
    itemId: string,
    medium: ReadingLogEntry['medium'],
    amount: { pagesRead?: number; articlesRead?: number },
  ) => {
    addEntry({ itemId, date: today(), medium, ...amount });
  }, [addEntry]);

  return { entries, addEntry, removeEntry, quickLog };
}
