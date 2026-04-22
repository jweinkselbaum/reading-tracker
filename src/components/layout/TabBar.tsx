import type { TabId } from '../../types';

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'library', label: 'Library', icon: '📚' },
  { id: 'log', label: 'Log', icon: '✏️' },
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-lg mx-auto flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
              active === tab.id ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
