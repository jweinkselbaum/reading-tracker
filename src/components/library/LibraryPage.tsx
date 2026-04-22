import { useState } from 'react';
import type { Book, Magazine } from '../../types';
import { Button } from '../shared/Button';
import { MediumBadge } from '../shared/MediumBadge';
import { AddItemModal } from './AddItemModal';
import { useLibrary } from '../../hooks/useLibrary';
import { groupBy } from '../../utils/groupBy';

interface Props {
  library: ReturnType<typeof useLibrary>;
}

function EmptyState({ type }: { type: 'book' | 'magazine' }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-3">{type === 'book' ? '📕' : '📰'}</div>
      <p className="text-sm">No {type}s yet — add one above</p>
    </div>
  );
}

function BookCard({ book, onRemove }: { book: Book; onRemove: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 bg-white">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{book.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{book.author} · {book.totalPages}p</p>
        <div className="mt-1.5">
          <MediumBadge medium={book.medium} />
        </div>
      </div>
      <button onClick={onRemove} className="text-gray-300 hover:text-red-400 text-lg leading-none mt-0.5 cursor-pointer" aria-label="Remove">×</button>
    </div>
  );
}

function MagazineCard({ mag, onRemove }: { mag: Magazine; onRemove: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 bg-white">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{mag.title}</p>
        {mag.issueNumber && <p className="text-xs text-gray-500 mt-0.5">{mag.issueNumber}</p>}
        <div className="mt-1.5">
          <MediumBadge medium={mag.medium} />
        </div>
      </div>
      <button onClick={onRemove} className="text-gray-300 hover:text-red-400 text-lg leading-none mt-0.5 cursor-pointer" aria-label="Remove">×</button>
    </div>
  );
}

export function LibraryPage({ library }: Props) {
  const [tab, setTab] = useState<'books' | 'magazines'>('books');
  const [showAdd, setShowAdd] = useState(false);

  const books = library.items.filter((i): i is Book => i.type === 'book');
  const magazines = library.items.filter((i): i is Magazine => i.type === 'magazine');

  const booksByCategory = groupBy(books, b => b.category);
  const magsByPublisher = groupBy(magazines, m => m.publisher);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold text-gray-900">Library</h1>
        <Button size="sm" onClick={() => setShowAdd(true)}>+ Add</Button>
      </div>

      <div className="flex gap-1 px-4 pb-3">
        {(['books', 'magazines'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer capitalize ${
              tab === t ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t} ({t === 'books' ? books.length : magazines.length})
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {tab === 'books' ? (
          books.length === 0 ? <EmptyState type="book" /> : (
            Object.entries(booksByCategory).sort(([a], [b]) => a.localeCompare(b)).map(([cat, items]) => (
              <div key={cat} className="mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{cat}</p>
                <div className="flex flex-col gap-2">
                  {items.map(b => <BookCard key={b.id} book={b} onRemove={() => library.removeItem(b.id)} />)}
                </div>
              </div>
            ))
          )
        ) : (
          magazines.length === 0 ? <EmptyState type="magazine" /> : (
            Object.entries(magsByPublisher).sort(([a], [b]) => a.localeCompare(b)).map(([pub, items]) => (
              <div key={pub} className="mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{pub}</p>
                <div className="flex flex-col gap-2">
                  {items.map(m => <MagazineCard key={m.id} mag={m} onRemove={() => library.removeItem(m.id)} />)}
                </div>
              </div>
            ))
          )
        )}
      </div>

      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} library={library} />}
    </div>
  );
}
