import React from 'react';
import type { TabId } from '../../types';

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}

function PenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="4" height="9" rx="1"/>
      <rect x="10" y="7" width="4" height="14" rx="1"/>
      <rect x="17" y="3" width="4" height="18" rx="1"/>
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

const tabs: { id: TabId; label: string; Icon: () => React.ReactElement }[] = [
  { id: 'library',   label: 'Library',   Icon: BookIcon },
  { id: 'log',       label: 'Log',       Icon: PenIcon },
  { id: 'dashboard', label: 'Dashboard', Icon: ChartIcon },
  { id: 'settings',  label: 'Settings',  Icon: GearIcon },
];

export function Sidebar({ active, onChange }: Props) {
  return (
    <aside
      className="hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0"
      style={{
        width: 220,
        background: '#EBE5D8',
        borderRight: '1px solid #D4C9B8',
        boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
      }}
    >
      <div className="px-5 pt-7 pb-6" style={{ borderBottom: '1px solid #D4C9B8' }}>
        <p className="text-xs font-semibold tracking-widest uppercase text-[#9B928A] mb-1">Your</p>
        <h1 className="text-xl font-bold text-[#1A1512] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
          Reading<br />Tracker
        </h1>
      </div>

      <nav className="flex flex-col gap-0.5 p-3 flex-1">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer text-left w-full"
              style={isActive ? {
                background: '#E6EEE0',
                color: '#2C4A1E',
                borderLeft: '3px solid #2C4A1E',
                paddingLeft: 9,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
              } : {
                color: '#6B6059',
                borderLeft: '3px solid transparent',
                paddingLeft: 9,
              }}
            >
              <Icon />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4" style={{ borderTop: '1px solid #D4C9B8' }}>
        <p className="text-xs text-[#B0A89E] leading-relaxed">All data stored locally in your browser.</p>
      </div>
    </aside>
  );
}
