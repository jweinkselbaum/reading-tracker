import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../shared/Button';

interface Props {
  notifications: ReturnType<typeof useNotifications>;
  onClearData: () => void;
}

const sectionStyle: React.CSSProperties = {
  background: '#FDFAF5',
  border: '1px solid #E0D8CC',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
};

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
    <div className="px-5 md:px-8 pt-6 pb-24 md:pb-8 max-w-xl">
      <h1 className="text-2xl font-bold text-[#1A1512] mb-5" style={{ fontFamily: 'Georgia, serif' }}>Settings</h1>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl p-4" style={sectionStyle}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#1A1512]">Daily reading reminder</p>
              <p className="text-xs text-[#9B928A] mt-0.5">Get nudged to pick up something physical</p>
            </div>
            <button
              onClick={handleToggle}
              className="relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0"
              style={{
                background: settings.enabled ? '#2C4A1E' : '#D4C9B8',
                boxShadow: settings.enabled
                  ? 'inset 0 1px 3px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.1)'
                  : 'inset 0 1px 3px rgba(0,0,0,0.15)',
              }}
              aria-label="Toggle notifications"
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"
                style={{
                  transform: settings.enabled ? 'translateX(20px)' : 'translateX(0)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </button>
          </div>

          {settings.enabled && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid #E0D8CC' }}>
              <label className="text-xs font-semibold tracking-wide uppercase text-[#6B6059] block mb-1.5">
                Reminder time
              </label>
              <input
                type="time"
                value={settings.time}
                onChange={e => updateTime(e.target.value)}
                className="px-3 py-2 text-sm rounded-md text-[#1A1512] outline-none focus:ring-2 focus:ring-[#2C4A1E]/30"
                style={{ background: '#FDFAF5', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.06)' }}
              />
            </div>
          )}

          <p className="text-xs text-[#B0A89E] mt-3 leading-relaxed">
            {permissionState === 'denied'
              ? 'Notifications are blocked by your browser. Enable them in browser settings.'
              : 'Notifications only fire while this tab is open.'}
          </p>
        </div>

        <div className="rounded-2xl p-4" style={{ ...sectionStyle, borderColor: '#E0C8C8' }}>
          <p className="text-sm font-semibold text-[#1A1512] mb-1">Danger zone</p>
          <p className="text-xs text-[#9B928A] mb-3">Permanently delete all your reading data</p>
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
