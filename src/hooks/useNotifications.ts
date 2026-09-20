import { useCallback, useMemo, useState } from "react";
import { notifications as initialNotifications } from "../mocks/notifications";
import type { Notification } from "../types/notification";

/** Read/unread state in memory (useState) — resets on reload, like the rest of this app's mocks. */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const markAsRead = useCallback((id: string) => {
    setNotifications((current) => current.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  }, []);

  const unreadCount = useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications]);

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}
