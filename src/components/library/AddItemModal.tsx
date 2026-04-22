import { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Select } from '../shared/Select';
import { useLibrary } from '../../hooks/useLibrary';

const BOOK_CATEGORIES = ['Fiction', 'Non-fiction', 'Science', 'History', 'Biography', 'Self-help', 'Technology', 'Philosophy', 'Art', 'Other'];

interface Props {
  onClose: () => void;
  library: ReturnType<typeof useLibrary>;
}

function TypeToggle({ value, onChange }: { value: 'book' | 'magazine'; onChange: (v: 'book' | 'magazine') => void }) {
  return (
    <div
      className="flex rounded-lg p-0.5 mb-4"
      style={{ background: '#E0D8CC', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)' }}
    >
      {(['book', 'magazine'] as const).map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className="flex-1 py-2 rounded-md text-sm font-medium transition-all cursor-pointer capitalize"
          style={value === t
            ? { background: '#F8F5EE', color: '#1A1512', boxShadow: '0 1px 3px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)' }
            : { color: '#6B6059', background: 'transparent' }
          }
        >
          {t === 'book' ? 'Book' : 'Magazine'}
        </button>
      ))}
    </div>
  );
}

function MediumToggle({ value, onChange }: { value: 'physical' | 'digital'; onChange: (v: 'physical' | 'digital') => void }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold tracking-wide uppercase text-[#6B6059] mb-1.5">Medium</p>
      <div
        className="flex rounded-lg p-0.5"
        style={{ background: '#E0D8CC', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)' }}
      >
        {(['physical', 'digital'] as const).map(m => (
          <button
            key={m}
            onClick={() => onChange(m)}
            className="flex-1 py-2 rounded-md text-sm font-medium transition-all cursor-pointer capitalize"
            style={value === m
              ? { background: '#2C4A1E', color: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }
              : { color: '#6B6059', background: 'transparent' }
            }
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AddItemModal({ onClose, library }: Props) {
  const [itemType, setItemType] = useState<'book' | 'magazine'>('book');
  const [medium, setMedium] = useState<'physical' | 'digital'>('physical');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookForm, setBookForm] = useState({ title: '', author: '', category: 'Fiction', totalPages: '' });
  const [magForm, setMagForm] = useState({ title: '', publisher: '', issueNumber: '' });

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
      library.addBook({ title: bookForm.title.trim(), author: bookForm.author.trim(), category: bookForm.category, totalPages: Number(bookForm.totalPages), medium });
    } else {
      library.addMagazine({ title: magForm.title.trim(), publisher: magForm.publisher.trim(), issueNumber: magForm.issueNumber.trim(), medium });
    }
    onClose();
  };

  return (
    <Modal title="Add to library" onClose={onClose}>
      <TypeToggle value={itemType} onChange={setItemType} />
      <MediumToggle value={medium} onChange={setMedium} />

      <div className="flex flex-col gap-3">
        {itemType === 'book' ? (
          <>
            <Input label="Title" value={bookForm.title} onChange={e => setBookForm(p => ({ ...p, title: e.target.value }))} error={errors.title} placeholder="e.g. The Great Gatsby" />
            <Input label="Author" value={bookForm.author} onChange={e => setBookForm(p => ({ ...p, author: e.target.value }))} error={errors.author} placeholder="e.g. F. Scott Fitzgerald" />
            <Select label="Category" value={bookForm.category} onChange={e => setBookForm(p => ({ ...p, category: e.target.value }))}>
              {BOOK_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </Select>
            <Input label="Total pages" type="number" min="1" value={bookForm.totalPages} onChange={e => setBookForm(p => ({ ...p, totalPages: e.target.value }))} error={errors.totalPages} placeholder="e.g. 320" />
          </>
        ) : (
          <>
            <Input label="Title" value={magForm.title} onChange={e => setMagForm(p => ({ ...p, title: e.target.value }))} error={errors.title} placeholder="e.g. The New Yorker" />
            <Input label="Publisher" value={magForm.publisher} onChange={e => setMagForm(p => ({ ...p, publisher: e.target.value }))} error={errors.publisher} placeholder="e.g. Condé Nast" />
            <Input label="Issue / Volume" value={magForm.issueNumber} onChange={e => setMagForm(p => ({ ...p, issueNumber: e.target.value }))} placeholder="e.g. Vol. 12 No. 3 (optional)" />
          </>
        )}
      </div>

      <div className="flex gap-2 mt-5 justify-end">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add to library</Button>
      </div>
    </Modal>
  );
}
