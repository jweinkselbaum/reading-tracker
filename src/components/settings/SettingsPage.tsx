import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../shared/Button';

interface Props {
  notifications: ReturnType<typeof useNotifications>;
  onClearData: () => void;
}

export function SettingsPage({ notifications, onClearData }: Props) {
  const { settings, permissionState, enable, disable, updateTime } = notifications;

  const handleToggle = async () => {
    if (settings.enabled) {
      disable();
    } else {
      const result = await enable();
      if (result === 'denied') {
        alert('Notification permission denied. Please enable it in your browser settings, then try again.');
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Daily reading reminder</p>
              <p className="text-xs text-gray-400 mt-0.5">Get nudged to pick up something physical</p>
            </div>
            <button
              onClick={handleToggle}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${settings.enabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
              aria-label="Toggle notifications"
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.enabled ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          {settings.enabled && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <label className="text-sm font-medium text-gray-700 block mb-1">Reminder time</label>
              <input
                type="time"
                value={settings.time}
                onChange={e => updateTime(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            {permissionState === 'denied'
              ? '⚠️ Notifications are blocked by your browser. Enable them in browser settings.'
              : '📝 Notifications only fire while this tab is open.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-red-100 p-4">
          <p className="text-sm font-semibold text-gray-900 mb-1">Danger zone</p>
          <p className="text-xs text-gray-400 mb-3">Permanently delete all your reading data</p>
          <Button variant="danger" size="sm" onClick={() => {
            if (confirm('Delete all data? This cannot be undone.')) onClearData();
          }}>
            Clear all data
          </Button>
        </div>
      </div>
    </div>
  );
}
