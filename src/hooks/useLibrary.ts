import { useState, useCallback } from 'react';
import type { LibraryItem, Book, Magazine } from '../types';
import { getItem, setItem, KEYS } from '../utils/storage';
import { today } from '../utils/dates';

function load(): LibraryItem[] {
  return getItem<LibraryItem[]>(KEYS.library) ?? [];
}

export function useLibrary() {
  const [items, setItems] = useState<LibraryItem[]>(load);

  const persist = useCallback((next: LibraryItem[]) => {
    setItem(KEYS.library, next);
    setItems(next);
  }, []);

  const addBook = useCallback((data: Omit<Book, 'id' | 'type' | 'addedAt'>) => {
    const item: Book = { ...data, id: crypto.randomUUID(), type: 'book', addedAt: today() };
    persist([...items, item]);
  }, [items, persist]);

  const addMagazine = useCallback((data: Omit<Magazine, 'id' | 'type' | 'addedAt'>) => {
    const item: Magazine = { ...data, id: crypto.randomUUID(), type: 'magazine', addedAt: today() };
    persist([...items, item]);
  }, [items, persist]);

  const removeItem = useCallback((id: string) => {
    persist(items.filter(i => i.id !== id));
  }, [items, persist]);

  return { items, addBook, addMagazine, removeItem };
}
