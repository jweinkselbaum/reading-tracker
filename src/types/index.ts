export type Medium = 'physical' | 'digital';

interface BaseLibraryItem {
  id: string;
  title: string;
  medium: Medium;
  addedAt: string;
}

export interface Book extends BaseLibraryItem {
  type: 'book';
  author: string;
  category: string;
  totalPages: number;
}

export interface Magazine extends BaseLibraryItem {
  type: 'magazine';
  publisher: string;
  issueNumber: string;
}

export type LibraryItem = Book | Magazine;

export interface ReadingLogEntry {
  id: string;
  itemId: string;
  date: string;
  medium: Medium;
  pagesRead?: number;
  articlesRead?: number;
}

export interface NotificationSettings {
  enabled: boolean;
  time: string;
  lastPromptedDate: string | null;
}

export type TabId = 'library' | 'log' | 'dashboard' | 'settings';
