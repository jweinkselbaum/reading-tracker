import { useState } from 'react';
import type { LibraryItem } from '../../types';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { useLibrary } from '../../hooks/useLibrary';
import { useReadingLog } from '../../hooks/useReadingLog';
import { formatDate } from '../../utils/dates';
import { MediumBadge } from '../shared/MediumBadge';

interface Props {
  library: ReturnType<typeof useLibrary>;
  log: ReturnType<typeof useReadingLog>;
}

const pickerStyle: React.CSSProperties = {
  background: '#FDFAF5',
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.06)',
};

const dropdownStyle: React.CSSProperties = {
  background: '#F8F5EE',
  border: '1px solid #D4C9B8',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
};

function ItemPicker({ items, value, onChange }: { items: LibraryItem[]; value: string; onChange: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const filtered = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));
  const selected = items.find(i => i.id === value);

  return (
    <div className="relative">
      <p className="text-xs font-semibold tracking-wide uppercase text-[#6B6059] mb-1.5">Item</p>
      <div
        className="px-3 py-2.5 text-sm rounded-md cursor-pointer flex items-center justify-between gap-2 transition-shadow"
        style={pickerStyle}
        onClick={() => setOpen(o => !o)}
      >
        {selected ? (
          <span className="flex items-center gap-2 min-w-0">
            <MediumBadge medium={selected.medium} />
            <span className="truncate font-medium text-[#1A1512]">{selected.title}</span>
          </span>
        ) : (
          <span className="text-[#B0A89E]">Select an item…</span>
        )}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9B928A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points={open ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
        </svg>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl z-20 max-h-64 flex flex-col overflow-hidden" style={dropdownStyle}>
          <div className="p-2.5" style={{ borderBottom: '1px solid #E0D8CC' }}>
            <input
              className="w-full px-2.5 py-1.5 text-sm rounded-lg text-[#1A1512] placeholder-[#B0A89E] outline-none"
              style={{ background: '#FDFAF5', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)' }}
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-sm text-[#9B928A] text-center py-5">No items found</p>
            ) : filtered.map(item => (
              <div
                key={item.id}
                className="px-3 py-2.5 cursor-pointer flex items-center gap-2.5 transition-colors"
                style={{ background: item.id === value ? '#EBF0E6' : 'transparent' }}
                onMouseEnter={e => { if (item.id !== value) (e.currentTarget as HTMLElement).style.background = '#F2EDE4'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = item.id === value ? '#EBF0E6' : 'transparent'; }}
                onClick={() => { onChange(item.id); setOpen(false); setSearch(''); }}
              >
                <MediumBadge medium={item.medium} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1A1512] truncate">{item.title}</p>
                  <p className="text-xs text-[#9B928A]">
                    {item.type === 'book' ? item.author : item.publisher}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RecentLogs({ log, library }: { log: ReturnType<typeof useReadingLog>; library: ReturnType<typeof useLibrary> }) {
  const recent = log.entries.slice(0, 10);
  if (recent.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xs font-bold text-[#9B928A] uppercase tracking-widest mb-3">Recent sessions</h2>
      <div className="flex flex-col gap-2">
        {recent.map(entry => {
          const item = library.items.find(i => i.id === entry.itemId);
          const amount = entry.pagesRead != null ? `${entry.pagesRead} pages` : `${entry.articlesRead ?? 0} articles`;
          return (
            <div
              key={entry.id}
              className="flex items-center justify-between gap-3 p-3.5 rounded-xl"
              style={{ background: '#FDFAF5', border: '1px solid #E0D8CC', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A1512] truncate" style={{ fontFamily: 'Georgia, serif' }}>{item?.title ?? 'Unknown'}</p>
                <p className="text-xs text-[#9B928A] mt-0.5">{formatDate(entry.date)} · {amount}</p>
                <div className="mt-1.5"><MediumBadge medium={entry.medium} /></div>
              </div>
              <button onClick={() => log.removeEntry(entry.id)} className="text-[#C5BFBA] hover:text-[#8B2220] text-xl cursor-pointer leading-none transition-colors" aria-label="Delete">×</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LogPage({ library, log }: Props) {
  const [itemId, setItemId] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const selectedItem = library.items.find(i => i.id === itemId);

  const handleLog = () => {
    const e: Record<string, string> = {};
    if (!itemId) e.item = 'Select an item';
    if (!amount || Number(amount) < 1) e.amount = 'Must be at least 1';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const num = Number(amount);
    log.quickLog(itemId, selectedItem!.medium, selectedItem!.type === 'book' ? { pagesRead: num } : { articlesRead: num });
    setAmount('');
    setItemId('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-[#1A1512]" style={{ fontFamily: 'Georgia, serif' }}>Log reading</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {library.items.length === 0 ? (
          <div className="text-center py-16 text-[#9B928A]">
            <div className="w-10 h-10 mx-auto mb-3 opacity-25">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <p className="text-sm">Add items to your library first</p>
          </div>
        ) : (
          <>
            <div
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: '#FDFAF5', border: '1px solid #E0D8CC', boxShadow: '0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)' }}
            >
              <ItemPicker items={library.items} value={itemId} onChange={setItemId} />
              {errors.item && <p className="text-xs text-[#8B2220] -mt-1">{errors.item}</p>}

              <Input
                label={selectedItem?.type === 'magazine' ? 'Articles read' : 'Pages read'}
                type="number"
                min="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                error={errors.amount}
                placeholder={selectedItem?.type === 'magazine' ? 'e.g. 3' : 'e.g. 30'}
              />

              <Button className="w-full justify-center" onClick={handleLog}>Log session</Button>
            </div>

            <RecentLogs log={log} library={library} />
          </>
        )}
      </div>
    </div>
  );
}
