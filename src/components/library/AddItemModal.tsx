import { useState, useEffect, useRef } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Select } from '../shared/Select';
import { useLibrary } from '../../hooks/useLibrary';
import { searchBooks, searchMagazines } from '../../utils/bookSearch';
import type { BookResult, MagazineResult } from '../../utils/bookSearch';

const BOOK_CATEGORIES = ['Fiction', 'Non-fiction', 'Science', 'History', 'Biography', 'Self-help', 'Technology', 'Philosophy', 'Art', 'Other'];

interface Props {
  onClose: () => void;
  library: ReturnType<typeof useLibrary>;
}

function SegmentToggle<T extends string>({ options, value, onChange, labels }: { options: T[]; value: T; onChange: (v: T) => void; labels?: Record<T, string> }) {
  return (
    <div className="flex rounded-lg p-0.5" style={{ background: '#E0D8CC', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)' }}>
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)} className="flex-1 py-2 rounded-md text-sm font-medium transition-all cursor-pointer capitalize"
          style={value === opt
            ? { background: '#F8F5EE', color: '#1A1512', boxShadow: '0 1px 3px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)' }
            : { color: '#6B6059', background: 'transparent' }
          }
        >
          {labels?.[opt] ?? opt}
        </button>
      ))}
    </div>
  );
}

