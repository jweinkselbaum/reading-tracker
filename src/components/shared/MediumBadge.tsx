import type { Medium } from '../../types';

export function MediumBadge({ medium }: { medium: Medium }) {
  const isPhysical = medium === 'physical';
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded tracking-wide uppercase"
      style={isPhysical
        ? { background: '#EBF0E6', color: '#2C4A1E', border: '1px solid #C5D6BA' }
        : { background: '#EAF0F5', color: '#2A4A5E', border: '1px solid #BAC9D6' }
      }
    >
      {isPhysical ? 'Physical' : 'Digital'}
    </span>
  );
}
