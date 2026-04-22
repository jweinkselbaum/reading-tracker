import { useState, useEffect, useCallback } from 'react';
import type { NotificationSettings } from '../types';
import { getItem, setItem, KEYS } from '../utils/storage';
import { today } from '../utils/dates';

const DEFAULT: NotificationSettings = { enabled: false, time: '20:00', lastPromptedDate: null };

function load(): NotificationSettings {
  return getItem<NotificationSettings>(KEYS.notifications) ?? DEFAULT;
}

export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>(load);
  const [permissionState, setPermissionState] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );

  const persist = useCallback((next: NotificationSettings) => {
    setItem(KEYS.notifications, next);
    setSettings(next);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'denied' as NotificationPermission;
    const result = await Notification.requestPermission();
    setPermissionState(result);
    return result;
  }, []);

  const enable = useCallback(async () => {
    const result = await requestPermission();
    if (result === 'granted') {
      persist({ ...settings, enabled: true });
    }
    return result;
  }, [settings, persist, requestPermission]);

  const disable = useCallback(() => {
    persist({ ...settings, enabled: false });
  }, [settings, persist]);

  const updateTime = useCallback((time: string) => {
    persist({ ...settings, time });
  }, [settings, persist]);

  useEffect(() => {
    if (!settings.enabled || permissionState !== 'granted') return;

    const check = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hh}:${mm}`;
      const todayStr = today();

      if (currentTime === settings.time && settings.lastPromptedDate !== todayStr) {
        new Notification('Time to read! 📚', {
          body: 'Pick up something physical today and keep your streak going.',
        });
        persist({ ...settings, lastPromptedDate: todayStr });
      }
    };

    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [settings, permissionState, persist]);

  return { settings, permissionState, enable, disable, updateTime };
}
