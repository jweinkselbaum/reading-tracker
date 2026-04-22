import type { Medium } from '../../types';

export function MediumBadge({ medium }: { medium: Medium }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
      medium === 'physical'
        ? 'bg-green-100 text-green-700'
        : 'bg-blue-100 text-blue-700'
    }`}>
      {medium === 'physical' ? '📖' : '📱'} {medium}
    </span>
  );
}