function CoverPreview({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);

  return (
    <div className="hidden md:flex flex-col items-center justify-center flex-shrink-0" style={{ width: 120 }}>
      {url && !failed ? (
        <img
          src={url}
          alt="Cover"
          onError={() => setFailed(true)}
          className="rounded-sm object-cover"
          style={{ width: 96, height: 136, boxShadow: '4px 4px 12px rgba(0,0,0,0.25), -2px 0 4px rgba(0,0,0,0.1)' }}
        />
      ) : (
        <div
          className="rounded-sm flex items-center justify-center"
          style={{ width: 96, height: 136, border: '2px dashed #D4C9B8', background: '#F2EDE4' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C5BFBA" strokeWidth="1.25">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
      )}
      {url && !failed && <p className="text-xs text-[#9B928A] mt-2 text-center">Cover preview</p>}
    </div>
  );
}

function SearchDropdown<T extends { title: string; coverUrl: string }>({
  results, loading, onSelect, renderMeta
}: {
  results: T[];
  loading: boolean;
  onSelect: (r: T) => void;
  renderMeta: (r: T) => string;
}) {
  if (!loading && results.length === 0) return null;
  return (
    <div
      className="absolute top-full left-0 right-0 mt-1 rounded-xl z-30 overflow-hidden"
      style={{ background: '#F8F5EE', border: '1px solid #D4C9B8', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
    >
      {loading ? (
        <div className="px-3 py-4 text-xs text-[#9B928A] text-center">Searching…</div>
      ) : results.map((r, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-[#F2EDE4] transition-colors border-b last:border-0"
          style={{ borderColor: '#E0D8CC' }}
          onClick={() => onSelect(r)}
        >
          {r.coverUrl ? (
            <img src={r.coverUrl} alt="" className="rounded-sm object-cover flex-shrink-0" style={{ width: 28, height: 40 }} />
          ) : (
            <div className="rounded-sm flex-shrink-0 bg-[#E0D8CC]" style={{ width: 28, height: 40 }} />
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#1A1512] truncate" style={{ fontFamily: 'Georgia, serif' }}>{r.title}</p>
            <p className="text-xs text-[#9B928A] truncate">{renderMeta(r)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AddItemModal({ onClose, library }: Props) {
  const [itemType, setItemType] = useState<'book' | 'magazine'>('book');
  const [medium, setMedium] = useState<'physical' | 'digital'>('physical');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [bookForm, setBookForm] = useState({ title: '', author: '', category: 'Fiction', totalPages: '', coverUrl: '', openLibraryKey: '' });
  const [magForm, setMagForm] = useState({ title: '', publisher: '', issueNumber: '', coverUrl: '' });

  const [bookResults, setBookResults] = useState<BookResult[]>([]);
  const [magResults, setMagResults] = useState<MagazineResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const titleQuery = itemType === 'book' ? bookForm.title : magForm.title;
  const coverUrl = itemType === 'book' ? bookForm.coverUrl : magForm.coverUrl;

  useEffect(() => {
    if (titleQuery.length < 3) { setBookResults([]); setMagResults([]); setShowDropdown(false); return; }
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setSearching(true);
    setShowDropdown(true);

    const timer = setTimeout(async () => {
      try {
        if (itemType === 'book') {
          const results = await searchBooks(titleQuery, ctrl.signal);
          setBookResults(results);
        } else {
          const results = await searchMagazines(titleQuery, ctrl.signal);
          setMagResults(results);
        }
      } catch { /* aborted or network error */ }
      finally { setSearching(false); }
    }, 300);

    return () => { clearTimeout(timer); ctrl.abort(); };
  }, [titleQuery, itemType]);

  const selectBook = (r: BookResult) => {
    setBookForm({ title: r.title, author: r.author, category: r.category, totalPages: r.totalPages > 0 ? String(r.totalPages) : '', coverUrl: r.coverUrl, openLibraryKey: r.openLibraryKey });
    setShowDropdown(false);
    setBookResults([]);
  };

  const selectMagazine = (r: MagazineResult) => {
    setMagForm(p => ({ ...p, title: r.title, publisher: r.publisher, coverUrl: r.coverUrl }));
    setShowDropdown(false);
    setMagResults([]);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (itemType === 'book') {
      if (!bookForm.title.trim()) e.title = 'Required';
      if (!bookForm.author.trim()) e.author = 'Required';
      if (!bookForm.totalPages || Number(bookForm.totalPages) < 1) e.totalPages = 'Must be > 0';
    } else {
      if (!magForm.title.trim()) e.title = 'Required';
      if (!magForm.publisher.trim()) e.publisher = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (itemType === 'book') {
      library.addBook({ title: bookForm.title.trim(), author: bookForm.author.trim(), category: bookForm.category, totalPages: Number(bookForm.totalPages), medium, coverUrl: bookForm.coverUrl, openLibraryKey: bookForm.openLibraryKey });
    } else {
      library.addMagazine({ title: magForm.title.trim(), publisher: magForm.publisher.trim(), issueNumber: magForm.issueNumber.trim(), medium, coverUrl: magForm.coverUrl });
    }
    onClose();
  };

  return (
    <Modal title="Add to library" onClose={onClose}>
      <div className="mb-4"><SegmentToggle options={['book', 'magazine'] as const} value={itemType} onChange={v => { setItemType(v); setShowDropdown(false); }} /></div>
      <div className="mb-5">
        <p className="text-xs font-semibold tracking-wide uppercase text-[#6B6059] mb-1.5">Medium</p>
        <SegmentToggle
          options={['physical', 'digital'] as const}
          value={medium}
          onChange={setMedium}
        />
      </div>

      {/* On desktop: fields left, cover preview right */}
      <div className="flex gap-5">
        <div className="flex-1 flex flex-col gap-3">
          {itemType === 'book' ? (
            <>
              <div className="relative">
                <Input
                  label="Title"
                  value={bookForm.title}
                  onChange={e => { setBookForm(p => ({ ...p, title: e.target.value, coverUrl: '', openLibraryKey: '' })); }}
                  onFocus={() => { if (bookForm.title.length >= 3) setShowDropdown(true); }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  error={errors.title}
                  placeholder="Search or type a title…"
                  autoComplete="off"
                />
                {showDropdown && (
                  <SearchDropdown<BookResult>
                    results={bookResults}
                    loading={searching}
                    onSelect={selectBook}
                    renderMeta={r => `${r.author}${r.totalPages ? ` · ${r.totalPages}p` : ''}`}
                  />
                )}
              </div>
              <Input label="Author" value={bookForm.author} onChange={e => setBookForm(p => ({ ...p, author: e.target.value }))} error={errors.author} placeholder="e.g. F. Scott Fitzgerald" />
              <Select label="Category" value={bookForm.category} onChange={e => setBookForm(p => ({ ...p, category: e.target.value }))}>
                {BOOK_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </Select>
              <Input label="Total pages" type="number" min="1" value={bookForm.totalPages} onChange={e => setBookForm(p => ({ ...p, totalPages: e.target.value }))} error={errors.totalPages} placeholder="e.g. 320" />
            </>
          ) : (
            <>
              <div className="relative">
                <Input
                  label="Title"
                  value={magForm.title}
                  onChange={e => { setMagForm(p => ({ ...p, title: e.target.value, coverUrl: '' })); }}
                  onFocus={() => { if (magForm.title.length >= 3) setShowDropdown(true); }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  error={errors.title}
                  placeholder="Search or type a magazine…"
                  autoComplete="off"
                />
                {showDropdown && (
                  <SearchDropdown<MagazineResult>
                    results={magResults}
                    loading={searching}
                    onSelect={selectMagazine}
                    renderMeta={r => r.publisher}
                  />
                )}
              </div>
              <Input label="Publisher" value={magForm.publisher} onChange={e => setMagForm(p => ({ ...p, publisher: e.target.value }))} error={errors.publisher} placeholder="e.g. Condé Nast" />
              <Input label="Issue / Volume" value={magForm.issueNumber} onChange={e => setMagForm(p => ({ ...p, issueNumber: e.target.value }))} placeholder="e.g. Vol. 12 No. 3 (optional)" />
            </>
          )}
        </div>

        <CoverPreview url={coverUrl} />
      </div>

      <div className="flex gap-2 mt-5 justify-end">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add to library</Button>
      </div>
    </Modal>
  );
}
