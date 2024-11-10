import { useQuery, useMutation, useQueryClient } from 'react-query';

interface Notification {
  id: string;
  userId: string;
  type: 'IDEA_STATUS_CHANGE' | 'REVIEW_ADDED' | 'COMMENT_ADDED';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Mock data for development
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'REVIEW_ADDED',
    title: 'New Review Added',
    message: 'Your idea "AI-Powered Code Review Assistant" has received a new review.',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: '1',
    type: 'IDEA_STATUS_CHANGE',
    title: 'Idea Status Updated',
    message: 'Your idea has moved to the Second Level Review stage.',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export function useNotifications() {
  const queryClient = useQueryClient();

  const { data: notifications = mockNotifications } = useQuery<Notification[]>(
    'notifications',
    async () => {
      try {
        const response = await fetch('/api/notifications');
        if (!response.ok) return mockNotifications;
        return response.json();
      } catch (error) {
        console.warn('Using mock notifications:', error);
        return mockNotifications;
      }
    },
    {
      refetchInterval: 30000, // Poll every 30 seconds
      staleTime: 10000, // Consider data fresh for 10 seconds
      cacheTime: 300000, // Keep data in cache for 5 minutes
    }
  );

  const markAsRead = useMutation(
    async (notificationId: string) => {
      try {
        const response = await fetch(`/api/notifications/${notificationId}/read`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to mark notification as read');
        return response.json();
      } catch (error) {
        // For development, simulate successful marking as read
        const updatedNotifications = notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        );
        return updatedNotifications;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
      },
    }
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
  };
}

export async function subscribeToNotifications(userId: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const eventSource = new EventSource(`/api/notifications/subscribe/${userId}`);
      
      eventSource.onmessage = (event) => {
        const notification = JSON.parse(event.data);
        new Notification(notification.title, {
          body: notification.message,
          icon: '/notification-icon.png',
          tag: notification.id, // Prevent duplicate notifications
          requireInteraction: true, // Keep notification visible until user interacts
        });
      };

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
      };

      return () => eventSource.close();
    } catch (error) {
      console.error('Failed to subscribe to notifications:', error);
    }
  }
  return () => {}; // Return empty cleanup function if notifications aren't supported
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}