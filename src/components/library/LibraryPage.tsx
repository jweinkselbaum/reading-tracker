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
      <p className="text-sm">No {type}s yet</p>
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

function BookColumn({ books, onRemove }: { books: Book[]; onRemove: (id: string) => void }) {
  const byCategory = groupBy(books, b => b.category);
  return books.length === 0 ? <EmptyState type="book" /> : (
    <>
      {Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b)).map(([cat, items]) => (
        <div key={cat} className="mb-5">
          <p className="text-xs font-bold text-[#9B928A] uppercase tracking-widest mb-2">{cat}</p>
          <div className="flex flex-col gap-2">
            {items.map(b => <BookCard key={b.id} book={b} onRemove={() => onRemove(b.id)} />)}
          </div>
        </div>
      ))}
    </>
  );
}

function MagazineColumn({ magazines, onRemove }: { magazines: Magazine[]; onRemove: (id: string) => void }) {
  const byPublisher = groupBy(magazines, m => m.publisher);
  return magazines.length === 0 ? <EmptyState type="magazine" /> : (
    <>
      {Object.entries(byPublisher).sort(([a], [b]) => a.localeCompare(b)).map(([pub, items]) => (
        <div key={pub} className="mb-5">
          <p className="text-xs font-bold text-[#9B928A] uppercase tracking-widest mb-2">{pub}</p>
          <div className="flex flex-col gap-2">
            {items.map(m => <MagazineCard key={m.id} mag={m} onRemove={() => onRemove(m.id)} />)}
          </div>
        </div>
      ))}
    </>
  );
}

export function LibraryPage({ library }: Props) {
  const [mobileTab, setMobileTab] = useState<'books' | 'magazines'>('books');
  const [showAdd, setShowAdd] = useState(false);

  const books = library.items.filter((i): i is Book => i.type === 'book');
  const magazines = library.items.filter((i): i is Magazine => i.type === 'magazine');

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 md:px-8 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-[#1A1512]" style={{ fontFamily: 'Georgia, serif' }}>Library</h1>
        <Button size="sm" onClick={() => setShowAdd(true)}>+ Add item</Button>
      </div>

      {/* Mobile tab switcher */}
      <div
        className="flex mx-5 mb-4 rounded-lg p-0.5 md:hidden"
        style={{ background: '#E0D8CC', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)' }}
      >
        {(['books', 'magazines'] as const).map(t => (
          <button
            key={t}
            onClick={() => setMobileTab(t)}
            className="flex-1 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer capitalize"
            style={mobileTab === t
              ? { background: '#F8F5EE', color: '#1A1512', boxShadow: '0 1px 3px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)' }
              : { color: '#6B6059', background: 'transparent' }
            }
          >
            {t} <span className="text-[#9B928A]">({t === 'books' ? books.length : magazines.length})</span>
          </button>
        ))}
      </div>

      {/* Mobile: single column with tabs */}
      <div className="flex-1 overflow-y-auto px-5 pb-24 md:hidden">
        {mobileTab === 'books'
          ? <BookColumn books={books} onRemove={library.removeItem} />
          : <MagazineColumn magazines={magazines} onRemove={library.removeItem} />
        }
      </div>

      {/* Desktop: two columns side by side */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-6 flex-1 overflow-hidden px-8 pb-8">
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-[#9B928A] uppercase tracking-widest">Books <span className="font-normal">({books.length})</span></p>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            <BookColumn books={books} onRemove={library.removeItem} />
          </div>
        </div>
        <div className="flex flex-col overflow-hidden" style={{ borderLeft: '1px solid #E0D8CC', paddingLeft: 24 }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-[#9B928A] uppercase tracking-widest">Magazines <span className="font-normal">({magazines.length})</span></p>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            <MagazineColumn magazines={magazines} onRemove={library.removeItem} />
          </div>
        </div>
      </div>

      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} library={library} />}
    </div>
  );
}
