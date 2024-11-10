import React from 'react';
import { BellIcon } from 'lucide-react';
import { useNotifications } from '../services/NotificationService';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = React.useState(false);
  const notificationRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(notificationRef, () => setIsOpen(false));

  const handleNotificationClick = (notificationId: string) => {
    markAsRead.mutate(notificationId);
    // Keep the dropdown open while mutating
    if (markAsRead.isLoading) return;
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
        aria-label={`${unreadCount} unread notifications`}
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-900 px-3 py-2">
              Notifications
            </h3>
            <div className="mt-2 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  No notifications
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        !notification.read
                          ? 'bg-indigo-50 hover:bg-indigo-100'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {notification.message}
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;