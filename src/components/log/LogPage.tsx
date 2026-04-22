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

function ItemPicker({ items, value, onChange }: { items: LibraryItem[]; value: string; onChange: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));
  const selected = items.find(i => i.id === value);

  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 block mb-1">Item</label>
      <div
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg cursor-pointer flex items-center justify-between gap-2 hover:border-indigo-400 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        {selected ? (
          <span className="flex items-center gap-2 min-w-0">
            <MediumBadge medium={selected.medium} />
            <span className="truncate font-medium text-gray-900">{selected.title}</span>
          </span>
        ) : (
          <span className="text-gray-400">Select an item…</span>
        )}
        <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-60 flex flex-col">
          <div className="p-2 border-b border-gray-100">
            <input
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No items found</p>
            ) : filtered.map(item => (
              <div
                key={item.id}
                className={`px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-indigo-50 ${item.id === value ? 'bg-indigo-50' : ''}`}
                onClick={() => { onChange(item.id); setOpen(false); setSearch(''); }}
              >
                <MediumBadge medium={item.medium} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                  <p className="text-xs text-gray-400">
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
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Recent sessions</h2>
      <div className="flex flex-col gap-2">
        {recent.map(entry => {
          const item = library.items.find(i => i.id === entry.itemId);
          const amount = entry.pagesRead != null ? `${entry.pagesRead} pages` : `${entry.articlesRead ?? 0} articles`;
          return (
            <div key={entry.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100 bg-white">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item?.title ?? 'Unknown'}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(entry.date)} · {amount}</p>
                <div className="mt-1"><MediumBadge medium={entry.medium} /></div>
              </div>
              <button onClick={() => log.removeEntry(entry.id)} className="text-gray-300 hover:text-red-400 text-lg cursor-pointer leading-none" aria-label="Delete">×</button>
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
    log.quickLog(
      itemId,
      selectedItem!.medium,
      selectedItem!.type === 'book' ? { pagesRead: num } : { articlesRead: num },
    );
    setAmount('');
    setItemId('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold text-gray-900">Log reading</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {library.items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">✏️</div>
            <p className="text-sm">Add items to your library first</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3">
              <ItemPicker items={library.items} value={itemId} onChange={setItemId} />
              {errors.item && <p className="text-xs text-red-600 -mt-2">{errors.item}</p>}

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
