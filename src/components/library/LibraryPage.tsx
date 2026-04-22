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

const cardStyle: React.CSSProperties = {
  background: '#FDFAF5',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
  border: '1px solid #E0D8CC',
};

function EmptyState({ type }: { type: 'book' | 'magazine' }) {
  return (
    <div className="text-center py-16 text-[#9B928A]">
      <div className="w-12 h-12 mx-auto mb-3 opacity-30">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
          {type === 'book'
            ? <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>
            : <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h6"/></>
          }
        </svg>
      </div>
      <p className="text-sm">No {type}s yet — add one above</p>
    </div>
  );
}

function BookCard({ book, onRemove }: { book: Book; onRemove: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl" style={cardStyle}>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#1A1512] text-sm truncate" style={{ fontFamily: 'Georgia, serif' }}>{book.title}</p>
        <p className="text-xs text-[#9B928A] mt-0.5">{book.author} · {book.totalPages} pages</p>
        <div className="mt-2"><MediumBadge medium={book.medium} /></div>
      </div>
      <button onClick={onRemove} className="text-[#C5BFBA] hover:text-[#8B2220] text-xl leading-none mt-0.5 cursor-pointer transition-colors" aria-label="Remove">×</button>
    </div>
  );
}

function MagazineCard({ mag, onRemove }: { mag: Magazine; onRemove: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl" style={cardStyle}>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#1A1512] text-sm truncate" style={{ fontFamily: 'Georgia, serif' }}>{mag.title}</p>
        {mag.issueNumber && <p className="text-xs text-[#9B928A] mt-0.5">{mag.issueNumber}</p>}
        <div className="mt-2"><MediumBadge medium={mag.medium} /></div>
      </div>
      <button onClick={onRemove} className="text-[#C5BFBA] hover:text-[#8B2220] text-xl leading-none mt-0.5 cursor-pointer transition-colors" aria-label="Remove">×</button>
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
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-[#1A1512]" style={{ fontFamily: 'Georgia, serif' }}>Library</h1>
        <Button size="sm" onClick={() => setShowAdd(true)}>+ Add item</Button>
      </div>

      <div
        className="flex mx-5 mb-4 rounded-lg p-0.5"
        style={{ background: '#E0D8CC', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)' }}
      >
        {(['books', 'magazines'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer capitalize"
            style={tab === t
              ? { background: '#F8F5EE', color: '#1A1512', boxShadow: '0 1px 3px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)' }
              : { color: '#6B6059', background: 'transparent' }
            }
          >
            {t} <span className="text-[#9B928A]">({t === 'books' ? books.length : magazines.length})</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {tab === 'books' ? (
          books.length === 0 ? <EmptyState type="book" /> : (
            Object.entries(booksByCategory).sort(([a], [b]) => a.localeCompare(b)).map(([cat, items]) => (
              <div key={cat} className="mb-5">
                <p className="text-xs font-bold text-[#9B928A] uppercase tracking-widest mb-2">{cat}</p>
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
                <p className="text-xs font-bold text-[#9B928A] uppercase tracking-widest mb-2">{pub}</p>
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
