import { useState } from 'react';
import type { TabId } from './types';
import { TabBar } from './components/layout/TabBar';
import { LibraryPage } from './components/library/LibraryPage';
import { LogPage } from './components/log/LogPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { useLibrary } from './hooks/useLibrary';
import { useReadingLog } from './hooks/useReadingLog';
import { useNotifications } from './hooks/useNotifications';
import { setItem, KEYS } from './utils/storage';

export default function App() {
  const [tab, setTab] = useState<TabId>('dashboard');
  const library = useLibrary();
  const log = useReadingLog();
  const notifications = useNotifications();

  const handleClearData = () => {
    setItem(KEYS.library, []);
    setItem(KEYS.log, []);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto min-h-screen bg-gray-50 relative">
        {tab === 'library' && <LibraryPage library={library} />}
        {tab === 'log' && <LogPage library={library} log={log} />}
        {tab === 'dashboard' && <DashboardPage log={log} />}
        {tab === 'settings' && <SettingsPage notifications={notifications} onClearData={handleClearData} />}
        <TabBar active={tab} onChange={setTab} />
      </div>
    </div>
  );
}
