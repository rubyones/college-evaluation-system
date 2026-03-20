import React, { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useClickOutside } from '@/hooks';
import { formatTime } from '@/utils/helpers';
import { Notification } from '@/types';

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
}

export function NotificationDropdown({
  notifications,
  onMarkAsRead,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false));

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'pending-evaluation':
        return <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'result-available':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'deadline-warning':
        return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'system-alert':
        return <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No notifications
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => {
                    onMarkAsRead?.(notif.id);
                  }}
                  className={`w-full px-4 py-3 text-left border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    notif.readAt ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {notif.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatTime(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
