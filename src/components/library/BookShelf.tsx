import type { LibraryItem } from '../../types';

interface Props {
  items: LibraryItem[];
}

const SPINE_COLORS = [
  '#3A6127', '#5C3D1E', '#1E3A5A', '#6B2D2D', '#2D4A6B',
  '#4A3A1E', '#1E4A3A', '#5A2D5A', '#3A4A1E', '#2D3A5A',
];

function spineColor(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash * 31 + title.charCodeAt(i)) | 0;
  return SPINE_COLORS[Math.abs(hash) % SPINE_COLORS.length];
}

function initials(title: string): string {
  return title.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function CoverSlot({ item }: { item: LibraryItem }) {
  return (
    <div className="group relative flex flex-col items-center" style={{ width: 52 }}>
      {/* Book/magazine cover */}
      <div
        className="rounded-t-sm overflow-hidden flex-shrink-0 transition-transform group-hover:-translate-y-1.5"
        style={{
          width: 48,
          height: 68,
          background: item.coverUrl ? undefined : spineColor(item.title),
          boxShadow: '2px 2px 6px rgba(0,0,0,0.25), -1px 0 2px rgba(0,0,0,0.1)',
          position: 'relative',
        }}
      >
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={e => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
            }}
          />
        ) : null}
        {/* Fallback spine (shown when no cover or image fails) */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ display: item.coverUrl ? 'none' : 'flex', background: spineColor(item.title) }}
        >
          <span className="text-white/70 text-xs font-bold tracking-wider" style={{ fontSize: 10 }}>
            {initials(item.title)}
          </span>
        </div>
        {/* Left spine shadow */}
        <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: 'rgba(0,0,0,0.18)' }} />
      </div>
      {/* Tooltip on hover */}
      <div
        className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#1A1512] text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
        style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {item.title}
      </div>
    </div>
  );
}

function EmptySlot() {
  return (
    <div
      className="rounded-t-sm flex-shrink-0"
      style={{
        width: 48,
        height: 68,
        border: '1.5px dashed #C5BFBA',
        opacity: 0.4,
      }}
    />
  );
}

const SHELF_PLANK = 'linear-gradient(180deg, #D4AA7A 0%, #B8895A 35%, #9A6F42 70%, #8A6238 100%)';
const SHELF_HIGHLIGHT = 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)';

export function BookShelf({ items }: Props) {
  const EMPTY_SLOTS = 6;
  const filledSlots = items.slice(0, 40);
  const emptyCount = Math.max(0, EMPTY_SLOTS - filledSlots.length);

  return (
    <div
      className="mx-5 md:mx-8 mb-5 rounded-xl overflow-hidden"
      style={{
        background: '#E8E2D8',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)',
        border: '1px solid #D4C9B8',
      }}
    >
      {/* Shelf label */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <p className="text-xs font-bold text-[#9B928A] uppercase tracking-widest">Your Shelf</p>
        <p className="text-xs text-[#B0A89E]">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
      </div>

      {/* Scrollable items row */}
      <div className="px-4 pb-0 overflow-x-auto">
        <div className="flex gap-2 items-end" style={{ minHeight: 80 }}>
          {filledSlots.length === 0 && emptyCount === 0 ? null : (
            <>
              {filledSlots.map(item => <CoverSlot key={item.id} item={item} />)}
              {Array.from({ length: emptyCount }).map((_, i) => <EmptySlot key={i} />)}
            </>
          )}
          {items.length === 0 && (
            <div className="flex-1 flex items-center justify-center pb-2">
              <p className="text-xs text-[#B0A89E] italic">Add a book or magazine to fill your shelf</p>
            </div>
          )}
        </div>
      </div>

      {/* Wooden plank */}
      <div style={{ height: 14, background: SHELF_PLANK, position: 'relative', marginTop: 2 }}>
        <div style={{ position: 'absolute', inset: 0, background: SHELF_HIGHLIGHT }} />
        {/* Plank shadow under top edge */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(0,0,0,0.12)' }} />
      </div>
    </div>
  );
}
