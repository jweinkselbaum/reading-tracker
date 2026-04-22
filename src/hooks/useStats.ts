import { useMemo } from 'react';
import type { ReadingLogEntry } from '../types';
import { startOfWeek } from '../utils/dates';

export function useStats(entries: ReadingLogEntry[]) {
  return useMemo(() => {
    const weekStart = startOfWeek();
    const thisWeek = entries.filter(e => e.date >= weekStart);

    const physicalThisWeek = thisWeek.filter(e => e.medium === 'physical');
    const digitalThisWeek = thisWeek.filter(e => e.medium === 'digital');

    const physicalPages = physicalThisWeek.reduce((s, e) => s + (e.pagesRead ?? 0), 0);
    const digitalPages = digitalThisWeek.reduce((s, e) => s + (e.pagesRead ?? 0), 0);
    const physicalArticles = physicalThisWeek.reduce((s, e) => s + (e.articlesRead ?? 0), 0);
    const digitalArticles = digitalThisWeek.reduce((s, e) => s + (e.articlesRead ?? 0), 0);

    const totalSessions = entries.length;
    const physicalSessions = entries.filter(e => e.medium === 'physical').length;
    const physicalPct = totalSessions === 0 ? 0 : Math.round((physicalSessions / totalSessions) * 100);

    const weekSessions = thisWeek.length;
    const weekPhysicalSessions = physicalThisWeek.length;
    const weekPhysicalPct = weekSessions === 0 ? 0 : Math.round((weekPhysicalSessions / weekSessions) * 100);

    const totalPages = entries.reduce((s, e) => s + (e.pagesRead ?? 0), 0);
    const totalArticles = entries.reduce((s, e) => s + (e.articlesRead ?? 0), 0);

    return {
      physicalPages,
      digitalPages,
      physicalArticles,
      digitalArticles,
      physicalSessions,
      totalSessions,
      physicalPct,
      weekPhysicalPct,
      totalPages,
      totalArticles,
    };
  }, [entries]);
}
